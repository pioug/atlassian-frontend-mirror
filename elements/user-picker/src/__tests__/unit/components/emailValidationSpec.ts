import { isValidEmail } from '../../../components/emailValidation';

describe('emailValidation', () => {
  test.each([
    ['INVALID', ''],
    ['INVALID', ' '],
    ['INVALID', 'abc'],
    ['INVALID', '123'],
    ['POTENTIAL', 'someEmail@'],
    ['POTENTIAL', 'someEmail@atlassian'],
    ['VALID', 'someEmail@atlassian.com'],
  ])('should return "%s" for "%s" input text', (expectation, inputText) => {
    expect(isValidEmail(inputText)).toEqual(expectation);
  });
});
