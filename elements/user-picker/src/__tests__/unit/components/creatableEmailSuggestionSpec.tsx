jest.mock('../../../components/emailValidation', () => ({
  isValidEmail: jest.fn(),
}));

import { getCreatableSuggestedEmailProps } from '../../../components/creatableEmailSuggestion';
import {
  isValidEmail,
  EmailValidationResponse,
} from '../../../components/emailValidation';
import { EmailType } from '../../../types';

describe('getCreatableSuggestedEmailProps', () => {
  const emailDomain = 'test.com';
  let isValidNewOption: any;
  let getNewOptionData: any;
  let formatCreateLabel: any;
  let isOptionDisabled: any;
  beforeAll(() => {
    const creatableProps = getCreatableSuggestedEmailProps(emailDomain);
    isValidNewOption = creatableProps.isValidNewOption;
    getNewOptionData = creatableProps.getNewOptionData;
    formatCreateLabel = creatableProps.formatCreateLabel;
    isOptionDisabled = creatableProps.isOptionDisabled;
  });

  afterEach(() => {
    (isValidEmail as jest.Mock).mockClear();
  });

  it('should return creatableProps when called', () => {
    expect(getCreatableSuggestedEmailProps(emailDomain)).toMatchObject({
      allowCreateWhileLoading: true,
      createOptionPosition: 'last',
      isValidNewOption: expect.any(Function),
      getNewOptionData: expect.any(Function),
      formatCreateLabel: expect.any(Function),
      isOptionDisabled: expect.any(Function),
    });
  });

  describe('isValidOption', () => {
    it('should return true if inputValue is defined and has at least 1 char', () => {
      expect(isValidNewOption('a')).toBeTruthy();
    });

    it('should return false if inputValue is undefined', () => {
      expect(isValidNewOption(undefined)).toBeFalsy();
    });
  });

  describe('getNewOptionData', () => {
    it('should return Option with Email as data', () => {
      expect(getNewOptionData('a')).toMatchObject({
        label: 'a@test.com',
        value: 'a@test.com',
        data: {
          id: 'a@test.com',
          name: 'a@test.com',
          type: EmailType,
        },
      });
    });

    it('should return Option with Email as data and always lowercase', () => {
      expect(getNewOptionData('ABCD')).toMatchObject({
        label: 'abcd@test.com',
        value: 'abcd@test.com',
        data: {
          id: 'abcd@test.com',
          name: 'abcd@test.com',
          type: EmailType,
        },
      });
    });

    it('should return Option with Email as data and treat space as a dot in suggested value', () => {
      expect(getNewOptionData('a b')).toMatchObject({
        label: 'a.b@test.com',
        value: 'a.b@test.com',
        data: {
          id: 'a.b@test.com',
          name: 'a.b@test.com',
          type: EmailType,
        },
      });
    });
  });

  describe('formatCreateLabel', () => {
    test.each([
      ['', undefined],
      ['test@test.com', 'test@test.com'],
      ['test@test.com', '    test@test.com    '],
    ])('should return "%s" for inputText "%s"', (expected, inputText) => {
      expect(formatCreateLabel(inputText)).toEqual(expected);
    });
  });

  describe('isOptionDisabled', () => {
    it('should return false for user', () => {
      expect(isOptionDisabled({ data: { type: 'user' } })).toBeFalsy();
    });

    test.each<[boolean, { type: string; id: string }, EmailValidationResponse]>(
      [
        [false, { type: 'email', id: '1' }, 'VALID'],
        [true, { type: 'email', id: '2' }, 'POTENTIAL'],
        [true, { type: 'email', id: '3' }, 'INVALID'],
      ],
    )(
      'should return %p when called with %p and email is "%s"',
      (expected, data, isValidEmailReturn) => {
        (isValidEmail as jest.Mock).mockReturnValueOnce(isValidEmailReturn);
        expect(isOptionDisabled({ data })).toEqual(expected);
        expect(isValidEmail).toHaveBeenCalledTimes(1);
        expect(isValidEmail).toHaveBeenCalledWith(data.id);
      },
    );
  });
});
