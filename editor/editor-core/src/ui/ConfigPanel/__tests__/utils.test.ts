import { isValidHex } from '../utils';

describe('isValidHex', () => {
  const validateHex = (hex: string, expected: boolean) => {
    expect(isValidHex(hex)).toBe(expected);
  };

  describe('should return true', () => {
    it('if lowercase 8 digit hex alpha is passed', () => {
      validateHex('#345fffaa', true);
    });

    it('if uppercase 8 digit hex alpha is passed', () => {
      validateHex('#345FFFAA', true);
    });
  });

  describe('should return false', () => {
    it('if nothing is passed', () => {
      validateHex('', false);
    });

    it('if 2 digit hex is passed', () => {
      validateHex('#34', false);
    });

    it('if 3 digit hex is passed', () => {
      validateHex('#345', false);
    });

    it('if 6 digit hex is passed', () => {
      validateHex('#345fff', false);
    });

    it('if 10 digit hex alpha is passed', () => {
      validateHex('#345ffffggg', false);
    });
  });
});
