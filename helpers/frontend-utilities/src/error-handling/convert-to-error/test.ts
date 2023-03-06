import convertToError from './main';

describe('convert-to-error', () => {
  it('Error instance is not converted and returned', () => {
    const inputError = new Error('test');
    const convertedError = convertToError(inputError);

    expect(convertedError).toBeInstanceOf(Error);
    expect(inputError).toBe<Error>(convertedError);
  });

  it('String is converted and returned', () => {
    const inputError = 'test';
    const convertedError = convertToError(inputError);

    expect(convertedError).toBeInstanceOf(Error);
    expect(convertedError.message).toEqual(inputError);
  });

  it('Object is converted and returned', () => {
    const inputError = { test: true };
    const convertedError = convertToError(inputError);

    expect(convertedError).toBeInstanceOf(Error);
  });

  it('Object with Error is converted and returned', () => {
    const inputError = { test: new Error('test') };
    const convertedError = convertToError(inputError);

    expect(convertedError).toBeInstanceOf(Error);
  });

  it('Object with cyclic dependency is converted and returned', () => {
    const inputError = { test: {} };
    inputError.test = inputError;

    const convertedError = convertToError(inputError);

    expect(convertedError).toBeInstanceOf(Error);
  });

  it('Null is converted and returned', () => {
    const inputError = null;
    const convertedError = convertToError(inputError);

    expect(convertedError).toBeInstanceOf(Error);
  });

  it('Undefined is converted and returned', () => {
    const inputError = undefined;
    const convertedError = convertToError(inputError);

    expect(convertedError).toBeInstanceOf(Error);
  });
});
