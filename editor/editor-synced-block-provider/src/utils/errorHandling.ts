import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	ACTION_SUBJECT_ID,
	type RendererSyncBlockEventPayload,
	type OperationalAEP,
	type SyncBlockEventPayload,
} from '@atlaskit/editor-common/analytics';
import { fg } from '@atlaskit/platform-feature-flags';

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
	resourceId?: string,
): OperationalAEP<ACTION.ERROR, ACTION_SUBJECT.SYNCED_BLOCK, T, { error: string; resourceId?: string }> => ({
	action: ACTION.ERROR,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: fg('platform_synced_block_dogfooding') ?
		{
			error,
			...(resourceId && { resourceId }),
		} :
		{
			error
		},
});

export const fetchErrorPayload = (error: string, resourceId?: string): RendererSyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH, error, resourceId);
export const getSourceInfoErrorPayload = (error: string, resourceId?: string): RendererSyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_GET_SOURCE_INFO, error, resourceId);
export const updateErrorPayload = (error: string, resourceId?: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE, error, resourceId);
export const updateReferenceErrorPayload = (error: string, resourceId?: string): RendererSyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_UPDATE, error, resourceId);
export const createErrorPayload = (error: string, resourceId?: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE, error, resourceId);
export const deleteErrorPayload = (error: string, resourceId?: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE, error, resourceId);
export const updateCacheErrorPayload = (error: string, resourceId?: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE_CACHE, error, resourceId);
export const fetchReferencesErrorPayload = (error: string, resourceId?: string): SyncBlockEventPayload =>
	getErrorPayload(ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH_REFERENCES, error, resourceId)

// Success payloads
export const fetchSuccessPayload = (resourceId: string, blockInstanceId?: string, sourceProduct?: string): RendererSyncBlockEventPayload => ({
	action: ACTION.FETCHED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_FETCH,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { resourceId, blockInstanceId, ...(sourceProduct && { sourceProduct }) },
});

export const createSuccessPayload = (resourceId: string): SyncBlockEventPayload => ({
	action: ACTION.INSERTED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { resourceId },
});

export const updateSuccessPayload = (resourceId: string, hasReference?: boolean): SyncBlockEventPayload => ({
	action: ACTION.UPDATED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_UPDATE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { resourceId, ...(hasReference !== undefined && { hasReference }) },
});

export const deleteSuccessPayload = (resourceId: string): SyncBlockEventPayload => ({
	action: ACTION.DELETED,
	actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
	actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_DELETE,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: { resourceId },
});
