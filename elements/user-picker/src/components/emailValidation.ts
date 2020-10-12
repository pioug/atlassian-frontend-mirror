export type EmailValidationResponse = 'INVALID' | 'POTENTIAL' | 'VALID';

const validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const potentialRegex = /^[^\s@]+@[^\s@]*$/i;

export type EmailValidator = (inputText: string) => EmailValidationResponse;

export const isValidEmail: EmailValidator = (inputText: string) => {
  if (inputText.match(validRegex)) {
    return 'VALID';
  }
  if (inputText.match(potentialRegex)) {
    return 'POTENTIAL';
  }
  return 'INVALID';
};
