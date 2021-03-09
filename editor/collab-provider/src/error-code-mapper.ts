export const ErrorCodeMapper = {
  noPermissionError: {
    code: `NO_PERMISSION_ERROR`,
    message: `User does not have permissions to access this document`,
  },
  catchupFail: {
    code: 'CATCHUP_FAILED',
    message: 'Cannot fetch catchup from collab service',
  },
  serviceUnvailable: {
    code: `SERVICE_UNAVAILABLE`,
    message: `Service is not available`,
  },
  failToSave: {
    code: `FAIL_TO_SAVE`,
    message: `Collab service is not able to save changes`,
  },
  internalError: {
    code: `INTERNAL_SERVICE_ERROR`,
    message: `Collab service has return internal server error`,
  },
};
