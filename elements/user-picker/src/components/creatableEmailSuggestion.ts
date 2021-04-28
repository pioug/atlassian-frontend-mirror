import memoizeOne from 'memoize-one';
import { EmailType, Option } from '../types';
import {
  EmailValidationResponse,
  EmailValidator,
  isValidEmail as defaultIsValidEmail,
} from './emailValidation';
import { isEmail } from './utils';

const validOption: EmailValidationResponse[] = ['VALID', 'POTENTIAL'];

const isValidNewOption = (inputValue?: string) =>
  inputValue && inputValue.length > 0;

// Generates suggested option data based on user input and validity of the input (if it is an email or not);
const getNewOptionData = (
  isValidEmail: EmailValidator = defaultIsValidEmail,
  emailDomain: string,
) => (inputValue?: string) => {
  if (!inputValue) {
    return null;
  }
  const isEmail = inputValue && validOption.includes(isValidEmail(inputValue));
  const value = isEmail
    ? inputValue
    : `${inputValue.replace(/\s+/g, '.').toLocaleLowerCase()}@${emailDomain}`;
  return {
    label: value,
    value: value,
    data: {
      id: value,
      name: value,
      type: EmailType,
      suggestion: true,
    },
  };
};

const formatCreateLabel = (inputText?: string) => {
  if (inputText) {
    return inputText.trim();
  }
  return '';
};

// Option will not be selectable until the email value is valid and can actually be invited
const isOptionDisabled = (
  isValidEmail: EmailValidator = defaultIsValidEmail,
) => (option: Option) => {
  if (isEmail(option.data)) {
    return isValidEmail(option.data.id) !== 'VALID';
  }
  return false;
};

// Generates user picker props to always create an email item visible
// to the user as a suggested option when they are typing in a value
export const getCreatableSuggestedEmailProps = memoizeOne(
  (emailDomain: string, isValidEmail?: EmailValidator) => ({
    allowCreateWhileLoading: true,
    createOptionPosition: 'last',
    isValidNewOption,
    getNewOptionData: getNewOptionData(isValidEmail, emailDomain),
    formatCreateLabel,
    isOptionDisabled: isOptionDisabled(isValidEmail),
  }),
);
