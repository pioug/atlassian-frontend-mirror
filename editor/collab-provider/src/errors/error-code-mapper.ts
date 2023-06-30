import { InternalError, NCS_ERROR_CODE, ProviderError } from './error-types';
import { INTERNAL_ERROR_CODE, PROVIDER_ERROR_CODE } from './error-types';

/*
 * Maps internal collab provider errors to an emitted error format
 */
export const errorCodeMapper = (
  error: InternalError,
): ProviderError | undefined => {
  switch (error.data?.code) {
    case NCS_ERROR_CODE.HEAD_VERSION_UPDATE_FAILED:
    case NCS_ERROR_CODE.VERSION_NUMBER_ALREADY_EXISTS:
      // This should never be called with these errors
      return;
    case INTERNAL_ERROR_CODE.ADD_STEPS_ERROR:
    case INTERNAL_ERROR_CODE.RECONNECTION_ERROR:
    case INTERNAL_ERROR_CODE.CONNECTION_ERROR:
      // These errors shouldn't be emitted, we're hoping the provider self-recovers over time
      return;
    case NCS_ERROR_CODE.INSUFFICIENT_EDITING_PERMISSION:
    case INTERNAL_ERROR_CODE.TOKEN_PERMISSION_ERROR:
      return {
        code: PROVIDER_ERROR_CODE.NO_PERMISSION_ERROR,
        message:
          'User does not have permissions to access this document or document is not found',
        reason: error.data.meta.reason,
        recoverable: true,
        status: 403,
      };
    case NCS_ERROR_CODE.FORBIDDEN_USER_TOKEN:
      return {
        code: PROVIDER_ERROR_CODE.INVALID_USER_TOKEN,
        message: 'The user token was invalid',
        recoverable: true,
        status: 403,
      };
    case INTERNAL_ERROR_CODE.DOCUMENT_NOT_FOUND:
      return {
        code: PROVIDER_ERROR_CODE.DOCUMENT_NOT_FOUND,
        message: 'The requested document is not found',
        recoverable: true,
        status: 404,
      };
    case NCS_ERROR_CODE.TENANT_INSTANCE_MAINTENANCE:
    case NCS_ERROR_CODE.LOCKED_DOCUMENT:
      return {
        code: PROVIDER_ERROR_CODE.LOCKED,
        message:
          'The document is currently not available, please try again later',
        recoverable: true,
      };
    case NCS_ERROR_CODE.DYNAMO_ERROR:
      return {
        code: PROVIDER_ERROR_CODE.FAIL_TO_SAVE,
        message: 'Collab service is not able to save changes',
        recoverable: false,
        status: 500,
      };
    case INTERNAL_ERROR_CODE.DOCUMENT_RESTORE_ERROR:
      return {
        code: PROVIDER_ERROR_CODE.DOCUMENT_RESTORE_ERROR,
        message: 'Collab service unable to restore document',
        recoverable: false,
        status: 500,
      };
    case NCS_ERROR_CODE.INIT_DATA_LOAD_FAILED:
      return {
        code: PROVIDER_ERROR_CODE.INITIALISATION_ERROR,
        message:
          "The initial document couldn't be loaded from the collab service",
        recoverable: false,
        status: 500,
      };
    case INTERNAL_ERROR_CODE.DOCUMENT_UPDATE_ERROR:
      return {
        code: PROVIDER_ERROR_CODE.DOCUMENT_UPDATE_ERROR,
        message: 'The provider failed to apply changes to the editor',
        recoverable: false,
        status: 500,
      };
    case INTERNAL_ERROR_CODE.RECONNECTION_NETWORK_ISSUE:
      return {
        code: PROVIDER_ERROR_CODE.NETWORK_ISSUE,
        message:
          "Couldn't reconnect to the collab service due to network issues",
        recoverable: true,
        status: 500,
      };
    case NCS_ERROR_CODE.NAMESPACE_INVALID:
    case NCS_ERROR_CODE.INVALID_ACTIVATION_ID:
    case NCS_ERROR_CODE.INVALID_DOCUMENT_ARI:
    case NCS_ERROR_CODE.INVALID_CLOUD_ID:
      return {
        code: PROVIDER_ERROR_CODE.INVALID_PROVIDER_CONFIGURATION,
        message: 'Invalid provider configuration',
        recoverable: false,
        reason: error.data?.code,
        status: 400,
      };
    case NCS_ERROR_CODE.NAMESPACE_NOT_FOUND:
    case NCS_ERROR_CODE.ERROR_MAPPING_ERROR:
    case NCS_ERROR_CODE.EMPTY_BROADCAST:
      return {
        code: PROVIDER_ERROR_CODE.INTERNAL_SERVICE_ERROR,
        message: 'Collab Provider experienced an unrecoverable error',
        recoverable: false,
        reason: error.data?.code,
        status: 500,
      };
    case INTERNAL_ERROR_CODE.CATCHUP_FAILED:
      return {
        code: PROVIDER_ERROR_CODE.INTERNAL_SERVICE_ERROR,
        message: 'Collab Provider experienced an unrecoverable error',
        recoverable: true,
        reason: error.data?.code,
        status: 500,
      };
    default:
      return;
  }
};
