import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { IconCard, IconEmbed, IconInline } from '@atlaskit/editor-common/card';
import commonMessages, {
	cardMessages,
	mediaAndEmbedToolbarMessages,
} from '@atlaskit/editor-common/messages';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { messages } from '@atlaskit/media-ui';
import { fg } from '@atlaskit/platform-feature-flags';

import { showLinkingToolbar } from '../commands/linking';
import type { MediaNextEditorPluginType } from '../next-plugin-type';
import { getMediaLinkingState } from '../pm-plugins/linking';
import type { MediaLinkingState } from '../pm-plugins/linking';
import type { MediaPluginState } from '../pm-plugins/types';
import type { MediaFloatingToolbarOptions } from '../types';
import ImageBorderItem from '../ui/ImageBorder';
import { currentMediaOrInlineNodeBorderMark } from '../utils/current-media-node';
import { isImage } from '../utils/is-type';

import { altTextButton } from './alt-text';
import {
	changeInlineToMediaCard,
	changeMediaInlineToMediaSingle,
	removeInlineCard,
	setBorderMark,
	toggleBorderMark,
} from './commands';
import { FilePreviewItem } from './filePreviewItem';
import { shouldShowImageBorder } from './imageBorder';
import { LinkToolbarAppearance } from './linking-toolbar-appearance';
import { downloadMedia } from './utils';

import { generateFilePreviewItem, handleShowMediaViewer } from './index';

export const generateMediaInlineFloatingToolbar = (
	state: EditorState,
	intl: IntlShape,
	mediaPluginState: MediaPluginState,
	hoverDecoration: HoverDecorationHandler | undefined,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	options: MediaFloatingToolbarOptions = {},
) => {
	const editorAnalyticsAPI = pluginInjectionApi?.analytics?.actions as EditorAnalyticsAPI;
	const forceFocusSelector = pluginInjectionApi?.floatingToolbar?.actions?.forceFocusSelector;

	const { mediaInline } = state.schema.nodes;
	const mediaType = state.selection instanceof NodeSelection && state.selection.node.attrs.type;
	const mediaLinkingState: MediaLinkingState = getMediaLinkingState(state);

	if (mediaPluginState.allowInlineImages && isImage(mediaType)) {
		return getMediaInlineImageToolbar(
			state,
			intl,
			mediaPluginState,
			hoverDecoration,
			editorAnalyticsAPI,
			pluginInjectionApi,
			mediaLinkingState,
			options,
		);
	}

	const items: FloatingToolbarItem<Command>[] = [
		{
			id: 'editor.media.view.switcher.inline',
			type: 'button',
			icon: IconInline,
			selected: true,
			disabled: false,
			focusEditoronEnter: true,
			onClick: () => true,
			title: intl.formatMessage(cardMessages.inlineTitle),
			testId: 'inline-appearance',
			className: 'inline-appearance', // a11y. uses to force focus on item
		},
		{
			id: 'editor.media.view.switcher.thumbnail',
			type: 'button',
			icon: IconCard,
			selected: false,
			disabled: false,
			focusEditoronEnter: true,
			onClick: changeInlineToMediaCard(editorAnalyticsAPI, forceFocusSelector),
			title: intl.formatMessage(cardMessages.blockTitle),
			testId: 'thumbnail-appearance',
			className: 'thumbnail-appearance', // a11y. uses to force focus on item
		},
		{
			type: 'separator',
		},
		{
			type: 'custom',
			fallback: [],
			render: () => {
				return (
					<FilePreviewItem
						key="editor.media.card.preview"
						mediaPluginState={mediaPluginState}
						intl={intl}
					/>
				);
			},
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
		},
		{ type: 'separator' },
		{
			type: 'copy-button',
			supportsViewMode: true,
			items: [
				{
					state,
					formatMessage: intl.formatMessage,
					nodeType: mediaInline,
				},
			],
		},
		{ type: 'separator' },
		{
			id: 'editor.media.delete',
			type: 'button',
			appearance: 'danger',
			focusEditoronEnter: true,
			icon: RemoveIcon,
			onMouseEnter: hoverDecoration?.(mediaInline, true),
			onMouseLeave: hoverDecoration?.(mediaInline, false),
			onFocus: hoverDecoration?.(mediaInline, true),
			onBlur: hoverDecoration?.(mediaInline, false),
			title: intl.formatMessage(commonMessages.remove),
			onClick: removeInlineCard,
			testId: 'media-toolbar-remove-button',
		},
	];

	return items;
};

const getMediaInlineImageToolbar = (
	state: EditorState,
	intl: IntlShape,
	mediaPluginState: MediaPluginState,
	hoverDecoration: HoverDecorationHandler | undefined,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	mediaLinkingState: MediaLinkingState,
	options: MediaFloatingToolbarOptions = {},
): FloatingToolbarItem<Command>[] => {
	const { mediaInline } = state.schema.nodes;
	const mediaInlineImageTitle = intl.formatMessage(
		mediaAndEmbedToolbarMessages.changeToMediaInlineImage,
	);
	const mediaSingleTitle = intl.formatMessage(mediaAndEmbedToolbarMessages.changeToMediaSingle);
	const widthPluginState = pluginInjectionApi?.width?.sharedState.currentState();
	const inlineImageItems: FloatingToolbarItem<Command>[] = [];
	const isNestingInQuoteSupported =
		pluginInjectionApi?.featureFlags?.sharedState.currentState()?.nestMediaAndCodeblockInQuote ||
		fg('editor_nest_media_and_codeblock_in_quotes_jira');

	if (shouldShowImageBorder(state)) {
		inlineImageItems.push({
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
		inlineImageItems.push({ type: 'separator' });
	}

	inlineImageItems.push(
		{
			id: 'editor.media.convert.mediainline',
			type: 'button',
			title: mediaInlineImageTitle,
			icon: () => <IconInline size="medium" label={mediaInlineImageTitle} />,
			onClick: () => {
				return true;
			},
			selected: true,
		},
		{
			id: 'editor.media.convert.mediasingle',
			type: 'button',
			title: mediaSingleTitle,
			icon: () => <IconEmbed size="medium" label={mediaSingleTitle} />,
			onClick: changeMediaInlineToMediaSingle(
				editorAnalyticsAPI,
				widthPluginState,
				isNestingInQuoteSupported,
			),
		},
		{ type: 'separator' },
	);

	inlineImageItems.push({
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
						isInlineNode
						isViewOnly={options.isViewOnly}
					/>
				);
			}
			return null;
		},
		supportsViewMode: true,
	});

	//Image Preview
	if (options.allowImagePreview) {
		inlineImageItems.push(
			fg('platform_editor_media_previewer_bugfix')
				? {
						id: 'editor.media.viewer',
						type: 'button',
						icon: FilePreviewIcon,
						title: intl.formatMessage(messages.preview),
						onClick: () => {
							return handleShowMediaViewer({ mediaPluginState, api: pluginInjectionApi }) ?? false;
						},
					}
				: generateFilePreviewItem(mediaPluginState, intl),
			{
				type: 'separator',
				supportsViewMode: true,
			},
		);
	}

	if (options.isViewOnly) {
		inlineImageItems.push(
			{
				id: 'editor.media.image.download',
				type: 'button',
				icon: DownloadIcon,
				onClick: () => {
					downloadMedia(mediaPluginState, options.isViewOnly);
					return true;
				},
				title: intl.formatMessage(messages.download),
				supportsViewMode: true,
			},
			{ type: 'separator', supportsViewMode: true },
		);
	}

	if (options.allowAltTextOnImages) {
		inlineImageItems.push(altTextButton(intl, state, pluginInjectionApi?.analytics?.actions), {
			type: 'separator',
		});
	}

	inlineImageItems.push({
		type: 'copy-button',
		supportsViewMode: true,
		items: [
			{
				state,
				formatMessage: intl.formatMessage,
				nodeType: mediaInline,
			},
		],
	});

	inlineImageItems.push({ type: 'separator' });
	inlineImageItems.push({
		id: 'editor.media.delete',
		type: 'button',
		appearance: 'danger',
		focusEditoronEnter: true,
		icon: RemoveIcon,
		onMouseEnter: hoverDecoration?.(mediaInline, true),
		onMouseLeave: hoverDecoration?.(mediaInline, false),
		onFocus: hoverDecoration?.(mediaInline, true),
		onBlur: hoverDecoration?.(mediaInline, false),
		title: intl.formatMessage(commonMessages.remove),
		onClick: removeInlineCard,
		testId: 'media-toolbar-remove-button',
	});

	return inlineImageItems;
};
