import { NotConnectedError, NotInitializedError } from '../error-types';

describe('Error Types', () => {
  it('Constructs NotConnectedError', () => {
    const err = new NotConnectedError('Test Message');
    expect(err.message).toEqual('Test Message');
    expect(err.name).toEqual('NotConnectedError');
  });

  it('Constructs NotInitializedError', () => {
    const err = new NotInitializedError('Test Message');
    expect(err.message).toEqual('Test Message');
    expect(err.name).toEqual('NotInitializedError');
  });
});
