import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
	CollabEditProvider,
	CollabEventConflictPayload,
	CollabEventConnectionData,
	CollabEventInitData,
	CollabEventLocalStepData,
	CollabEventPresenceData,
	CollabEventRemoteData,
	CollabTelepointerPayload,
} from '@atlaskit/editor-common/collab';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { PrivateCollabEditOptions } from '../../types';
import {
	applyRemoteData,
	handleConnection,
	handleInit,
	handlePresence,
	handleTelePointer,
} from '../actions';
import { addSynchronyEntityAnalytics, addSynchronyErrorAnalytics } from '../analytics';
import { trackLastRemoteConflictPluginKey } from '../track-reconnection-conflict';

export type SynchronyEntity = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on: (evt: 'disconnected' | 'error', handler: (...args: any) => void) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off: (evt: 'disconnected' | 'error', handler: (...args: any) => void) => void;
};
export interface CollabHandlers {
	initHandler: (data: CollabEventInitData) => void;
	connectedHandler: (data: CollabEventConnectionData) => void;
	dataHandler: (data: CollabEventRemoteData) => void;
	presenceHandler: (data: CollabEventPresenceData) => void;
	telepointerHandler: (data: CollabTelepointerPayload) => void;
	localStepsHandler: (data: CollabEventLocalStepData) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errorHandler: (error: any) => void;
	entityHandler: ({ entity }: { entity: SynchronyEntity }) => void;
	dataConflictHandler: (data: CollabEventConflictPayload) => void;
}

export type Cleanup = () => void;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Setup<T extends any[]> = (...args: T) => Cleanup;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Eq<T extends any[]> = (a: T, b: T) => boolean;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const effect = <TArgs extends any[]>(fn: Setup<TArgs>, eq: Eq<TArgs>) => {
	let previousDeps: TArgs;
	let cleanup: Cleanup;

	return (...currentDeps: TArgs) => {
		if (cleanup && eq(previousDeps, currentDeps)) {
			return cleanup;
		}

		cleanup = fn(...currentDeps);
		previousDeps = currentDeps;
		return cleanup;
	};
};

export const subscribe = effect<
	[
		EditorView,
		CollabEditProvider,
		PrivateCollabEditOptions,
		FeatureFlags,
		ProviderFactory?,
		EditorAnalyticsAPI?,
	]
>(
	(view, provider, options, featureFlags, _providerFactory, editorAnalyticsApi) => {
		let entityRef: SynchronyEntity;
		const entityHandlers = {
			disconnectedHandler: () => {
				addSynchronyEntityAnalytics(view.state, view.state.tr)('disconnected', editorAnalyticsApi);
			},
			errorHandler: () => {
				addSynchronyEntityAnalytics(view.state, view.state.tr)('error', editorAnalyticsApi);
			},
		};

		const unsubscribeSynchronyEntity = () => {
			if (entityRef) {
				entityRef.off('disconnected', entityHandlers.disconnectedHandler);
				entityRef.off('error', entityHandlers.errorHandler);
			}
		};

		const handlers: CollabHandlers = {
			initHandler: (data) => {
				view.dispatch(view.state.tr.setMeta('collabInitialised', true));
				handleInit(data, view, options, editorAnalyticsApi);
			},
			connectedHandler: (data) => handleConnection(data, view),
			dataHandler: (data) => applyRemoteData(data, view, options),
			presenceHandler: (data) => handlePresence(data, view),
			telepointerHandler: (data) => handleTelePointer(data, view),
			localStepsHandler: (data) => {
				const { steps } = data;
				const { state } = view;
				const { tr } = state;
				steps.forEach((step) => tr.step(step));
				view.dispatch(tr);
			},
			errorHandler: (error) => {
				addSynchronyErrorAnalytics(
					view.state,
					view.state.tr,
					featureFlags,
					editorAnalyticsApi,
				)(error);
			},
			entityHandler: ({ entity }) => {
				unsubscribeSynchronyEntity();
				if (options.EXPERIMENTAL_allowInternalErrorAnalytics) {
					entity.on('disconnected', entityHandlers.disconnectedHandler);
					entity.on('error', entityHandlers.errorHandler);
					entityRef = entity;
				}
			},
			dataConflictHandler: (data) => {
				view.dispatch(view.state.tr.setMeta(trackLastRemoteConflictPluginKey, data));
			},
		};

		provider
			.on('init', handlers.initHandler)
			.on('connected', handlers.connectedHandler)
			.on('data', handlers.dataHandler)
			.on('presence', handlers.presenceHandler)
			.on('telepointer', handlers.telepointerHandler)
			.on('local-steps', handlers.localStepsHandler)
			.on('error', handlers.errorHandler)
			.on('entity', handlers.entityHandler)
			.on('data:conflict', handlers.dataConflictHandler);

		return () => {
			unsubscribeSynchronyEntity();

			provider
				.off('init', handlers.initHandler)
				.off('connected', handlers.connectedHandler)
				.off('data', handlers.dataHandler)
				.off('presence', handlers.presenceHandler)
				.off('telepointer', handlers.telepointerHandler)
				.off('local-steps', handlers.localStepsHandler)
				.off('error', handlers.errorHandler)
				.off('entity', handlers.entityHandler)
				.off('data:conflict', handlers.dataConflictHandler);
		};
	},
	(previousDeps, currentDeps) =>
		currentDeps && currentDeps.every((dep, i) => dep === previousDeps[i]),
);
