import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	ACTION_SUBJECT_ID,
	type RendererSyncBlockEventPayload,
	type OperationalAEP,
	type SyncBlockEventPayload,
} from '@atlaskit/editor-common/analytics';

export const stringifyError = (error: unknown) => {
	try {
		return JSON.stringify(error);
	} catch {
		return undefined;
	}
};

export const getErrorPayload = <T extends ACTION_SUBJECT_ID>(
	actionSubjectId: T,
	error: string,
): OperationalAEP<ACTION.ERROR, ACTION_SUBJECT.SYNCED_BLOCK, T, { error: string }> => ({
	action: ACTION.ERROR,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { error },
});

export const fetchErrorPayload = (error: string): RendererSyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH, error);
export const getSourceInfoErrorPayload = (error: string): RendererSyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_GET_SOURCE_INFO, error);
export const updateErrorPayload = (error: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE, error);
export const createErrorPayload = (error: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE, error);
export const deleteErrorPayload = (error: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE, error);
export const updateCacheErrorPayload = (error: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE_CACHE, error);
