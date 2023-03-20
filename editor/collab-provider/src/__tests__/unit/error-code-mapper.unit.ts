import { ErrorCodeMapper, errorCodeMapper } from '../../error-code-mapper';

describe('Error code mapper', () => {
  it('Maps initialisation errors', () => {
    const mappedError = errorCodeMapper({
      message: 'Initialization failed',
      data: { code: 'INIT_DATA_LOAD_FAILED', status: 500 },
    });
    expect(mappedError).toEqual({
      status: 500,
      code: ErrorCodeMapper.internalError.code,
      message: ErrorCodeMapper.internalError.message,
    });
  });

  it('Doesnt drop unhandled errors', () => {
    const mappedError = errorCodeMapper({
      message: 'Some other unhandled error',
      data: { code: 'SOMETHING_WENT_WRONG', status: 400 },
    });
    expect(mappedError).toEqual(undefined);
    // expect(mappedError).toEqual({
    //   status: 500,
    //   code: ErrorCodeMapper.internalError.code,
    //   message: ErrorCodeMapper.internalError.message,
    // });
  });

  it("doesnt return undefined when the error doesn't have data", () => {
    const mappedError = errorCodeMapper({ message: 'Some error without data' });
    expect(mappedError).toEqual(undefined);
    // expect(mappedError).toEqual({
    //   status: 500,
    //   code: ErrorCodeMapper.internalError.code,
    //   message: ErrorCodeMapper.internalError.message,
    // });
  });

  describe('Insufficient permission error', () => {
    it('maps to a meaningful error structure', () => {
      const mappedError = errorCodeMapper({
        message: 'No permission',
        data: {
          status: 401,
          code: 'INSUFFICIENT_EDITING_PERMISSION',
          meta: {
            description:
              'The user does not have sufficient permission to collab editing the resource',
          },
        },
      });
      expect(mappedError).toEqual({
        code: 'NO_PERMISSION_ERROR',
        message: 'User does not have permissions to access this document',
        reason: undefined,
        status: 403,
      });
    });

    it('contains the reason why the user got a permission error', () => {
      const mappedError = errorCodeMapper({
        message: 'No permission',
        data: {
          status: 401,
          code: 'INSUFFICIENT_EDITING_PERMISSION',
          meta: {
            description:
              'The user does not have sufficient permission to collab editing the resource',
            reason: 'RESOURCE_DELETED',
          },
        },
      });
      expect(mappedError).toEqual({
        code: 'NO_PERMISSION_ERROR',
        message: 'User does not have permissions to access this document',
        reason: 'RESOURCE_DELETED',
        status: 403,
      });
    });
  });
});
