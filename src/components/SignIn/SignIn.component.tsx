import React, {
  FormEvent,
  useState,
  useContext,
  useEffect,
} from 'react';
import { defaultFormField } from './defaultValue';
import {
  signInWithGooglePopOut,
  signInAuthUserWithEmailAndPassword,
} from '../../services/firebase/firebase.auth';

import { FormInput } from '../FormInput/FormInput.component';
import { Button } from '../Button/Button.component';
import { LoadingWithinButton } from '../Loadiing/Loading.component';

import './SignIn.styles.scss';

export function SignIn() {
  const [formFields, setFormFields] = useState(defaultFormField);
  const [isLoadingEmail, setLoadingEmail] = useState(false);
  const [isLoadingGoogle, setLoadingGoogle] = useState(false);
  const {
    email,
    password,
  } = formFields;


  async function signInWithGoogle() {
    setLoadingGoogle(true);
    try {
      await signInWithGooglePopOut();
      setLoadingGoogle(false);
      window.location.href = '/';
    } catch (err) {
      setLoadingGoogle(false);
      console.log(err);
    }
  }

  function resetFormField() {
    setFormFields(defaultFormField);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormFields({
      ...formFields,
      [name]: value,
    });
  }

  //replace this with joy
  function simpleValidationHandleSubmit(email: string, password: string) {
    if (!email || !password) {
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingEmail(true);

    try {
      //TO DO: Fix this validation
      console.log('fix this validation');
      if (!simpleValidationHandleSubmit(email, password)) {
        throw new Error('Validation Error');
      }

      await signInAuthUserWithEmailAndPassword(email, password);

      resetFormField();
      setLoadingEmail(false);
      window.location.href = '/';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoadingEmail(false);
      resetFormField();
      if (err?.code === 'auth/wrong-password') {
        // eslint-disable-next-line no-console
        console.log('Future me! Hey do something about "auth/wrong-password"');
      }
      if (err?.code === 'auth/user-not-found') {
        // eslint-disable-next-line no-console
        console.log('Future me! Hey do something about :"auth/user-not-found"');
      }
      console.log(err);
    }
  }

  return (
    <div className='sign-in-container'>
      <h2>Already have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Email'
          type='email'
          name='email'
          required
          onChange={handleChange}
          value={email}
        />

        <FormInput
          label='Password'
          type='password'
          name='password'
          required
          onChange={handleChange}
          value={password}
        />

        <div className='buttons-container'>
          <Button buttonType='default' type='submit'>
            {isLoadingEmail ? (
              <LoadingWithinButton />
            ) : (
              'Sign In'
            )}

          </Button>
          <Button buttonType='google' type='button' onClick={signInWithGoogle} >
            {isLoadingGoogle ? (
              <LoadingWithinButton textColor='text-warning' />
            ) : (
              'Google Sign In'
            )}

          </Button>
        </div>
      </form>
    </div>
  );
}