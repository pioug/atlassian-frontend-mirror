// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { Provider } from './provider';
export type { CollabEventDisconnectedData, Socket } from './types';
export type {
	NewCollabSyncUpErrorAttributes,
	ResolvedEditorState,
	CollabMetadataPayload,
	CollabEventInitData,
	CollabInitPayload,
	CollabEventConnectionData,
	CollabConnectedPayload,
	CollabDisconnectedPayload,
	CollabDataPayload,
	CollabActivityData,
	CollabTelepointerPayload,
	CollabPresencePayload,
	CollabLocalStepsPayload,
	CollabPermissionEventPayload,
	CollabEventRemoteData,
	CollabEventPresenceData,
	CollabActivityJoinPayload,
	CollabActivityAckPayload,
	CollabEventConnectingData,
	CollabEventTelepointerData,
	CollabSendableSelection,
	CollabParticipant,
	CollabEvents,
	SyncUpErrorFunction,
	CollabEditProvider,
	ProviderError,
	ProviderParticipant,
	CollabEventLocalStepData,
	UserPermitType,
	CollabNamespaceLockCheckPayload,
} from '@atlaskit/editor-common/collab';
export { PROVIDER_ERROR_CODE } from '@atlaskit/editor-common/collab';
