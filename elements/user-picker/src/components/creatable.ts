import memoizeOne from 'memoize-one';
import { EmailType, Option } from '../types';
import {
  EmailValidationResponse,
  EmailValidator,
  isValidEmail as defaultIsValidEmail,
} from './emailValidation';
import { isEmail } from './utils';

const validOption: EmailValidationResponse[] = ['VALID', 'POTENTIAL'];

const isValidNewOption = (
  isValidEmail: EmailValidator = defaultIsValidEmail,
) => (inputValue?: string) =>
  inputValue && validOption.includes(isValidEmail(inputValue));

const getNewOptionData = (inputValue: string): Option => ({
  label: inputValue,
  value: inputValue,
  data: {
    id: inputValue,
    name: inputValue,
    type: EmailType,
  },
});

const formatCreateLabel = (inputText?: string) => {
  if (inputText) {
    return inputText.trim();
  }
  return '';
};

const isOptionDisabled = (
  isValidEmail: EmailValidator = defaultIsValidEmail,
) => (option: Option) => {
  if (isEmail(option.data)) {
    return isValidEmail(option.data.id) !== 'VALID';
  }
  return false;
};

function creatableProps(isValidEmail?: EmailValidator) {
  return {
    allowCreateWhileLoading: true,
    createOptionPosition: 'first',
    isValidNewOption: isValidNewOption(isValidEmail),
    getNewOptionData,
    formatCreateLabel,
    isOptionDisabled: isOptionDisabled(isValidEmail),
  };
}

// ignoring the 'clear' memoizeOne function object property
export const getCreatableProps: typeof creatableProps = memoizeOne(
  creatableProps,
);
