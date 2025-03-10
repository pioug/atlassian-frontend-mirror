import React from 'react';

import type { IntlShape, MessageDescriptor } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
	alignmentIcons,
	buildLayoutButtons,
	IconCard,
	IconEmbed,
	IconInline,
	layoutToMessages,
	wrappingIcons,
} from '@atlaskit/editor-common/card';
import { altTextMessages } from '@atlaskit/editor-common/media';
import { mediaInlineImagesEnabled } from '@atlaskit/editor-common/media-inline';
import {
	calcMinWidth,
	DEFAULT_IMAGE_HEIGHT,
	DEFAULT_IMAGE_WIDTH,
} from '@atlaskit/editor-common/media-single';
import commonMessages, {
	cardMessages,
	mediaAndEmbedToolbarMessages,
} from '@atlaskit/editor-common/messages';
import type {
	Command,
	DropdownOptions,
	DropdownOptionT,
	ExtractInjectionAPI,
	FloatingToolbarConfig,
	FloatingToolbarDropdown,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { ForceFocusSelector } from '@atlaskit/editor-plugin-floating-toolbar';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	contains,
	findParentNodeOfType,
	hasParentNode,
	hasParentNodeOfType,
	removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import GrowHorizontalIcon from '@atlaskit/icon/core/grow-horizontal';
import ImageFullscreenIcon from '@atlaskit/icon/core/image-fullscreen';
import ImageInlineIcon from '@atlaskit/icon/core/image-inline';
import MaximizeIcon from '@atlaskit/icon/core/maximize';
import DownloadIcon from '@atlaskit/icon/core/migration/download';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import TextIcon from '@atlaskit/icon/core/text';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { mediaFilmstripItemDOMSelector } from '@atlaskit/media-filmstrip';
import { messages } from '@atlaskit/media-ui';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import { MediaSingleNodeSelector } from '../../nodeviews/styles';
import { getPluginState as getMediaAltTextPluginState } from '../../pm-plugins/alt-text';
import { openMediaAltTextMenu } from '../../pm-plugins/alt-text/commands';
import { showLinkingToolbar } from '../../pm-plugins/commands/linking';
import { getMediaLinkingState } from '../../pm-plugins/linking';
import type { MediaLinkingState } from '../../pm-plugins/linking/types';
import { stateKey } from '../../pm-plugins/plugin-key';
import type { MediaPluginState } from '../../pm-plugins/types';
import { currentMediaOrInlineNodeBorderMark } from '../../pm-plugins/utils/current-media-node';
import { isVideo } from '../../pm-plugins/utils/media-single';
import type { MediaFloatingToolbarOptions, MediaToolbarBaseConfig } from '../../types';
import ImageBorderItem from '../../ui/ImageBorder';
import { FullWidthDisplay, PixelEntry } from '../../ui/PixelEntry';

import { altTextButton, getAltTextToolbar } from './alt-text';
import {
	changeMediaCardToInline,
	changeMediaSingleToMediaInline,
	setBorderMark,
	toggleBorderMark,
	updateMediaSingleWidth,
} from './commands';
import { commentButton } from './comments';
import { shouldShowImageBorder } from './imageBorder';
import { LayoutGroup } from './layout-group';
import {
	getLinkingDropdownOptions,
	getLinkingToolbar,
	getOpenLinkToolbarButtonOption,
	shouldShowMediaLinkToolbar,
} from './linking';
import { LinkToolbarAppearance } from './linking-toolbar-appearance';
import { generateMediaInlineFloatingToolbar } from './mediaInline';
import {
	calcNewLayout,
	canShowSwitchButtons,
	downloadMedia,
	getMaxToolbarWidth,
	getPixelWidthOfElement,
	getSelectedLayoutIcon,
	getSelectedMediaSingle,
	getSelectedNearestMediaContainerNodeAttrs,
	removeMediaGroupNode,
} from './utils';

const mediaTypeMessages = {
	image: messages.file_image_is_selected,
	video: messages.file_video_is_selected,
	audio: messages.file_audio_is_selected,
	doc: messages.file_doc_is_selected,
	archive: messages.file_archive_is_selected,
	unknown: messages.file_unknown_is_selected,
};

const remove: Command = (state, dispatch) => {
	if (dispatch) {
		dispatch(removeSelectedNode(state.tr));
	}
	return true;
};

const handleRemoveMediaGroup: Command = (state, dispatch) => {
	const tr = removeMediaGroupNode(state);
	if (dispatch) {
		dispatch(tr);
	}
	return true;
};

export const handleShowMediaViewer = ({
	api,
	mediaPluginState,
}: {
	api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
	mediaPluginState: MediaPluginState;
}) => {
	const selectedNodeAttrs = getSelectedNearestMediaContainerNodeAttrs(mediaPluginState);
	if (!selectedNodeAttrs) {
		return false;
	}
	api?.core.actions.execute(api?.media.commands.showMediaViewer(selectedNodeAttrs));
};

const generateMediaCardFloatingToolbar = (
	state: EditorState,
	intl: IntlShape,
	mediaPluginState: MediaPluginState,
	hoverDecoration: HoverDecorationHandler | undefined,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	forceFocusSelector: ForceFocusSelector | undefined,
	isViewOnly: boolean | undefined,
) => {
	if (isViewOnly) {
		return [];
	}

	const enforceMediaDataSecurityPolicy =
		mediaPluginState?.mediaClientConfig?.enforceDataSecurityPolicy;
	const disableDownloadButton =
		typeof enforceMediaDataSecurityPolicy === 'boolean' && fg('dlp_cc-enforce-attachment-dl-dsp')
			? enforceMediaDataSecurityPolicy
			: false;

	const { mediaGroup } = state.schema.nodes;
	const items: FloatingToolbarItem<Command>[] = [
		{
			id: 'editor.media.view.switcher.inline',
			type: 'button',
			icon: ImageInlineIcon,
			iconFallback: IconInline,
			selected: false,
			focusEditoronEnter: true,
			disabled: false,
			onClick: changeMediaCardToInline(editorAnalyticsAPI, forceFocusSelector),
			title: intl.formatMessage(cardMessages.inlineTitle),
			testId: 'inline-appearance',
			className: 'inline-appearance', // a11y. uses to force focus on item
		},
		{
			id: 'editor.media.view.switcher.thumbnail',
			type: 'button',
			icon: SmartLinkCardIcon,
			iconFallback: IconCard,
			selected: true,
			disabled: false,
			focusEditoronEnter: true,
			onClick: () => true,
			title: intl.formatMessage(cardMessages.blockTitle),
			testId: 'thumbnail-appearance',
			className: 'thumbnail-appearance', // a11y. uses to force focus on item
		},
		{ type: 'separator' },
		{
			id: 'editor.media.viewer',
			testId: 'file-preview-toolbar-button',
			type: 'button',
			icon: editorExperiment('platform_editor_controls', 'variant1')
				? GrowDiagonalIcon
				: MaximizeIcon,
			iconFallback: FilePreviewIcon,
			title: intl.formatMessage(messages.preview),
			onClick: () => {
				return handleShowMediaViewer({ mediaPluginState, api: pluginInjectionApi }) ?? false;
			},
			supportsViewMode: true,
		},
		{ type: 'separator' },
		{
			id: 'editor.media.card.download',
			type: 'button',
			icon: DownloadIcon,
			onClick: () => {
				downloadMedia(mediaPluginState);
				return true;
			},
			title: intl.formatMessage(messages.download),
			disabled: disableDownloadButton,
		},
		{ type: 'separator' },
		{
			type: 'copy-button',
			supportsViewMode: true,
			items: [
				{
					state,
					formatMessage: intl.formatMessage,
					nodeType: mediaGroup,
				},
			],
		},
		{ type: 'separator' },
		{
			id: 'editor.media.delete',
			type: 'button',
			appearance: 'danger',
			focusEditoronEnter: true,
			icon: DeleteIcon,
			iconFallback: RemoveIcon,
			onMouseEnter: hoverDecoration?.(mediaGroup, true),
			onMouseLeave: hoverDecoration?.(mediaGroup, false),
			onFocus: hoverDecoration?.(mediaGroup, true),
			onBlur: hoverDecoration?.(mediaGroup, false),
			title: intl.formatMessage(commonMessages.remove),
			onClick: handleRemoveMediaGroup,
			testId: 'media-toolbar-remove-button',
		},
	];
	return items;
};

const generateMediaSingleFloatingToolbar = (
	state: EditorState,
	intl: IntlShape,
	options: MediaFloatingToolbarOptions,
	pluginState: MediaPluginState,
	mediaLinkingState: MediaLinkingState,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
) => {
	const { mediaSingle } = state.schema.nodes;
	const {
		allowResizing,
		allowLinking,
		allowAdvancedToolBarOptions,
		allowCommentsOnMedia,
		allowResizingInTables,
		allowAltTextOnImages,
		allowMediaInline,
		allowMediaInlineImages,
		allowImagePreview,
		isViewOnly,
	} = options;

	let toolbarButtons: FloatingToolbarItem<Command>[] = [];
	const { hoverDecoration } = pluginInjectionApi?.decorations?.actions ?? {};

	if (shouldShowImageBorder(state)) {
		toolbarButtons.push({
			type: 'custom',
			fallback: [],
			render: (editorView) => {
				if (!editorView) {
					return null;
				}
				const { dispatch, state } = editorView;
				const borderMark = currentMediaOrInlineNodeBorderMark(state);
				return (
					<ImageBorderItem
						toggleBorder={() => {
							toggleBorderMark(pluginInjectionApi?.analytics?.actions)(state, dispatch);
						}}
						setBorder={(attrs) => {
							setBorderMark(pluginInjectionApi?.analytics?.actions)(attrs)(state, dispatch);
						}}
						borderMark={borderMark}
						intl={intl}
					/>
				);
			},
		});
		toolbarButtons.push({ type: 'separator' });
	}

	if (allowAdvancedToolBarOptions) {
		const widthPlugin = pluginInjectionApi?.width;
		let isChangingLayoutDisabled = false;
		const selectedNode = getSelectedMediaSingle(state);

		if (fg('platform_editor_media_extended_resize_experience')) {
			const contentWidth = widthPlugin?.sharedState.currentState()?.lineLength;
			const selectedNodeMaxWidth = pluginState.currentMaxWidth || contentWidth;

			if (
				selectedNode &&
				selectedNodeMaxWidth &&
				selectedNode.node.attrs.width >= selectedNodeMaxWidth
			) {
				isChangingLayoutDisabled = true;
			}
		}

		const layoutButtons = buildLayoutButtons(
			state,
			intl,
			state.schema.nodes.mediaSingle,
			widthPlugin,
			pluginInjectionApi?.analytics?.actions,
			allowResizing,
			allowResizingInTables,
			true,
			true,
			isChangingLayoutDisabled,
		);
		if (mediaInlineImagesEnabled(allowMediaInline, allowMediaInlineImages) && selectedNode) {
			const selectedLayoutIcon = getSelectedLayoutIcon(
				[...alignmentIcons, ...wrappingIcons],
				selectedNode.node,
			);

			if (selectedLayoutIcon && layoutButtons.length) {
				const options: DropdownOptions<Command> = {
					render: (props) => {
						return (
							<LayoutGroup
								layoutButtons={layoutButtons}
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...props}
							/>
						);
					},
					width: 188,
					height: 32,
				};
				const trigger: FloatingToolbarDropdown<Command> = {
					id: 'media-single-layout',
					testId: 'media-single-layout-dropdown-trigger',
					type: 'dropdown',
					options: options,
					title: intl.formatMessage(layoutToMessages[selectedLayoutIcon.value]),
					icon: selectedLayoutIcon.icon,
				};

				toolbarButtons = [...toolbarButtons, trigger, { type: 'separator' }];
			}
		} else {
			toolbarButtons = [...toolbarButtons, ...layoutButtons];

			if (layoutButtons.length) {
				toolbarButtons.push({ type: 'separator' });
			}
		}

		// floating and inline switcher
		if (pluginState.allowInlineImages && selectedNode && canShowSwitchButtons(selectedNode.node)) {
			// mediaInlne doesn't suppprt external images, so hiding buttons to prevent conversion from mediaSingle to mediaInline
			if (selectedNode.node.firstChild?.attrs.type !== 'external') {
				const hasCaption = contains(selectedNode.node, state.schema.nodes.caption);
				const inlineSwitcherTitle = intl.formatMessage(
					hasCaption
						? mediaAndEmbedToolbarMessages.changeToMediaInlineImageCaptionWarning
						: mediaAndEmbedToolbarMessages.changeToMediaInlineImage,
				);
				const floatingSwitcherTitle = intl.formatMessage(
					mediaAndEmbedToolbarMessages.changeToMediaSingle,
				);

				if (editorExperiment('platform_editor_controls', 'control')) {
					toolbarButtons.push(
						{
							type: 'button',
							id: 'editor.media.image.view.switcher.inline',
							title: inlineSwitcherTitle,
							icon: () => (
								<ImageInlineIcon
									color="currentColor"
									spacing="spacious"
									label={inlineSwitcherTitle}
									LEGACY_size="medium"
									LEGACY_fallbackIcon={IconInline}
								/>
							),
							onClick: changeMediaSingleToMediaInline(pluginInjectionApi?.analytics?.actions),
							testId: 'image-inline-appearance',
						},
						{
							type: 'button',
							id: 'editor.media.image.view.switcher.floating',
							title: floatingSwitcherTitle,
							icon: () => (
								<ImageFullscreenIcon
									color="currentColor"
									spacing="spacious"
									label={floatingSwitcherTitle}
									LEGACY_size="medium"
									LEGACY_fallbackIcon={IconEmbed}
								/>
							),
							onClick: () => {
								return true;
							},
							testId: 'image-floating-appearance',
							selected: true,
						},
						{ type: 'separator' },
					);
				} else {
					const options: DropdownOptionT<Command>[] = [
						{
							id: 'editor.media.convert.mediainline',
							title: inlineSwitcherTitle,
							onClick: changeMediaSingleToMediaInline(pluginInjectionApi?.analytics?.actions),
							icon: (
								<ImageInlineIcon
									color="currentColor"
									spacing="spacious"
									label={inlineSwitcherTitle}
									LEGACY_size="medium"
									LEGACY_fallbackIcon={IconInline}
								/>
							),
						},
						{
							id: 'editor.media.convert.mediasingle',
							title: floatingSwitcherTitle,
							selected: true,
							onClick: () => {
								return true;
							},
							icon: (
								<ImageFullscreenIcon
									color="currentColor"
									spacing="spacious"
									label={floatingSwitcherTitle}
									LEGACY_size="medium"
									LEGACY_fallbackIcon={IconEmbed}
								/>
							),
						},
					];

					const switchFromBlockToInline: FloatingToolbarDropdown<Command> = {
						id: 'media-block-to-inline-toolbar-item',
						testId: 'media-inline-to-block-dropdown',
						type: 'dropdown',
						options: options,
						title: intl.formatMessage(messages.sizeOptions),
						icon: () => (
							<ImageFullscreenIcon
								color="currentColor"
								spacing="spacious"
								label={intl.formatMessage(messages.sizeOptions)}
								LEGACY_size="medium"
								LEGACY_fallbackIcon={IconEmbed}
							/>
						),
					};

					toolbarButtons.push(switchFromBlockToInline, {
						type: 'separator',
						fullHeight: true,
					});
				}
			}
		}

		// Pixel Entry Toolbar Support
		const { selection } = state;
		const isWithinTable = hasParentNodeOfType([state.schema.nodes.table])(selection);
		if (
			allowResizing &&
			(!isWithinTable || allowResizingInTables === true) &&
			fg('platform_editor_media_extended_resize_experience')
		) {
			const selectedMediaSingleNode = getSelectedMediaSingle(state);

			const sizeInput = {
				type: 'custom',
				fallback: [],
				render: (editorView) => {
					if (!editorView || !selectedMediaSingleNode) {
						return null;
					}
					const { state, dispatch } = editorView;

					const contentWidth =
						widthPlugin?.sharedState.currentState()?.lineLength || akEditorDefaultLayoutWidth;

					const selectedMediaNode = selectedMediaSingleNode.node.content.firstChild;
					if (!selectedMediaNode) {
						return null;
					}

					const { width: mediaSingleWidth, widthType, layout } = selectedMediaSingleNode.node.attrs;
					const { width: mediaWidth, height: mediaHeight } = selectedMediaNode.attrs;

					const maxWidthForNestedNode =
						pluginInjectionApi?.media?.sharedState.currentState()?.currentMaxWidth;

					const maxWidth = maxWidthForNestedNode || akEditorFullWidthLayoutWidth;

					const isVideoFile = isVideo(selectedMediaNode.attrs.__fileMimeType);

					const minWidth = calcMinWidth(isVideoFile, maxWidthForNestedNode || contentWidth);

					const hasPixelType = widthType === 'pixel';

					const pixelWidthFromElement = getPixelWidthOfElement(
						editorView,
						selectedMediaSingleNode.pos + 1, // get pos of media node
						mediaWidth || DEFAULT_IMAGE_WIDTH,
					);

					const pixelWidth = hasPixelType ? mediaSingleWidth : pixelWidthFromElement;

					//hasParentNode will return falsey value if selection depth === 0
					const isNested = hasParentNode((n) => n.type !== state.schema.nodes.doc)(state.selection);

					return (
						<PixelEntry
							intl={intl}
							width={pluginState.isResizing ? pluginState.resizingWidth : pixelWidth}
							showMigration={!pluginState.isResizing && !hasPixelType}
							mediaWidth={mediaWidth || DEFAULT_IMAGE_WIDTH}
							mediaHeight={mediaHeight || DEFAULT_IMAGE_HEIGHT}
							minWidth={minWidth}
							maxWidth={maxWidth}
							onChange={(valid: boolean) => {
								if (valid) {
									hoverDecoration?.(mediaSingle, true, 'warning')(
										editorView.state,
										dispatch,
										editorView,
									);
								} else {
									hoverDecoration?.(mediaSingle, false)(editorView.state, dispatch, editorView);
								}
							}}
							onSubmit={({ width, validation }) => {
								const newLayout = calcNewLayout(
									width,
									layout,
									contentWidth,
									options.fullWidthEnabled,
									isNested,
								);

								updateMediaSingleWidth(pluginInjectionApi?.analytics?.actions)(
									width,
									validation,
									'floatingToolBar',
									newLayout,
								)(state, dispatch);
							}}
							onMigrate={() => {
								const tr = state.tr.setNodeMarkup(selectedMediaSingleNode.pos, undefined, {
									...selectedMediaSingleNode.node.attrs,
									width: pixelWidthFromElement,
									widthType: 'pixel',
								});
								tr.setMeta('scrollIntoView', false);
								tr.setSelection(NodeSelection.create(tr.doc, selectedMediaSingleNode.pos));
								dispatch(tr);
							}}
						/>
					);
				},
			} as FloatingToolbarItem<Command>;

			if (pluginState.isResizing) {
				// If the image is resizing
				// then return pixel entry component or full width label as the only toolbar item
				if (!selectedMediaSingleNode) {
					return [];
				}

				const { layout } = selectedMediaSingleNode.node.attrs;
				if (layout === 'full-width') {
					const fullWidthLabel = {
						type: 'custom',
						fallback: [],
						render: () => {
							return <FullWidthDisplay intl={intl} />;
						},
					} as FloatingToolbarItem<Command>;
					return [fullWidthLabel];
				}
				return [sizeInput];
			}
			if (editorExperiment('platform_editor_controls', 'control')) {
				toolbarButtons.push(sizeInput);
				toolbarButtons.push({ type: 'separator' });
			}
		}

		if (editorExperiment('platform_editor_controls', 'control')) {
			if (allowCommentsOnMedia) {
				toolbarButtons.push(commentButton(intl, state, pluginInjectionApi), {
					type: 'separator',
					supportsViewMode: true,
				});
			}

			if (allowLinking && shouldShowMediaLinkToolbar(state)) {
				toolbarButtons.push({
					type: 'custom',
					fallback: [],
					render: (editorView, idx) => {
						if (editorView?.state) {
							const editLink = () => {
								if (editorView) {
									const { state, dispatch } = editorView;
									showLinkingToolbar(state, dispatch);
								}
							};

							const openLink = () => {
								if (editorView) {
									const {
										state: { tr },
										dispatch,
									} = editorView;
									pluginInjectionApi?.analytics?.actions.attachAnalyticsEvent({
										eventType: EVENT_TYPE.TRACK,
										action: ACTION.VISITED,
										actionSubject: ACTION_SUBJECT.MEDIA,
										actionSubjectId: ACTION_SUBJECT_ID.LINK,
									})(tr);
									dispatch(tr);
									return true;
								}
							};

							return (
								<LinkToolbarAppearance
									key={idx}
									editorState={editorView.state}
									intl={intl}
									mediaLinkingState={mediaLinkingState}
									onAddLink={editLink}
									onEditLink={editLink}
									onOpenLink={openLink}
									isViewOnly={isViewOnly}
								/>
							);
						}
						return null;
					},
					supportsViewMode: true,
				});
			}
			// Preview Support
			if (allowImagePreview) {
				const selectedMediaSingleNode = getSelectedMediaSingle(state);
				const mediaNode = selectedMediaSingleNode?.node.content.firstChild;
				if (!isVideo(mediaNode?.attrs?.__fileMimeType)) {
					toolbarButtons.push(
						{
							id: 'editor.media.viewer',
							testId: 'file-preview-toolbar-button',
							type: 'button',
							icon: editorExperiment('platform_editor_controls', 'variant1')
								? GrowDiagonalIcon
								: MaximizeIcon,
							iconFallback: FilePreviewIcon,
							title: intl.formatMessage(messages.preview),
							onClick: () => {
								return (
									handleShowMediaViewer({
										api: pluginInjectionApi,
										mediaPluginState: pluginState,
									}) ?? false
								);
							},
							supportsViewMode: true,
						},
						{
							type: 'separator',
							supportsViewMode: true,
						},
					);
				}
			}
		}
	}

	if (isViewOnly) {
		toolbarButtons.push(
			{
				id: 'editor.media.image.download',
				type: 'button',
				icon: DownloadIcon,
				onClick: () => {
					downloadMedia(pluginState, isViewOnly);
					return true;
				},
				title: intl.formatMessage(messages.download),
				supportsViewMode: true,
			},
			{ type: 'separator', supportsViewMode: true },
		);
	}

	if (allowAltTextOnImages && editorExperiment('platform_editor_controls', 'control')) {
		toolbarButtons.push(altTextButton(intl, state, pluginInjectionApi?.analytics?.actions), {
			type: 'separator',
		});
	}

	const removeButton: FloatingToolbarItem<Command> = {
		id: 'editor.media.delete',
		type: 'button',
		appearance: 'danger',
		focusEditoronEnter: true,
		icon: DeleteIcon,
		iconFallback: RemoveIcon,
		onMouseEnter: hoverDecoration?.(mediaSingle, true),
		onMouseLeave: hoverDecoration?.(mediaSingle, false),
		onFocus: hoverDecoration?.(mediaSingle, true),
		onBlur: hoverDecoration?.(mediaSingle, false),
		title: intl.formatMessage(commonMessages.remove),
		onClick: remove,
		testId: 'media-toolbar-remove-button',
		supportsViewMode: false,
	};

	if (editorExperiment('platform_editor_controls', 'variant1')) {
		// Preview Support
		if (allowAdvancedToolBarOptions && allowImagePreview) {
			const selectedMediaSingleNode = getSelectedMediaSingle(state);
			const mediaNode = selectedMediaSingleNode?.node.content.firstChild;
			if (!isVideo(mediaNode?.attrs?.__fileMimeType)) {
				toolbarButtons.push(
					{
						id: 'editor.media.viewer',
						testId: 'file-preview-toolbar-button',
						type: 'button',
						icon: editorExperiment('platform_editor_controls', 'variant1')
							? GrowDiagonalIcon
							: MaximizeIcon,
						iconFallback: FilePreviewIcon,
						title: intl.formatMessage(messages.preview),
						onClick: () => {
							return (
								handleShowMediaViewer({
									api: pluginInjectionApi,
									mediaPluginState: pluginState,
								}) ?? false
							);
						},
						supportsViewMode: true,
					},
					{
						type: 'separator',
						supportsViewMode: true,
						fullHeight: true,
					},
				);
			}
		}

		// open link
		if (
			allowLinking &&
			shouldShowMediaLinkToolbar(state) &&
			mediaLinkingState &&
			mediaLinkingState.editable
		) {
			toolbarButtons.push(
				getOpenLinkToolbarButtonOption(intl, mediaLinkingState, pluginInjectionApi),
				{
					type: 'separator',
					supportsViewMode: true,
					fullHeight: true,
				},
			);
		}

		isViewOnly &&
			toolbarButtons.push(
				{
					type: 'copy-button',
					items: [
						{
							state,
							formatMessage: intl.formatMessage,
							nodeType: mediaSingle,
						},
					],
					supportsViewMode: true,
				},
				{ type: 'separator', supportsViewMode: true },
			);

		if (allowAdvancedToolBarOptions && allowCommentsOnMedia) {
			// TODO: ED-26962 - add separator when overflow menu is added
			toolbarButtons.push(commentButton(intl, state, pluginInjectionApi));
		}

		return toolbarButtons;
	}

	const items: Array<FloatingToolbarItem<Command>> = [
		...toolbarButtons,
		{
			type: 'copy-button',
			items: [
				{
					state,
					formatMessage: intl.formatMessage,
					nodeType: mediaSingle,
				},
			],
			supportsViewMode: true,
		},
	];

	items.push({ type: 'separator', supportsViewMode: false });
	items.push(removeButton);

	return items;
};

const getMediaTypeMessage = (selectedNodeTypeSingle: string): MessageDescriptor => {
	const mediaType = Object.keys(mediaTypeMessages).find((key) =>
		selectedNodeTypeSingle?.includes(key),
	);
	return mediaType
		? mediaTypeMessages[mediaType as keyof typeof mediaTypeMessages]
		: messages.file_unknown_is_selected;
};

export const floatingToolbar = (
	state: EditorState,
	intl: IntlShape,
	options: MediaFloatingToolbarOptions = {},
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
): FloatingToolbarConfig | undefined => {
	const { media, mediaInline, mediaSingle, mediaGroup } = state.schema.nodes;
	const {
		altTextValidator,
		allowLinking,
		allowAltTextOnImages,
		providerFactory,
		allowMediaInline,
		allowResizing,
		isViewOnly,
	} = options;
	const mediaPluginState: MediaPluginState | undefined = stateKey.getState(state);

	const mediaLinkingState: MediaLinkingState = getMediaLinkingState(state);
	const { hoverDecoration } = pluginInjectionApi?.decorations?.actions ?? {};

	if (!mediaPluginState) {
		return;
	}
	const nodeType = allowMediaInline ? [mediaInline, mediaSingle, media] : [mediaSingle];
	const baseToolbar: MediaToolbarBaseConfig = {
		title: 'Media floating controls',
		nodeType,
		getDomRef: () => mediaPluginState.element,
	};

	if (
		allowLinking &&
		mediaLinkingState &&
		mediaLinkingState.visible &&
		shouldShowMediaLinkToolbar(state)
	) {
		const linkingToolbar = getLinkingToolbar(
			baseToolbar,
			mediaLinkingState,
			state,
			intl,
			pluginInjectionApi,
			providerFactory,
		);
		if (linkingToolbar) {
			return linkingToolbar;
		}
	}

	if (allowAltTextOnImages) {
		const mediaAltTextPluginState = getMediaAltTextPluginState(state);
		if (mediaAltTextPluginState.isAltTextEditorOpen) {
			return getAltTextToolbar(baseToolbar, {
				altTextValidator,
				forceFocusSelector: pluginInjectionApi?.floatingToolbar?.actions?.forceFocusSelector,
			});
		}
	}

	let items: FloatingToolbarItem<Command>[] = [];
	const parentMediaGroupNode = findParentNodeOfType(mediaGroup)(state.selection);
	let selectedNodeType;
	if (state.selection instanceof NodeSelection) {
		selectedNodeType = state.selection.node.type;
	}
	if (allowMediaInline && parentMediaGroupNode?.node.type === mediaGroup) {
		const mediaOffset = state.selection.$from.parentOffset + 1;
		baseToolbar.getDomRef = () => {
			const selector = mediaFilmstripItemDOMSelector(mediaOffset);
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			return mediaPluginState.element?.querySelector(selector) as HTMLElement;
		};
		items = generateMediaCardFloatingToolbar(
			state,
			intl,
			mediaPluginState,
			hoverDecoration,
			pluginInjectionApi,
			pluginInjectionApi?.analytics?.actions,
			pluginInjectionApi?.floatingToolbar?.actions?.forceFocusSelector,
			isViewOnly,
		);
	} else if (allowMediaInline && selectedNodeType && selectedNodeType === mediaInline) {
		items = generateMediaInlineFloatingToolbar(
			state,
			intl,
			mediaPluginState,
			hoverDecoration,
			pluginInjectionApi,
			options,
		);
	} else {
		baseToolbar.getDomRef = () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			const element = mediaPluginState.element?.querySelector(
				`.${MediaSingleNodeSelector}`,
			) as HTMLElement;
			return element || mediaPluginState.element;
		};
		items = generateMediaSingleFloatingToolbar(
			state,
			intl,
			options,
			mediaPluginState,
			mediaLinkingState,
			pluginInjectionApi,
		);
	}

	if (!mediaPluginState.isResizing && editorExperiment('platform_editor_controls', 'variant1')) {
		const lastItem = items.at(-1);
		if (lastItem?.type === 'separator') {
			lastItem.fullHeight = true;
		} else if (items.length) {
			items.push({ type: 'separator', fullHeight: true });
		}

		const altTextTitle = intl.formatMessage(altTextMessages.addAltText);

		items.push({
			type: 'overflow-dropdown',
			options: [
				...getLinkingDropdownOptions(
					state,
					intl,
					mediaLinkingState,
					allowMediaInline && selectedNodeType && selectedNodeType === mediaInline,
					allowLinking,
					isViewOnly,
				),
				{
					title: altTextTitle,
					onClick: openMediaAltTextMenu(pluginInjectionApi?.analytics?.actions),
					icon: <TextIcon label={altTextTitle} />,
				},
				{
					title: 'Resize',
					onClick: () => {
						// Ignored via go/ees007
						// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
						// TODO open resize dialog?
						return true;
					},
					icon: <GrowHorizontalIcon label="Resize" />,
				},
				{ type: 'separator' },
				{
					title: 'Copy',
					onClick: () => {
						pluginInjectionApi?.core?.actions.execute(
							// @ts-ignore
							pluginInjectionApi?.floatingToolbar?.commands.copyNode(nodeType),
						);
						return true;
					},
					icon: <CopyIcon label="Copy" />,
				},
				{
					title: 'Delete',
					onClick: remove,
					icon: <DeleteIcon label="Delete" />,
				},
			],
		});
	}

	// Ignored via go/ees005
	// eslint-disable-next-line no-var
	var assistiveMessage = '';

	const selectedMediaSingleNode = getSelectedMediaSingle(state);
	if (selectedMediaSingleNode) {
		const selectedMediaNodeView = selectedMediaSingleNode?.node.content;
		if (selectedMediaNodeView) {
			const selectedMediaNode = selectedMediaNodeView.firstChild;
			const selectedNodeTypeSingle = selectedMediaNode?.attrs.__fileMimeType;
			const selectedMediaAlt = selectedMediaNode?.attrs.alt;
			assistiveMessage = intl?.formatMessage(getMediaTypeMessage(selectedNodeTypeSingle), {
				name: selectedMediaAlt,
			});
		}
	}

	const toolbarConfig = {
		...baseToolbar,
		items,
		scrollable: true,
		mediaAssistiveMessage: assistiveMessage,
	};

	if (allowResizing && fg('platform_editor_media_extended_resize_experience')) {
		return {
			...toolbarConfig,
			width: mediaPluginState.isResizing ? undefined : getMaxToolbarWidth(),
		};
	}

	return toolbarConfig;
};
