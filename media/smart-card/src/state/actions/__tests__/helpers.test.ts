import { getError } from '../helpers';
import { JsonLdCustom, ServerError } from '../../../client/types';

describe('Helpers', () => {
  it('should detect error type when passed ServerError', () => {
    expect(
      getError(({
        message: 'some-message',
        name: 'some-error',
        resourceUrl: 'some-resourceUrl',
        status: 'some-status',
      } as unknown) as ServerError),
    ).toBe('some-error');
  });

  it('should detect error type when passed JsonLd', () => {
    expect(
      getError(({
        data: {
          error: {
            type: 'some-error',
          },
        },
      } as unknown) as JsonLdCustom),
    ).toBe('some-error');
  });
});
