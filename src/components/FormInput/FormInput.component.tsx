import { FormInput } from '../../Types';
import './FormInput.styles.scss';

export function FormInput({
  label,
  errorMessage,
  ...otherProps
}: FormInput) {
  return (
    <div className='group' data-testid={otherProps['data-testid'] + 'Group'}>
      <input className='form-input'{...otherProps} />
      {
        label && (
          <label className={`${otherProps.value.length ? 'shrink' : ''} form-input-label`}>{label}</label>
        )}
      {
        errorMessage && (
          <div className='error-message'>
            {errorMessage}
          </div>
        )
      }
    </div>
  );
} 