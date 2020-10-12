jest.mock('../../../components/emailValidation', () => ({
  isValidEmail: jest.fn(),
}));

import { getCreatableProps } from '../../../components/creatable';
import {
  isValidEmail,
  EmailValidationResponse,
} from '../../../components/emailValidation';
import { EmailType } from '../../../types';

describe('getCreatableProps', () => {
  let isValidNewOption: any;
  let getNewOptionData: any;
  let formatCreateLabel: any;
  let isOptionDisabled: any;
  beforeAll(() => {
    const creatableProps = getCreatableProps();
    isValidNewOption = creatableProps.isValidNewOption;
    getNewOptionData = creatableProps.getNewOptionData;
    formatCreateLabel = creatableProps.formatCreateLabel;
    isOptionDisabled = creatableProps.isOptionDisabled;
  });

  afterEach(() => {
    (isValidEmail as jest.Mock).mockClear();
  });

  it('should return creatableProps when called', () => {
    expect(getCreatableProps()).toMatchObject({
      allowCreateWhileLoading: true,
      createOptionPosition: 'first',
      isValidNewOption: expect.any(Function),
      getNewOptionData: expect.any(Function),
      formatCreateLabel: expect.any(Function),
      isOptionDisabled: expect.any(Function),
    });
  });

  describe('isValidOption', () => {
    test.each([
      [false, 'INVALID'],
      [true, 'POTENTIAL'],
      [true, 'VALID'],
    ])(
      'should return %p when isValidEmail returns "%s"',
      (expected, isValidEmailReturn) => {
        const someString = 'someValue';
        (isValidEmail as jest.Mock).mockReturnValueOnce(isValidEmailReturn);
        expect(isValidNewOption(someString)).toEqual(expected);
      },
    );

    it('should return false if inputValue is undefined', () => {
      expect(isValidNewOption(undefined)).toBeFalsy();
    });
  });

  describe('getNewOptionData', () => {
    it('should return Option with Email as data', () => {
      expect(getNewOptionData('test@test.com')).toMatchObject({
        label: 'test@test.com',
        value: 'test@test.com',
        data: {
          id: 'test@test.com',
          name: 'test@test.com',
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
