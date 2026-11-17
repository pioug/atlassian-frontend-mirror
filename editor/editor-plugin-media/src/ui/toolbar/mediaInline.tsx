import React from 'react';

import type { IntlShape } from 'react-intl';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { messages as cardMessages } from '@atlaskit/editor-common/messages/card';
import type { Command } from '@atlaskit/editor-common/types/command';
import type {
	DropdownOptionT,
	FloatingToolbarButton,
	FloatingToolbarDropdown,
	FloatingToolbarItem,
} from '@atlaskit/editor-common/types/floating-toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations/main';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import DownloadIcon from '@atlaskit/icon/core/download';
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import ImageInlineIcon from '@atlaskit/icon/core/image-inline';
import SmartLinkCardIcon from '@atlaskit/icon/core/smart-link-card';
import { messages } from '@atlaskit/media-ui/messages';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import { getMediaLinkingState } from '../../pm-plugins/linking';
import type { MediaLinkingState } from '../../pm-plugins/linking/types';
import type { MediaPluginState } from '../../pm-plugins/types';
import { currentMediaOrInlineNodeBorderMark } from '../../pm-plugins/utils/current-media-node';
import { isImage } from '../../pm-plugins/utils/is-type';
import type { MediaFloatingToolbarOptions } from '../../types';
import ImageBorderItem from '../../ui/ImageBorder';
import { changeInlineToMediaCard, setBorderMark, toggleBorderMark } from './commands';
import { shouldShowImageBorder } from './imageBorder';
import { handleShowMediaViewer } from './index';
import { getOpenLinkToolbarButtonOption, shouldShowMediaLinkToolbar } from './linking';
import {
	downloadMedia,
	getIsDownloadDisabledByDataSecurityPolicy,
	getMediaSingleAndMediaInlineSwitcherDropdown,
} from './utils';

export const generateMediaInlineFloatingToolbar = (
	state: EditorState,
	intl: IntlShape,
	mediaPluginState: MediaPluginState,
	hoverDecoration: HoverDecorationHandler | undefined,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	options: MediaFloatingToolbarOptions = {},
): FloatingToolbarItem<Command>[] => {
	const editorAnalyticsAPI = pluginInjectionApi?.analytics?.actions as EditorAnalyticsAPI;
	const forceFocusSelector = pluginInjectionApi?.floatingToolbar?.actions?.forceFocusSelector;

	const mediaType = state.selection instanceof NodeSelection && state.selection.node.attrs.type;
	const mediaLinkingState: MediaLinkingState = getMediaLinkingState(state);

	if (mediaPluginState.allowInlineImages && isImage(mediaType)) {
		return getMediaInlineImageToolbar(
			state,
			intl,
			mediaPluginState,
			pluginInjectionApi,
			mediaLinkingState,
			options,
		);
	}

	const items: FloatingToolbarItem<Command>[] = [];

	const mauiToolbarSeparatorsUpdateEnabled = fg('cc-maui-toolbar-separators-update-jira');

	const preview: FloatingToolbarButton<Command> = {
		id: 'editor.media.viewer',
		testId: 'file-preview-toolbar-button',
		type: 'button',
		icon: GrowDiagonalIcon,
		title: intl.formatMessage(messages.expand),
		onClick: () => {
			return handleShowMediaViewer({ mediaPluginState, api: pluginInjectionApi }) ?? false;
		},
		supportsViewMode: true,
	};

	const disableDownloadButton = getIsDownloadDisabledByDataSecurityPolicy(mediaPluginState);

	const download: FloatingToolbarButton<Command> = {
		id: 'editor.media.card.download',
		type: 'button',
		icon: DownloadIcon,
		onClick: () => {
			downloadMedia(mediaPluginState);
			return true;
		},
		disabled: disableDownloadButton,
		title: intl.formatMessage(messages.download),
		supportsViewMode: true,
	};

	const switcherOptions: DropdownOptionT<Command>[] = [
		{
			id: 'editor.media.view.switcher.inline',
			title: intl.formatMessage(cardMessages.inlineTitle),
			onClick: () => true,
			selected: true,
			icon: <ImageInlineIcon label="" spacing="spacious" />,
		},
		{
			id: 'editor.media.view.switcher.thumbnail',
			title: intl.formatMessage(cardMessages.blockTitle),
			onClick: changeInlineToMediaCard(editorAnalyticsAPI, forceFocusSelector),
			icon: <SmartLinkCardIcon label="" spacing="spacious" />,
		},
	];
	const switcherDropdown: FloatingToolbarDropdown<Command> = {
		title: intl.formatMessage(messages.fileDisplayOptions),
		id: 'media-group-inline-switcher-toolbar-item',
		testId: 'media-group-inline-switcher-dropdown',
		type: 'dropdown',
		options: switcherOptions,
		icon: () => <ImageInlineIcon label="" spacing="spacious" />,
	};

	items.push(
		switcherDropdown,
		...(mauiToolbarSeparatorsUpdateEnabled
			? []
			: [{ type: 'separator', fullHeight: true } as const]),
		download,
		...(mauiToolbarSeparatorsUpdateEnabled
			? []
			: [{ type: 'separator', supportsViewMode: true } as const]),
		preview,
		...(mauiToolbarSeparatorsUpdateEnabled
			? []
			: [{ type: 'separator', fullHeight: true } as const]),
	);

	return items;
};

const getMediaInlineImageToolbar = (
	state: EditorState,
	intl: IntlShape,
	mediaPluginState: MediaPluginState,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	mediaLinkingState: MediaLinkingState,
	options: MediaFloatingToolbarOptions = {},
): FloatingToolbarItem<Command>[] => {
	const { mediaInline } = state.schema.nodes;
	const inlineImageItems: FloatingToolbarItem<Command>[] = [];
	const { isViewOnly, allowLinking, allowImagePreview } = options;

	const mauiToolbarSeparatorsUpdateEnabled = fg('cc-maui-toolbar-separators-update-jira');

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
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						toggleBorder={() => {
							toggleBorderMark(pluginInjectionApi?.analytics?.actions)(state, dispatch);
						}}
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						setBorder={(attrs) => {
							setBorderMark(pluginInjectionApi?.analytics?.actions)(attrs)(state, dispatch);
						}}
						borderMark={borderMark}
						intl={intl}
					/>
				);
			},
		});
	}

	const download: FloatingToolbarButton<Command> = {
		id: 'editor.media.image.download',
		type: 'button',
		icon: DownloadIcon,
		onClick: () => {
			downloadMedia(mediaPluginState, options.isViewOnly);
			return true;
		},
		title: intl.formatMessage(messages.download),
		supportsViewMode: true,
	};

	const switchFromInlineToBlock = getMediaSingleAndMediaInlineSwitcherDropdown(
		'inline',
		intl,
		pluginInjectionApi,
	);

	inlineImageItems.push(
		switchFromInlineToBlock,
		...(mauiToolbarSeparatorsUpdateEnabled
			? []
			: [{ type: 'separator', fullHeight: true } as const]),
	);

	if (isViewOnly) {
		inlineImageItems.push(
			download,
			...(mauiToolbarSeparatorsUpdateEnabled
				? []
				: [{ type: 'separator', supportsViewMode: true } as const]),
		);
	}

	//Image Preview
	if (allowImagePreview) {
		inlineImageItems.push(
			{
				id: 'editor.media.viewer',
				testId: 'file-preview-toolbar-button',
				type: 'button',
				icon: GrowDiagonalIcon,
				title: intl.formatMessage(messages.expand),
				onClick: () => {
					return handleShowMediaViewer({ mediaPluginState, api: pluginInjectionApi }) ?? false;
				},
				supportsViewMode: true,
			},
			...(mauiToolbarSeparatorsUpdateEnabled
				? []
				: [{ type: 'separator', supportsViewMode: true } as const]),
		);
	}

	// open link
	if (
		allowLinking &&
		shouldShowMediaLinkToolbar(state) &&
		mediaLinkingState &&
		mediaLinkingState.editable
	) {
		inlineImageItems.push(
			getOpenLinkToolbarButtonOption(intl, mediaLinkingState, pluginInjectionApi),
			...(mauiToolbarSeparatorsUpdateEnabled
				? []
				: [{ type: 'separator', supportsViewMode: true } as const]),
		);
	}

	if (isViewOnly) {
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
	}

	return inlineImageItems;
};
