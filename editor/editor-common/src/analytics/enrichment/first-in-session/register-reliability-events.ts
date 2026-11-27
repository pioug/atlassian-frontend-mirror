import { ACTION_SUBJECT_ID } from '../../types/enums';
import type { EnrichmentEvent } from '../types';
import { classifyEvent, type IdentityMapper } from './classify-event';
import type { RegisterFirstInSessionEvent } from './create-first-in-session-enrichers';
import { enrichFirstInSession } from './enrich-first-in-session';

const singleOccurrence = () => '';
const subjectIds: ReadonlySet<string> = new Set(Object.values(ACTION_SUBJECT_ID));

const bySubjectId: IdentityMapper = ({ actionSubjectId }) => {
	if (actionSubjectId === undefined) {
		return '';
	}
	return typeof actionSubjectId === 'string' && subjectIds.has(actionSubjectId)
		? actionSubjectId
		: null;
};

const byUserFlow: IdentityMapper = ({ actionSubjectId }) =>
	actionSubjectId === 'userFlow' ? '' : null;

const byTableWidth: IdentityMapper = ({ attributes }) => {
	const { mode, hasTableWithScrollbar, hasTableWiderThanEditor } = attributes ?? {};
	if (
		(mode !== 'editor' && mode !== 'renderer') ||
		typeof hasTableWithScrollbar !== 'boolean' ||
		typeof hasTableWiderThanEditor !== 'boolean'
	) {
		return null;
	}
	// Healthy tables must leave room for the first occurrence in either detector numerator.
	return JSON.stringify([mode, hasTableWithScrollbar, hasTableWiderThanEditor]);
};

const byUnsupportedContentSeverity: IdentityMapper = ({ attributes }) => {
	switch (attributes?.unsupportedContentLevelSeverity) {
		case 'normal':
			return 'good';
		case 'degraded':
		case 'blocking':
			return 'bad';
		default:
			return null;
	}
};

const reliabilityIdentities = new Map<string, IdentityMapper>([
	['operational.editor.documentProcessingErrorV2', singleOccurrence],
	['operational.editor.dispatchedInvalidTransaction', singleOccurrence],
	['operational.offlineEditing.offlineStorageFailedSteps', singleOccurrence],
	['operational.offlineEditing.offlineStorageStepsDatabaseError', singleOccurrence],
	['operational.offlineEditing.OFFLINE_EDITING_FAILED_STORE_RECOVERY_VERSION', singleOccurrence],
	['operational.offlineEditing.offlineStorageResyncOnline', singleOccurrence],
	['operational.syncedBlock.error', ({ attributes }) => (attributes?.benign === false ? '' : null)],
	['operational.table.tableWidthInformation', byTableWidth],
	['track.document.inserted', bySubjectId],
	['track.text.formatted', bySubjectId],
	['track.table.dragMenuOpened', singleOccurrence],
	['track.table.movedRow', singleOccurrence],
	['track.table.movedColumn', singleOccurrence],
	[
		'ui.elementBrowser.opened',
		({ attributes }) => {
			const mode = attributes?.mode;
			return mode === 'full' || mode === 'inline' ? mode : '';
		},
	],
	['ui.editorPluginAI.invoke', byUserFlow],
	['ui.editorPluginAI.sessionStart', byUserFlow],
	['operational.aiStreaming.noDocChangeFound', singleOccurrence],
	['operational.aiStreaming.error', singleOccurrence],
	['operational.aiStreaming.invalidCommandFound', singleOccurrence],
	['operational.aiStreaming.localIdNotFound', singleOccurrence],
	['operational.editorPluginAI.unhandledErrorCaught', singleOccurrence],
	[
		'operational.editorPluginAI.failed',
		({ attributes }) =>
			attributes?.errorType === undefined || attributes.errorType === 'replaceStepNotFound'
				? ''
				: null,
	],
	['operational.renderer.rendered', singleOccurrence],
	['operational.renderer.unhandledErrorCaughtV2', singleOccurrence],
	['operational.renderer.unsupportedContentLevelsTrackingSucceeded', byUnsupportedContentSeverity],
]);

function getIdentityMapper({ eventType, actionSubject, action }: EnrichmentEvent) {
	if (
		typeof eventType === 'string' &&
		typeof actionSubject === 'string' &&
		typeof action === 'string'
	) {
		return reliabilityIdentities.get(`${eventType}.${actionSubject}.${action}`);
	}
}

export function registerReliabilityEvents(register: RegisterFirstInSessionEvent): void {
	register((options) => {
		const identify = getIdentityMapper(options.event);
		if (identify) {
			return enrichFirstInSession(options, ({ event, appearance }) => {
				const isRenderer =
					event.actionSubject === 'renderer' || event.attributes?.mode === 'renderer';
				return classifyEvent(event, appearance, identify, isRenderer ? 'renderer' : undefined);
			});
		}
	});
}
