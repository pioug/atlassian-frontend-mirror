import { isUploading, isCancelling } from '../../isUploading';

describe('isUploading()', () => {
  it('should return true for a START_IMPORT action', () => {
    expect(isUploading(false, { type: 'START_IMPORT' })).toBeTruthy();
  });

  it('should return false for a RESET_VIEW action', () => {
    expect(isUploading(true, { type: 'RESET_VIEW' })).toBeFalsy();
  });

  it('should return false for all other actions when the previous state was false', () => {
    expect(isUploading(false, { type: 'foobar' })).toBeFalsy();
  });

  it('should return true for all other actions when the previous state was true', () => {
    expect(isUploading(true, { type: 'foobar' })).toBeTruthy();
  });
});

describe('isCancelling()', () => {
  it('should return true for a HIDE_POPUP action', () => {
    expect(isCancelling(false, { type: 'HIDE_POPUP' })).toBeTruthy();
  });

  it('should return false for a RESET_VIEW action', () => {
    expect(isCancelling(true, { type: 'RESET_VIEW' })).toBeFalsy();
  });

  it('should return false for all other actions when the previous state was false', () => {
    expect(isCancelling(false, { type: 'foobar' })).toBeFalsy();
  });

  it('should return true for all other actions when the previous state was true', () => {
    expect(isCancelling(true, { type: 'foobar' })).toBeTruthy();
  });
});
