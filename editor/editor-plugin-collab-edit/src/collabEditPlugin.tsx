import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { CollabEditProvider } from '@atlaskit/editor-common/collab';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { AddMarkStep, AddNodeMarkStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { collab, getCollabState, sendableSteps } from '@atlaskit/prosemirror-collab';

import type { CollabEditPlugin } from './collabEditPluginType';
import { addSynchronyErrorAnalytics } from './pm-plugins/analytics';
import { sendTransaction } from './pm-plugins/events/send-transaction';
import { createPlugin } from './pm-plugins/main';
import { pluginKey as mainPluginKey } from './pm-plugins/main/plugin-key';
import { mergeUnconfirmedSteps } from './pm-plugins/mergeUnconfirmed';
import { nativeCollabProviderPlugin } from './pm-plugins/native-collab-provider-plugin';
import {
	sanitizeFilteredStep,
	createPlugin as trackSpammingStepsPlugin,
} from './pm-plugins/track-and-filter-spamming-steps';
import {
	createPlugin as createLastOrganicChangePlugin,
	trackLastOrganicChangePluginKey,
} from './pm-plugins/track-last-organic-change';
import {
	createPlugin as createTrackNCSInitializationPlugin,
	trackNCSInitializationPluginKey,
} from './pm-plugins/track-ncs-initialization';
import { track } from './pm-plugins/track-steps';
import { getAvatarColor } from './pm-plugins/utils';
import type { ProviderBuilder, ProviderCallback } from './types';

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
	const editorViewRef: Record<'current', EditorView | null> = { current: null };
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
						lastLocalOrganicChangeAt: null,
						lastRemoteOrganicChangeAt: null,
						lastLocalOrganicBodyChangeAt: null,
						lastRemoteOrganicBodyChangeAt: null,
					},
					activeParticipants: undefined,
					sessionId: undefined,
				};
			}

			const collabPluginState = mainPluginKey.getState(state);
			const metadata = trackNCSInitializationPluginKey.getState(state);
			const lastOrganicChangeState = trackLastOrganicChangePluginKey.getState(state);

			return {
				activeParticipants: collabPluginState?.activeParticipants,
				sessionId: collabPluginState?.sessionId,
				initialised: {
					collabInitialisedAt: metadata?.collabInitialisedAt || null,
					firstChangeAfterInitAt: metadata?.firstChangeAfterInitAt || null,
					firstContentBodyChangeAfterInitAt: metadata?.firstContentBodyChangeAfterInitAt || null,
					lastLocalOrganicChangeAt: lastOrganicChangeState?.lastLocalOrganicChangeAt || null,
					lastRemoteOrganicChangeAt: lastOrganicChangeState?.lastRemoteOrganicChangeAt || null,
					lastLocalOrganicBodyChangeAt:
						lastOrganicChangeState?.lastLocalOrganicBodyChangeAt || null,
					lastRemoteOrganicBodyChangeAt:
						lastOrganicChangeState?.lastRemoteOrganicBodyChangeAt || null,
				},
			};
		},
		actions: {
			getAvatarColor,
			addInlineCommentMark: createAddInlineCommentMark(collabEditProviderPromise),
			addInlineCommentNodeMark: createAddInlineCommentNodeMark(collabEditProviderPromise),
			isRemoteReplaceDocumentTransaction: (tr: Transaction) =>
				tr.getMeta('isRemote') && tr.getMeta('replaceDocument'),
			getCurrentCollabState: () => {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const adfDocument = new JSONTransformer().encode(editorViewRef.current!.state!.doc);
				return {
					content: adfDocument,
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					version: getCollabState(editorViewRef.current!.state)?.version || 0,
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					sendableSteps: sendableSteps(editorViewRef.current!.state),
				};
			},
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validatePMJSONDocument: (doc: any) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const content: Array<PMNode> = (doc.content || []).map((child: any) =>
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					editorViewRef.current!.state!.schema.nodeFromJSON(child),
				);
				return content.every((node) => {
					try {
						node.check(); // this will throw an error if the node is invalid
					} catch (error) {
						return false;
					}
					return true;
				});
			},
		},

		pmPlugins() {
			const { useNativePlugin = false, userId = null } = options || {};

			const plugins = [
				...(useNativePlugin
					? [
							{
								name: 'pmCollab',
								plugin: () =>
									collab({
										clientID: userId,
										transformUnconfirmed: fg('platform_editor_merge_unconfirmed_steps')
											? mergeUnconfirmedSteps
											: undefined,
									}) as SafePlugin,
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
					plugin: ({ dispatch, providerFactory }: PMPluginFactoryParams) => {
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

			plugins.push({
				name: 'trackAndFilterSpammingSteps',
				plugin: () =>
					trackSpammingStepsPlugin((tr: Transaction) => {
						const sanitizedSteps = tr.steps.map((step) => sanitizeFilteredStep(step));
						api?.analytics?.actions?.fireAnalyticsEvent({
							action: ACTION.STEPS_FILTERED,
							actionSubject: ACTION_SUBJECT.COLLAB,
							attributes: {
								steps: sanitizedSteps,
							},
							eventType: EVENT_TYPE.OPERATIONAL,
						});
					}),
			});

			plugins.push({
				name: 'collabTrackLastOrganicChangePlugin',
				plugin: createLastOrganicChangePlugin,
			});

			return plugins;
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

			track({
				...props,
				onTrackDataProcessed: (steps) => {
					api?.analytics?.actions?.fireAnalyticsEvent({
						action: ACTION.STEPS_TRACKED,
						actionSubject: ACTION_SUBJECT.COLLAB,
						attributes: {
							steps,
						},
						eventType: EVENT_TYPE.OPERATIONAL,
					});
				},
			});
		},
	};
};
