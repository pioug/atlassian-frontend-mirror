import React from 'react';

import { media, mediaGroup, mediaInline, mediaSingleSpec } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { IconImages } from '@atlaskit/editor-common/quick-insert';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorAppearance,
	ExtractInjectionAPI,
	PMPlugin,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import { NodeSelection, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { MediaNextEditorPluginType } from './next-plugin-type';
import { ReactMediaGroupNode } from './nodeviews/mediaGroup';
import { ReactMediaInlineNode } from './nodeviews/mediaInline';
import { ReactMediaNode } from './nodeviews/mediaNodeView';
import { ReactMediaSingleNode } from './nodeviews/mediaSingle';
import { createPlugin as createMediaAltTextPlugin } from './pm-plugins/alt-text';
import keymapMediaAltTextPlugin from './pm-plugins/alt-text/keymap';
import keymapPlugin from './pm-plugins/keymap';
import keymapMediaSinglePlugin from './pm-plugins/keymap-media-single';
import linkingPlugin from './pm-plugins/linking';
import keymapLinkingPlugin from './pm-plugins/linking/keymap';
import type { MediaState } from './pm-plugins/main';
import { stateKey } from './pm-plugins/main';
import { createPlugin, stateKey as pluginKey } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import type { CustomMediaPicker } from './types';
import { MediaPickerComponents } from './ui/MediaPicker';
import ToolbarMedia from './ui/ToolbarMedia';
import { insertMediaAsMediaSingle } from './utils/media-single';

export type { MediaState, MediaProvider, CustomMediaPicker };
export { insertMediaSingleNode } from './utils/media-single';

type MediaPickerFunctionalComponentProps = {
	editorDomElement: Element;
	appearance: EditorAppearance;
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
};
const MediaPickerFunctionalComponent = ({
	api,
	editorDomElement,
	appearance,
}: MediaPickerFunctionalComponentProps) => {
	const { mediaState } = useSharedPluginState(api, ['media']);

	if (!mediaState) {
		return null;
	}

	return (
		<MediaPickerComponents
			editorDomElement={editorDomElement}
			mediaState={mediaState}
			appearance={appearance}
			api={api}
		/>
	);
};

export const mediaPlugin: MediaNextEditorPluginType = ({ config: options = {}, api }) => {
	return {
		name: 'media',

		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			return stateKey.getState(editorState) || null;
		},

		actions: {
			insertMediaAsMediaSingle: (view, node, inputMethod) =>
				insertMediaAsMediaSingle(view, node, inputMethod, api?.analytics?.actions),
			setProvider: (provider) => {
				return (
					api?.core.actions.execute(({ tr }) =>
						tr.setMeta(stateKey, { mediaProvider: provider }),
					) ?? false
				);
			},
		},

		nodes() {
			const {
				allowMediaGroup = true,
				allowMediaSingle = false,
				allowCaptions,
				featureFlags: mediaFeatureFlags,
			} = options || {};

			const allowMediaInline = getMediaFeatureFlag('mediaInline', mediaFeatureFlags);

			const mediaSingleOption = getBooleanFF('platform.editor.media.extended-resize-experience')
				? {
						withCaption: allowCaptions,
						withExtendedWidthTypes: true,
					}
				: {
						withCaption: allowCaptions,
						withExtendedWidthTypes: false,
					};

			const mediaSingleNode = mediaSingleSpec(mediaSingleOption);

			return [
				{ name: 'mediaGroup', node: mediaGroup },
				{ name: 'mediaSingle', node: mediaSingleNode },
				{ name: 'media', node: media },
				{ name: 'mediaInline', node: mediaInline },
			].filter((node) => {
				if (node.name === 'mediaGroup') {
					return allowMediaGroup;
				}

				if (node.name === 'mediaSingle') {
					return allowMediaSingle;
				}

				if (node.name === 'mediaInline') {
					return allowMediaInline;
				}

				return true;
			});
		},

		pmPlugins() {
			const pmPlugins: Array<PMPlugin> = [
				{
					name: 'media',
					plugin: ({
						schema,
						dispatch,
						getIntl,
						eventDispatcher,
						providerFactory,
						errorReporter,
						portalProviderAPI,
						reactContext,
						dispatchAnalyticsEvent,
					}: PMPluginFactoryParams) => {
						return createPlugin(
							schema,
							{
								providerFactory,
								nodeViews: {
									mediaGroup: ReactMediaGroupNode(
										portalProviderAPI,
										eventDispatcher,
										providerFactory,
										options,
										api,
									),
									mediaSingle: ReactMediaSingleNode(
										portalProviderAPI,
										eventDispatcher,
										providerFactory,
										api,
										dispatchAnalyticsEvent,
										options,
									),
									media: ReactMediaNode(
										portalProviderAPI,
										eventDispatcher,
										providerFactory,
										options,
										api,
									),
									mediaInline: ReactMediaInlineNode(
										portalProviderAPI,
										eventDispatcher,
										providerFactory,
										api,
									),
								},
								errorReporter,
								uploadErrorHandler: options && options.uploadErrorHandler,
								waitForMediaUpload: options && options.waitForMediaUpload,
								customDropzoneContainer: options && options.customDropzoneContainer,
								customMediaPicker: options && options.customMediaPicker,
								allowResizing: !!(options && options.allowResizing),
							},
							reactContext,
							getIntl,
							api,
							dispatch,
							options,
						);
					},
				},
				{
					name: 'mediaKeymap',
					plugin: ({ getIntl }) =>
						keymapPlugin(
							options,
							api?.analytics?.actions,
							api?.selection?.actions,
							api?.width,
							getIntl,
						),
				},
			];

			if (options && options.allowMediaSingle) {
				pmPlugins.push({
					name: 'mediaSingleKeymap',
					plugin: ({ schema }) => keymapMediaSinglePlugin(schema),
				});
			}

			if (options && options.allowAltTextOnImages) {
				pmPlugins.push({
					name: 'mediaAltText',
					plugin: createMediaAltTextPlugin,
				});
				pmPlugins.push({
					name: 'mediaAltTextKeymap',
					plugin: ({ schema }) => keymapMediaAltTextPlugin(schema, api?.analytics?.actions),
				});
			}

			if (options && options.allowLinking) {
				pmPlugins.push({
					name: 'mediaLinking',
					plugin: ({ dispatch }: PMPluginFactoryParams) => linkingPlugin(dispatch),
				});
				pmPlugins.push({
					name: 'mediaLinkingKeymap',
					plugin: ({ schema }) => keymapLinkingPlugin(schema),
				});
			}

			pmPlugins.push({
				name: 'mediaSelectionHandler',
				plugin: () => {
					const mediaSelectionHandlerPlugin = new SafePlugin({
						key: new PluginKey('mediaSelectionHandlerPlugin'),
						props: {
							handleScrollToSelection: (view) => {
								const {
									state: { selection },
								} = view;
								if (!(selection instanceof NodeSelection) || selection.node.type.name !== 'media') {
									return false;
								}

								const { node, offset } = view.domAtPos(selection.from);
								if (
									// Is the media element mounted already?
									offset === node.childNodes.length
								) {
									// Media is not ready, so stop the scroll request
									return true;
								}

								// Media is ready, keep the scrolling request
								return false;
							},
						},
					});

					return mediaSelectionHandlerPlugin;
				},
			});

			return pmPlugins;
		},

		contentComponent({ editorView, appearance }) {
			return (
				<MediaPickerFunctionalComponent
					editorDomElement={editorView.dom}
					appearance={appearance}
					api={api}
				/>
			);
		},

		secondaryToolbarComponent({ editorView, eventDispatcher, disabled }) {
			return <ToolbarMedia isDisabled={disabled} isReducedSpacing={true} api={api} />;
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'media',
					title: formatMessage(messages.mediaFiles),
					description: formatMessage(messages.mediaFilesDescription),
					priority: 400,
					keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video'],
					icon: () => <IconImages />,
					action(insert, state) {
						const pluginState = pluginKey.getState(state);
						pluginState?.showMediaPicker();
						const tr = insert('');
						api?.analytics?.actions.attachAnalyticsEvent({
							action: ACTION.OPENED,
							actionSubject: ACTION_SUBJECT.PICKER,
							actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
							attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
							eventType: EVENT_TYPE.UI,
						})(tr);

						return tr;
					},
				},
			],

			floatingToolbar: (state, intl, providerFactory) =>
				floatingToolbar(
					state,
					intl,
					{
						providerFactory,
						allowMediaInline: options && getMediaFeatureFlag('mediaInline', options.featureFlags),
						allowResizing: options && options.allowResizing,
						allowResizingInTables: options && options.allowResizingInTables,
						allowCommentsOnMedia: options && options.allowCommentsOnMedia,
						allowLinking: options && options.allowLinking,
						allowAdvancedToolBarOptions: options && options.allowAdvancedToolBarOptions,
						allowAltTextOnImages: options && options.allowAltTextOnImages,
						allowImagePreview: options && options.allowImagePreview,
						altTextValidator: options && options.altTextValidator,
						fullWidthEnabled: options && options.fullWidthEnabled,
						allowMediaInlineImages: options && options.allowMediaInlineImages,
						getEditorFeatureFlags: options && options.getEditorFeatureFlags,
						isViewOnly: api?.editorViewMode?.sharedState.currentState()?.mode === 'view',
					},
					api,
				),
		},
	};
};
