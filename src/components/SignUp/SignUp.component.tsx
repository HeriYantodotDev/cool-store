/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { FormEvent, useState } from 'react';
import * as yup from 'yup';
import {
  defaultFormField,
  defaultErrorMessageSignUp,
  defaultErrorMessageSignUpGoogle,
} from './defaultValue';

import { createUserDocumentFromAuth } from '../../services/firebase/db/users.db';

import FormInput from '../FormInput/FormInput.component';
import Button from '../Button/Button.component';
import LoadingWithinButton from '../Loading/Loading.component';
import {
  signUpWithGooglePopOut,
  createAuthUserWithEmailAndPassword,
} from '../../services/firebase/firebase.auth';

import { signUpSchema } from '../../services/utils/validators/signUpSchema';
import { AuthErrorsEnum } from '../../services/utils/Enum/AuthErrors.enum';
import { BUTTON_TYPE_CLASSES } from '../../Types';

import './SignUp.styles.scss';
import { ErrorEmailInUse } from '../../services/utils/Errors/ErrorClass';

export default function SignUp() {
  const [formFields, setFormFields] = useState(defaultFormField);
  const [isLoadingEmail, setLoadingEmail] = useState(false);
  const [isLoadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessageSignUp);
  const [errorMessageGoogle, setErrorMessageGoogle] = useState(
    defaultErrorMessageSignUpGoogle
  );
  const { displayName, email, password, confirmPassword } = formFields;

  function resetFormField() {
    setFormFields(defaultFormField);
  }

  function resetErrorMessage() {
    setErrorMessage(defaultErrorMessageSignUp);
  }

  function resetErrorMessageGoogle() {
    setErrorMessageGoogle(defaultErrorMessageSignUpGoogle);
  }

  function resetFormErrorLoading() {
    setLoadingGoogle(false);
    setLoadingEmail(false);
    resetErrorMessage();
    resetFormField();
    resetErrorMessageGoogle();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleError(err: any) {
    resetFormErrorLoading();

    if (yup.ValidationError.isError(err)) {
      let errorList = defaultErrorMessageSignUp;
      // eslint-disable-next-line no-restricted-syntax
      for (const inner of err.inner) {
        const path = inner.params?.path ?? '';
        const errorMessageKey = path as keyof typeof errorList;
        errorList = {
          ...errorList,
          [errorMessageKey]: inner.errors[0],
        };
      }

      setErrorMessage(errorList);
      return;
    }

    if (err?.code === 'auth/email-already-in-use') {
      setErrorMessage({
        ...defaultErrorMessageSignUp,
        email: AuthErrorsEnum.emailInUse,
      });
      return;
    }

    if (err instanceof ErrorEmailInUse) {
      setErrorMessageGoogle(err.message);
    }

    // eslint-disable-next-line no-console
    console.log(err);
  }

  async function signUpWithGoogle() {
    setLoadingGoogle(true);
    try {
      const response = await signUpWithGooglePopOut();

      const user = response?.user;

      if (!response || !user) {
        throw new Error('Something went wrong with the Auth process');
      }

      await createUserDocumentFromAuth(user);

      setLoadingGoogle(false);

      resetFormErrorLoading();
      window.location.href = '/';
    } catch (err) {
      handleError(err);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormFields({
      ...formFields,
      [name]: value,
    });
  }

  async function signUpFormValidation(
    displayName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    await signUpSchema.validate(
      {
        displayName,
        email,
        password,
        confirmPassword,
      },
      { abortEarly: false }
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingEmail(true);
    try {
      await signUpFormValidation(displayName, email, password, confirmPassword);

      const response = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      const user = response?.user;
      if (!response || !user) {
        throw new Error('Something went wrong with the Auth process');
      }

      await createUserDocumentFromAuth(user, { displayName });

      resetFormErrorLoading();
      window.location.href = '/';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleError(err);
    }
  }

  return (
    <div className="sign-up-container" data-testid="signUpContainer">
      <h2>Don&apos;t have an account? </h2>
      <span>Sign up with email, password, or Google.</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Display Name"
          errorMessage={errorMessage.displayName}
          type="text"
          name="displayName"
          required
          onChange={handleChange}
          value={displayName}
          data-testid="displayName"
        />

        <FormInput
          label="Email"
          errorMessage={errorMessage.email}
          type="email"
          name="email"
          required
          onChange={handleChange}
          value={email}
          data-testid="email"
        />

        <FormInput
          label="Password"
          errorMessage={errorMessage.password}
          type="password"
          name="password"
          required
          onChange={handleChange}
          value={password}
          data-testid="password"
        />

        <FormInput
          label="Confirm Password"
          errorMessage={errorMessage.confirmPassword}
          type="password"
          name="confirmPassword"
          required
          onChange={handleChange}
          value={confirmPassword}
          data-testid="confirmPassword"
        />

        {errorMessageGoogle && (
          <div className="error-message">{errorMessageGoogle}</div>
        )}

        <div className="buttons-container">
          <Button
            buttonType={BUTTON_TYPE_CLASSES.default}
            type="submit"
            data-testid="submitButton"
          >
            {isLoadingEmail ? <LoadingWithinButton /> : 'Sign Up'}
          </Button>

          <Button
            onClick={signUpWithGoogle}
            buttonType={BUTTON_TYPE_CLASSES.google}
            type="button"
          >
            {isLoadingGoogle ? <LoadingWithinButton /> : 'Google Sign Up'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// First I'm going to add the element or component to display the error message
// Add a state to it
// Add the logic to it
// => Joi
// => display the error message
// => etc
//
