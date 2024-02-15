import { errorCodeMapper } from '../error-code-mapper';
import type { InternalError } from '../internal-errors';
import { NCS_ERROR_CODE } from '../ncs-errors';
import { PROVIDER_ERROR_CODE } from '@atlaskit/editor-common/collab';

describe('Error code mapper', () => {
  it.each([
    [
      {
        message: 'Version number does not match current head version.',
        data: {
          code: 'HEAD_VERSION_UPDATE_FAILED',
          meta: {
            currentVersion: 3,
            incomingVersion: 4,
          },
          status: 409,
        },
      },
      undefined,
    ],
    [
      {
        message: 'Version already exists',
        data: {
          code: 'VERSION_NUMBER_ALREADY_EXISTS',
          meta: 'Incoming version number already exists. Therefore, new ProseMirror steps will be rejected.',
          status: 409,
        },
      },
      undefined,
    ],
    [
      {
        message: 'Something something step error',
        data: {
          code: 'ADD_STEPS_ERROR',
          status: 500,
        },
      },
      undefined,
    ],
    [
      {
        message: 'Caught error during reconnection',
        data: {
          code: 'RECONNECTION_ERROR',
          status: 500,
        },
      },
      undefined,
    ],
    [
      {
        message: 'Some connection error',
        data: {
          code: 'CONNECTION_ERROR',
        },
      },
      undefined,
    ],
    [
      {
        message: 'No permission',
        data: {
          code: 'INSUFFICIENT_EDITING_PERMISSION',
          meta: {
            description:
              'The user does not have permission for collaborative editing of this resource or the resource was deleted',
            reason: undefined,
          },
          status: 401,
        },
      },
      {
        code: 'NO_PERMISSION_ERROR',
        message:
          'User does not have permissions to access this document or document is not found',
        recoverable: true,
        status: 403,
      },
    ],
    [
      {
        message: 'Insufficient editing permissions',
        data: {
          code: 'TOKEN_PERMISSION_ERROR',
          status: 403,
          meta: {
            reason: 'RESOURCE_DELETED',
          },
        },
      },
      {
        code: 'NO_PERMISSION_ERROR',
        message:
          'User does not have permissions to access this document or document is not found',
        reason: 'RESOURCE_DELETED',
        recoverable: true,
        status: 403,
      },
    ],
    [
      {
        message: 'Various issues with the user context token',
        data: {
          code: 'FORBIDDEN_USER_TOKEN',
          status: 403,
          meta: 'Forbidden to access pass due to invalid user token',
        },
      },
      {
        code: 'INVALID_USER_TOKEN',
        message: 'The user token was invalid',
        recoverable: true,
        status: 403,
      },
    ],
    [
      {
        message: 'The requested document is not found',
        data: {
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        },
      },
      {
        code: 'DOCUMENT_NOT_FOUND',
        message: 'The requested document is not found',
        recoverable: true,
        status: 404,
      },
    ],
    [
      {
        message: 'Something something tenant is being maintained',
        data: {
          code: 'TENANT_INSTANCE_MAINTENANCE',
          meta: {
            description: 'a good description',
            reason: 'a good reason',
          },
          status: 423,
        },
      },
      {
        code: 'LOCKED',
        message:
          'The document is currently not available, please try again later',
        recoverable: true,
        status: 423,
      },
    ],
    [
      {
        message: 'Something something document is locked',
        data: {
          code: 'LOCKED_DOCUMENT',
          meta: 'some good meta text',
          status: 400,
        },
      },
      {
        code: 'LOCKED',
        message:
          'The document is currently not available, please try again later',
        recoverable: true,
      },
    ],
    [
      {
        message: 'Error while updating metadata',
        data: {
          code: 'DYNAMO_ERROR',
          meta: 'No value returned from metadata while updating',
          status: 500,
        },
      },
      {
        code: 'FAIL_TO_SAVE',
        message: 'Collab service is not able to save changes',
        recoverable: false,
        status: 500,
      },
    ],
    [
      {
        message: 'Document restore went kaboom!',
        data: {
          code: 'DOCUMENT_RESTORE_ERROR',
          status: 500,
        },
      },
      {
        code: 'DOCUMENT_RESTORE_ERROR',
        message: 'Collab service unable to restore document',
        recoverable: false,
        status: 500,
      },
    ],
    [
      {
        message:
          'Failed to load initialisation data after connection established',
        data: { code: 'INIT_DATA_LOAD_FAILED', status: 500 },
      },
      {
        code: 'INITIALISATION_ERROR',
        message:
          "The initial document couldn't be loaded from the collab service",
        recoverable: false,
        status: 500,
      },
    ],
    [
      {
        message:
          'Reconnection failed 8 times when browser was offline, likely there was a network issue',
        data: { code: 'RECONNECTION_NETWORK_ISSUE' },
      },
      {
        code: 'NETWORK_ISSUE',
        message:
          "Couldn't reconnect to the collab service due to network issues",
        recoverable: true,
        status: 500,
      },
    ],
    [
      {
        message: 'Something something namespace invalid',
        data: { code: 'NAMESPACE_INVALID', status: 400 },
      },
      {
        code: 'INVALID_PROVIDER_CONFIGURATION',
        message: 'Invalid provider configuration',
        recoverable: false,
        reason: 'NAMESPACE_INVALID',
        status: 400,
      },
    ],
    [
      {
        message: 'Something something invalid activation id',
        data: {
          code: 'INVALID_ACTIVATION_ID',
          meta: 'meta string',
          status: 400,
        },
      },
      {
        code: 'INVALID_PROVIDER_CONFIGURATION',
        message: 'Invalid provider configuration',
        recoverable: false,
        reason: 'INVALID_ACTIVATION_ID',
        status: 400,
      },
    ],
    [
      {
        message: 'Something something invalid document ari',
        data: {
          code: 'INVALID_DOCUMENT_ARI',
          meta: 'a meta string',
          status: 400,
        },
      },
      {
        code: 'INVALID_PROVIDER_CONFIGURATION',
        message: 'Invalid provider configuration',
        recoverable: false,
        reason: 'INVALID_DOCUMENT_ARI',
        status: 400,
      },
    ],
    [
      {
        message: 'Something something cloud id invalid',
        data: { code: 'INVALID_CLOUD_ID', meta: 'a meta string', status: 401 },
      },
      {
        code: 'INVALID_PROVIDER_CONFIGURATION',
        message: 'Invalid provider configuration',
        recoverable: false,
        reason: 'INVALID_CLOUD_ID',
        status: 400,
      },
    ],
    [
      {
        message: 'Something something namespace not found',
        data: {
          code: 'NAMESPACE_NOT_FOUND',
          meta: 'a meta string',
          status: 400,
        },
      },
      {
        code: 'INTERNAL_SERVICE_ERROR',
        message: 'Collab Provider experienced an unrecoverable error',
        recoverable: true,
        reason: 'NAMESPACE_NOT_FOUND',
        status: 500,
      },
    ],
    [
      {
        message: 'Internal Server Error',
        data: {
          code: 'ERROR_MAPPING_ERROR',
          status: 500,
        },
      },
      {
        code: 'INTERNAL_SERVICE_ERROR',
        message: 'Collab Provider experienced an unrecoverable error',
        recoverable: true,
        reason: 'ERROR_MAPPING_ERROR',
        status: 500,
      },
    ],
    [
      {
        message: 'Something something empty broadcast',
        data: {
          code: 'EMPTY_BROADCAST',
          meta: 'a meta string',
          status: 500,
        },
      },
      {
        code: 'INTERNAL_SERVICE_ERROR',
        message: 'Collab Provider experienced an unrecoverable error',
        recoverable: true,
        reason: 'EMPTY_BROADCAST',
        status: 500,
      },
    ],
    [
      {
        message: 'Something something catchup failed',
        data: {
          code: 'CATCHUP_FAILED',
          status: 400, // We don't know
        },
      },
      {
        code: 'INTERNAL_SERVICE_ERROR',
        message: 'Collab Provider experienced an unrecoverable error',
        recoverable: true,
        reason: 'CATCHUP_FAILED',
        status: 500,
      },
    ],
    [
      {
        data: {
          code: 'DOCUMENT_UPDATE_ERROR',
          meta: {
            editorVersion: 1,
            newVersion: 2,
          },
          status: 500,
        },
        message: 'The provider failed to apply changes to the editor',
      },
      {
        code: PROVIDER_ERROR_CODE.DOCUMENT_UPDATE_ERROR,
        message: 'The provider failed to apply changes to the editor',
        recoverable: false,
        status: 500,
      },
    ],
  ])(
    'should map the internal error %j to provider emitted error %j',
    (internalError, expectedEmittedError) => {
      const mappedError = errorCodeMapper(internalError as InternalError);

      expect(mappedError).toEqual(expectedEmittedError);
    },
  );

  it('drops unhandled errors', () => {
    const mappedError = errorCodeMapper({
      message: 'Some other unhandled error',
      data: { code: 'SOMETHING_WENT_WRONG', status: 400 },
    } as unknown as InternalError);
    expect(mappedError).toBeUndefined();
  });

  it("returns undefined when the error doesn't have data", () => {
    const mappedError = errorCodeMapper({
      message: 'Some error without data',
    } as unknown as InternalError);
    expect(mappedError).toBeUndefined();
  });

  describe('Insufficient permission error', () => {
    it('maps to a meaningful error structure', () => {
      const mappedError = errorCodeMapper({
        message: 'No permission',
        data: {
          status: 401,
          code: NCS_ERROR_CODE.INSUFFICIENT_EDITING_PERMISSION,
          meta: {
            description:
              'The user does not have sufficient permission to collab editing the resource',
          },
        },
      });
      expect(mappedError).toEqual({
        code: 'NO_PERMISSION_ERROR',
        message:
          'User does not have permissions to access this document or document is not found',
        reason: undefined,
        recoverable: true,
        status: 403,
      });
    });

    it('contains the reason why the user got a permission error', () => {
      const mappedError = errorCodeMapper({
        message: 'No permission',
        data: {
          status: 401,
          code: NCS_ERROR_CODE.INSUFFICIENT_EDITING_PERMISSION,
          meta: {
            description:
              'The user does not have sufficient permission to collab editing the resource',
            reason: 'RESOURCE_DELETED',
          },
        },
      });
      expect(mappedError).toEqual({
        code: 'NO_PERMISSION_ERROR',
        message:
          'User does not have permissions to access this document or document is not found',
        reason: 'RESOURCE_DELETED',
        recoverable: true,
        status: 403,
      });
    });
  });
});
