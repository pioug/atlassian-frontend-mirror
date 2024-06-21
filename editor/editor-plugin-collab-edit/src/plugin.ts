import type { CollabEditProvider } from '@atlaskit/editor-common/collab';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { AddMarkStep, AddNodeMarkStep } from '@atlaskit/editor-prosemirror/transform';
import { collab } from '@atlaskit/prosemirror-collab';

import { addSynchronyErrorAnalytics } from './analytics';
import { sendTransaction } from './events/send-transaction';
import { createPlugin } from './pm-plugins/main';
import { pluginKey as mainPluginKey } from './pm-plugins/main/plugin-key';
import { nativeCollabProviderPlugin } from './pm-plugins/native-collab-provider-plugin';
import {
	createPlugin as createTrackNCSInitializationPlugin,
	trackNCSInitializationPluginKey,
} from './pm-plugins/track-ncs-initialization';
import type { CollabEditPlugin, ProviderBuilder, ProviderCallback } from './types';
import { getAvatarColor } from './utils';

const providerBuilder: ProviderBuilder =
	(collabEditProviderPromise: Promise<CollabEditProvider>) =>
	async (codeToExecute, onError?: (error: Error) => void) => {
		try {
			const provider = await collabEditProviderPromise;
			if (provider) {
				return codeToExecute(provider);
			}
		} catch (err) {
			if (onError) {
				onError(err as Error);
			} else {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		}
	};

const createAddInlineCommentMark =
	(providerPromise: Promise<CollabEditProvider>) =>
	({ from, to, mark }: { from: number; to: number; mark: Mark }): boolean => {
		providerPromise.then((provider) => {
			const commentMark = new AddMarkStep(Math.min(from, to), Math.max(from, to), mark);

			// @ts-expect-error 2339: Property 'api' does not exist on type 'CollabEditProvider<CollabEvents>'.
			provider.api?.addComment([commentMark]);
		});

		return false;
	};

const createAddInlineCommentNodeMark =
	(providerPromise: Promise<CollabEditProvider>) =>
	({ pos, mark }: { pos: number; mark: Mark }): boolean => {
		providerPromise.then((provider) => {
			const commentMark = new AddNodeMarkStep(pos, mark);

			// @ts-expect-error 2339: Property 'api' does not exist on type 'CollabEditProvider<CollabEvents>'.
			provider.api?.addComment([commentMark]);
		});

		return false;
	};

export const collabEditPlugin: CollabEditPlugin = ({ config: options, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

	let providerResolver: (value: CollabEditProvider) => void = () => {};
	const collabEditProviderPromise: Promise<CollabEditProvider> = new Promise(
		(_providerResolver) => {
			providerResolver = _providerResolver;
		},
	);
	const executeProviderCode: ProviderCallback = providerBuilder(collabEditProviderPromise);

	return {
		name: 'collabEdit',
		getSharedState(state) {
			if (!state) {
				return {
					initialised: {
						collabInitialisedAt: null,
						firstChangeAfterInitAt: null,
						firstContentBodyChangeAfterInitAt: null,
					},
					activeParticipants: undefined,
					sessionId: undefined,
				};
			}

			const collabPluginState = mainPluginKey.getState(state);
			const metadata = trackNCSInitializationPluginKey.getState(state);

			return {
				activeParticipants: collabPluginState?.activeParticipants,
				sessionId: collabPluginState?.sessionId,
				initialised: {
					collabInitialisedAt: metadata?.collabInitialisedAt || null,
					firstChangeAfterInitAt: metadata?.firstChangeAfterInitAt || null,
					firstContentBodyChangeAfterInitAt: metadata?.firstContentBodyChangeAfterInitAt || null,
				},
			};
		},
		actions: {
			getAvatarColor,
			addInlineCommentMark: createAddInlineCommentMark(collabEditProviderPromise),
			addInlineCommentNodeMark: createAddInlineCommentNodeMark(collabEditProviderPromise),
			isRemoteReplaceDocumentTransaction: (tr: Transaction) =>
				tr.getMeta('isRemote') && tr.getMeta('replaceDocument'),
		},
		pmPlugins() {
			const { useNativePlugin = false, userId = null } = options || {};

			return [
				...(useNativePlugin
					? [
							{
								name: 'pmCollab',
								plugin: () => collab({ clientID: userId }) as SafePlugin,
							},
							{
								name: 'nativeCollabProviderPlugin',
								plugin: () =>
									nativeCollabProviderPlugin({
										providerPromise: collabEditProviderPromise,
									}),
							},
						]
					: []),
				{
					name: 'collab',
					plugin: ({ dispatch, providerFactory }) => {
						return createPlugin(
							dispatch,
							providerFactory,
							providerResolver,
							executeProviderCode,
							options,
							featureFlags,
							api,
						);
					},
				},
				{
					name: 'collabTrackNCSInitializationPlugin',
					plugin: createTrackNCSInitializationPlugin,
				},
			];
		},

		onEditorViewStateUpdated(props) {
			const addErrorAnalytics = addSynchronyErrorAnalytics(
				props.newEditorState,
				props.newEditorState.tr,
				featureFlags,
				api?.analytics?.actions,
			);

			const viewMode = api?.editorViewMode?.sharedState.currentState()?.mode;

			executeProviderCode(
				sendTransaction({
					originalTransaction: props.originalTransaction,
					transactions: props.transactions,
					oldEditorState: props.oldEditorState,
					newEditorState: props.newEditorState,
					useNativePlugin: options?.useNativePlugin ?? false,
					viewMode,
				}),
				addErrorAnalytics,
			);
		},
	};
};
