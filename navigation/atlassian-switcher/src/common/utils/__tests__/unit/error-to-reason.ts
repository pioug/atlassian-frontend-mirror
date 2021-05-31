import { errorToReason } from '../../error-to-reason';

describe('utils/error-to-reason', () => {
  it('should handle weird values', () => {
    [null, undefined, 1, 0, NaN, '', 'string'].forEach((value) => {
      expect(errorToReason(value)).toEqual({
        name: 'Unknown',
        status: undefined,
      });
    });
  });

  it('should handle empty object', () => {
    expect(errorToReason({})).toEqual({ name: 'Unknown', status: undefined });
  });

  it('should handle empty name', () => {
    expect(errorToReason({ status: 400 })).toEqual({
      name: 'Unknown',
      status: 400,
    });
  });

  it('should handle empty status', () => {
    expect(errorToReason({ name: 'Error' })).toEqual({
      name: 'Error',
      status: undefined,
    });
  });

  it('should handle Error', () => {
    expect(errorToReason(new Error())).toEqual({
      name: 'Error',
      status: undefined,
    });
  });
});
