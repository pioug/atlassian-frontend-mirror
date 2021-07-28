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
    message: 'Collab service has return internal server error',
  },
};
