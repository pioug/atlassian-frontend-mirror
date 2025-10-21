import React, { useMemo } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorAppearance,
	ExtractInjectionAPI,
	PMPlugin,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MediaNextEditorPluginType } from './mediaPluginType';
import { lazyMediaView } from './nodeviews/lazy-media';
import { lazyMediaGroupView } from './nodeviews/lazy-media-group';
import { lazyMediaInlineView } from './nodeviews/lazy-media-inline';
import { lazyMediaSingleView } from './nodeviews/lazy-media-single';
import { mediaSpecWithFixedToDOM } from './nodeviews/toDOM-fixes/media';
import { mediaGroupSpecWithFixedToDOM } from './nodeviews/toDOM-fixes/mediaGroup';
import { mediaInlineSpecWithFixedToDOM } from './nodeviews/toDOM-fixes/mediaInline';
import { mediaSingleSpecWithFixedToDOM } from './nodeviews/toDOM-fixes/mediaSingle';
import { createPlugin as createMediaAltTextPlugin } from './pm-plugins/alt-text';
import keymapMediaAltTextPlugin from './pm-plugins/alt-text/keymap';
import { hideMediaViewer, showMediaViewer, trackMediaPaste } from './pm-plugins/commands';
import keymapPlugin from './pm-plugins/keymap';
import keymapMediaSinglePlugin from './pm-plugins/keymap-media';
import linkingPlugin from './pm-plugins/linking';
import keymapLinkingPlugin from './pm-plugins/linking/keymap';
import { createPlugin } from './pm-plugins/main';
import { createPlugin as createMediaPixelResizingPlugin } from './pm-plugins/pixel-resizing';
import { stateKey } from './pm-plugins/plugin-key';
import { createMediaIdentifierArray, extractMediaNodes } from './pm-plugins/utils/media-common';
import { insertMediaAsMediaSingle } from './pm-plugins/utils/media-single';
import { MediaPickerComponents } from './ui/MediaPicker';
import { RenderMediaViewer } from './ui/MediaViewer/PortalWrapper';
import { floatingToolbar } from './ui/toolbar';
import ToolbarMedia from './ui/ToolbarMedia';

type MediaPickerFunctionalComponentProps = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	appearance: EditorAppearance;
	editorDomElement: Element;
};

type MediaViewerFunctionalComponentProps = {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	editorView: EditorView;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'media'
	>,
) => {
	return {
		onPopupToggle: states.mediaState?.onPopupToggle,
		setBrowseFn: states.mediaState?.setBrowseFn,
	};
};

const MediaPickerFunctionalComponent = ({
	api,
	editorDomElement,
	appearance,
}: MediaPickerFunctionalComponentProps) => {
	const { onPopupToggle, setBrowseFn } = useSharedPluginStateWithSelector(api, ['media'], selector);
	if (!onPopupToggle || !setBrowseFn) {
		return null;
	}

	return (
		<MediaPickerComponents
			onPopupToggle={onPopupToggle}
			setBrowseFn={setBrowseFn}
			editorDomElement={editorDomElement}
			appearance={appearance}
			api={api}
		/>
	);
};

const mediaViewerStateSelector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'media'
	>,
) => {
	return {
		isMediaViewerVisible: states.mediaState?.isMediaViewerVisible,
		mediaViewerSelectedMedia: states.mediaState?.mediaViewerSelectedMedia,
		mediaClientConfig: states.mediaState?.mediaClientConfig,
	};
};

const MediaViewerFunctionalComponent = ({
	api,
	editorView,
}: MediaViewerFunctionalComponentProps) => {
	// Only traverse document once when media viewer is visible, media viewer items will not update
	// when document changes are made while media viewer is open
	const { isMediaViewerVisible, mediaViewerSelectedMedia, mediaClientConfig } =
		useSharedPluginStateWithSelector(api, ['media'], mediaViewerStateSelector);

	const mediaItems = useMemo(() => {
		if (isMediaViewerVisible) {
			const mediaNodes = extractMediaNodes(editorView.state.doc);
			return createMediaIdentifierArray(mediaNodes);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- only update mediaItems once when media viewer is visible
	}, [isMediaViewerVisible]);

	// Viewer does not have required attributes to render the media viewer
	if (!isMediaViewerVisible || !mediaViewerSelectedMedia || !mediaClientConfig) {
		return null;
	}

	const handleOnClose = () => {
		// Run Command to hide the media viewer
		api?.core.actions.execute(api?.media.commands.hideMediaViewer);
	};

	return (
		<RenderMediaViewer
			mediaClientConfig={mediaClientConfig}
			onClose={handleOnClose}
			selectedNodeAttrs={mediaViewerSelectedMedia}
			items={mediaItems}
		/>
	);
};

export const mediaPlugin: MediaNextEditorPluginType = ({ config: options = {}, api }) => {
	let previousMediaProvider: Promise<MediaProvider> | undefined;
	const mediaErrorLocalIds = new Set<string>();

	return {
		name: 'media',

		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			return stateKey.getState(editorState) || null;
		},

		actions: {
			handleMediaNodeRenderError: (node: PMNode, reason: string) => {
				// Only fire the errored event once per media node
				if (mediaErrorLocalIds.has(node.attrs.localId)) {
					return;
				}
				mediaErrorLocalIds.add(node.attrs.localId);

				api?.analytics?.actions.fireAnalyticsEvent({
					action: ACTION.ERRORED,
					actionSubject: ACTION_SUBJECT.EDITOR,
					actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
					eventType: EVENT_TYPE.UI,
					attributes: { reason, external: node.attrs.__external },
				});
			},

			insertMediaAsMediaSingle: (view, node, inputMethod, insertMediaVia) =>
				insertMediaAsMediaSingle(
					view,
					node,
					inputMethod,
					api?.analytics?.actions,
					insertMediaVia,
					options?.allowPixelResizing,
				),
			setProvider: (provider) => {
				// Prevent someone trying to set the exact same provider twice for performance reasons
				if (previousMediaProvider === provider) {
					return false;
				}
				previousMediaProvider = provider;
				return (
					api?.core.actions.execute(({ tr }) =>
						tr.setMeta(stateKey, { mediaProvider: provider }),
					) ?? false
				);
			},
		},
		commands: {
			showMediaViewer,
			hideMediaViewer,
			trackMediaPaste,
		},

		nodes() {
			const {
				allowMediaGroup = true,
				allowMediaSingle = false,
				allowPixelResizing = false,
				allowCaptions,
				allowMediaInlineImages,
				featureFlags: mediaFeatureFlags,
			} = options || {};

			const allowMediaInline = fg('platform_editor_remove_media_inline_feature_flag')
				? allowMediaInlineImages
				: getMediaFeatureFlag('mediaInline', mediaFeatureFlags);

			const mediaSingleOption = {
				withCaption: allowCaptions,
				withExtendedWidthTypes: allowPixelResizing,
			};

			return [
				{ name: 'mediaGroup', node: mediaGroupSpecWithFixedToDOM() },
				{ name: 'mediaSingle', node: mediaSingleSpecWithFixedToDOM(mediaSingleOption) },
				{ name: 'media', node: mediaSpecWithFixedToDOM() },
				{ name: 'mediaInline', node: mediaInlineSpecWithFixedToDOM() },
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
						dispatchAnalyticsEvent,
						nodeViewPortalProviderAPI,
					}: PMPluginFactoryParams) => {
						return createPlugin(
							schema,
							{
								providerFactory,
								nodeViews: {
									mediaGroup: lazyMediaGroupView(
										portalProviderAPI,
										eventDispatcher,
										providerFactory,
										options,
										api,
									),
									mediaSingle: lazyMediaSingleView(
										portalProviderAPI,
										eventDispatcher,
										providerFactory,
										api,
										dispatchAnalyticsEvent,
										options,
									),
									media: lazyMediaView(
										portalProviderAPI,
										eventDispatcher,
										providerFactory,
										options,
										api,
									),
									mediaInline: lazyMediaInlineView(
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
							getIntl,
							api,
							nodeViewPortalProviderAPI,
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

			if (
				options &&
				options.allowAdvancedToolBarOptions &&
				options.allowResizing &&
				editorExperiment('platform_editor_controls', 'variant1') &&
				options.allowPixelResizing
			) {
				pmPlugins.push({
					name: 'mediaPixelResizing',
					plugin: createMediaPixelResizingPlugin,
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
			if (!editorView) {
				return null;
			}

			return (
				<>
					<MediaViewerFunctionalComponent api={api} editorView={editorView} />
					<MediaPickerFunctionalComponent
						editorDomElement={editorView.dom}
						appearance={appearance}
						api={api}
					/>
				</>
			);
		},

		secondaryToolbarComponent({ editorView, eventDispatcher, disabled }) {
			return <ToolbarMedia isDisabled={disabled} isReducedSpacing={true} api={api} />;
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [],

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
						isViewOnly: api?.editorViewMode?.sharedState.currentState()?.mode === 'view',
						allowPixelResizing: options?.allowPixelResizing,
						onCommentButtonMount: options?.onCommentButtonMount,
					},
					api,
				),
		},
	};
};
