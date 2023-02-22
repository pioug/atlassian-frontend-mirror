import type { CollabErrorPayload, ErrorPayload } from './types';

export const ErrorCodeMapper = {
  noPermissionError: {
    code: 'NO_PERMISSION_ERROR',
    message: 'User does not have permissions to access this document',
  },
  documentNotFound: {
    code: 'DOCUMENT_NOT_FOUND',
    message: 'The requested document is not found',
  },
  hasToLogin: {
    code: 'HAS_TO_LOGIN',
    message: 'The user needs to login',
  },
  catchupFail: {
    code: 'CATCHUP_FAILED',
    message: 'Cannot fetch catchup from collab service',
  },
  serviceUnvailable: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service is not available',
  },
  failToSave: {
    code: 'FAIL_TO_SAVE',
    message: 'Collab service is not able to save changes',
  },
  internalError: {
    code: 'INTERNAL_SERVICE_ERROR',
    message: 'Collab service has experienced an internal server error',
  },
};

export const errorCodeMapper = (error: ErrorPayload): CollabErrorPayload => {
  switch (error.data?.code) {
    case 'INSUFFICIENT_EDITING_PERMISSION':
      return {
        status: 403,
        code: ErrorCodeMapper.noPermissionError.code,
        message: ErrorCodeMapper.noPermissionError.message,
        reason:
          // Typescript magic so it detects the union type
          typeof error.data.meta === 'object'
            ? error.data.meta.reason
            : undefined,
      };
    case 'DOCUMENT_NOT_FOUND':
      return {
        status: 404,
        code: ErrorCodeMapper.documentNotFound.code,
        message: ErrorCodeMapper.documentNotFound.message,
      };
    case 'FAILED_ON_S3':
    case 'DYNAMO_ERROR':
      return {
        status: 500,
        code: ErrorCodeMapper.failToSave.code,
        message: ErrorCodeMapper.failToSave.message,
      };
    default:
      return {
        status: 500,
        code: ErrorCodeMapper.internalError.code,
        message: ErrorCodeMapper.internalError.message,
      };
  }
};
