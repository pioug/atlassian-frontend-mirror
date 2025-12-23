import React from 'react';

import memoizeOne from 'memoize-one';
import type { IntlShape } from 'react-intl-next';

import type { ExternalMediaAttributes, MediaADFAttrs, RichMediaLayout } from '@atlaskit/adf-schema';
import type { LayoutIcon } from '@atlaskit/editor-common/card';
import { wrappedLayouts } from '@atlaskit/editor-common/media-single';
import { mediaAndEmbedToolbarMessages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	FloatingToolbarItem,
	FloatingToolbarDropdown,
	DropdownOptionT,
	ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { nonWrappedLayouts } from '@atlaskit/editor-common/utils';
import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findSelectedNodeOfType,
	removeParentNodeOfType,
	removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFullWidthLayoutWidth } from '@atlaskit/editor-shared-styles';
import ImageInlineIcon from '@atlaskit/icon/core/image-inline';
import MaximizeIcon from '@atlaskit/icon/core/maximize';
import { getMediaClient } from '@atlaskit/media-client-react';
import { messages } from '@atlaskit/media-ui';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import type { MediaPluginState } from '../../pm-plugins/types';
import { isVideo } from '../../pm-plugins/utils/media-single';

import { changeMediaInlineToMediaSingle, changeMediaSingleToMediaInline } from './commands';

export const isExternalMedia = (attrs: MediaADFAttrs): attrs is ExternalMediaAttributes => {
	return attrs.type === 'external';
};

const getSelectedMediaContainerNodeAttrs = (
	mediaPluginState: MediaPluginState,
): MediaADFAttrs | null => {
	const selectedNode = mediaPluginState.selectedMediaContainerNode?.();
	if (selectedNode && selectedNode.attrs) {
		return selectedNode.attrs as MediaADFAttrs;
	}
	return null;
};

export const getSelectedNearestMediaContainerNodeAttrsFunction = (
	selectedMediaContainerNode: () => ProseMirrorNode | undefined,
) => {
	const selectedNode = selectedMediaContainerNode?.();
	if (selectedNode) {
		switch (selectedNode.type.name) {
			case 'mediaSingle': {
				const childNode = selectedNode.firstChild;
				return childNode?.attrs as MediaADFAttrs;
			}

			default:
				return selectedNode.attrs as MediaADFAttrs;
		}
	}
	return null;
};

export const getSelectedNearestMediaContainerNodeAttrs = (
	mediaPluginState: MediaPluginState,
): MediaADFAttrs | null => {
	return getSelectedNearestMediaContainerNodeAttrsFunction(
		mediaPluginState.selectedMediaContainerNode,
	);
};

export const getIsDownloadDisabledByDataSecurityPolicy = (
	mediaPluginState: MediaPluginState,
): boolean => {
	const enforceMediaDataSecurityPolicy =
		mediaPluginState?.mediaClientConfig?.enforceDataSecurityPolicy;
	return typeof enforceMediaDataSecurityPolicy === 'boolean'
		? enforceMediaDataSecurityPolicy
		: false;
};

export const downloadMedia = async (
	mediaPluginState: MediaPluginState,
	isViewMode?: boolean,
): Promise<boolean> => {
	try {
		const selectedNodeAttrs = isViewMode
			? getSelectedNearestMediaContainerNodeAttrs(mediaPluginState)
			: getSelectedMediaContainerNodeAttrs(mediaPluginState);
		if (
			selectedNodeAttrs &&
			mediaPluginState.mediaClientConfig &&
			!isExternalMedia(selectedNodeAttrs)
		) {
			const { id, collection = '' } = selectedNodeAttrs;
			const mediaClient = getMediaClient(mediaPluginState.mediaClientConfig);
			const fileState = await mediaClient.file.getCurrentState(id, {
				collectionName: collection,
			});
			const fileName = fileState.status === 'error' ? undefined : fileState.name;
			mediaClient.file.downloadBinary(id, fileName, collection);
		}
		return true;
	} catch (err) {
		return false;
	}
};

export const removeMediaGroupNode = (state: EditorState) => {
	const { mediaGroup } = state.schema.nodes;
	const mediaGroupParent = findParentNodeOfType(mediaGroup)(state.selection);

	let tr = state.tr;
	// If it is the last media group in filmstrip, remove the entire filmstrip
	if (mediaGroupParent && mediaGroupParent.node.childCount === 1) {
		tr = removeParentNodeOfType(mediaGroup)(tr);
	} else {
		tr = removeSelectedNode(tr);
	}
	return tr;
};

export const getSelectedMediaSingle = (
	state: EditorState,
):
	| ReturnType<ReturnType<typeof findSelectedNodeOfType>>
	| ReturnType<ReturnType<typeof findParentNodeOfType>> => {
	const { mediaSingle } = state.schema.nodes;

	return (
		findSelectedNodeOfType(mediaSingle)(state.selection) ||
		findParentNodeOfType(mediaSingle)(state.selection)
	);
};

export const getPixelWidthOfElement = memoizeOne(
	(editorView: EditorView, pos: number, mediaWidth: number) => {
		const domNode = editorView.nodeDOM(pos);
		if (domNode instanceof HTMLElement) {
			return domNode.offsetWidth;
		}
		return mediaWidth;
	},
);

export const calcNewLayout = (
	width: number,
	layout: RichMediaLayout,
	contentWidth: number,
	fullWidthMode = false,
	isNested = false,
) => {
	const isWrappedLayout = wrappedLayouts.indexOf(layout) > -1;

	//See flowchart for layout logic: https://hello.atlassian.net/wiki/spaces/TWPCP/whiteboard/2969594044
	if (width >= akEditorFullWidthLayoutWidth) {
		// If width is greater than or equal to full editor width
		return 'full-width';
	}

	if (fullWidthMode) {
		// If under editor full width mode
		return isWrappedLayout ? layout : 'center';
	}

	if (width > contentWidth && !isNested) {
		// If width is greater than content length and not nested
		return 'wide';
	}
	return isNested || (isWrappedLayout && width !== contentWidth) ? layout : 'center';
};

let maxToolbarFitWidth = 0;

export const getMaxToolbarWidth = () => {
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const toolbar = document.querySelector(
		`div[aria-label="Media floating controls"]`,
	) as HTMLElement;
	const toolbarWidth = toolbar?.getBoundingClientRect().width;
	if (!toolbar) {
		maxToolbarFitWidth = 0;
	}
	if (toolbarWidth && toolbarWidth > maxToolbarFitWidth) {
		maxToolbarFitWidth = toolbarWidth;
	}
	return maxToolbarFitWidth;
};

export const getSelectedLayoutIcon = (layoutIcons: LayoutIcon[], selectedNode: ProseMirrorNode) => {
	const selectedLayout = selectedNode.attrs.layout;
	return layoutIcons.find(
		(icon) =>
			icon.value === (nonWrappedLayouts.includes(selectedLayout) ? 'center' : selectedLayout),
	);
};

/**
 * Check if 'original size' and 'inline' buttons can be shown in the toolbar for a given mediaSingle node.
 * @param mediaSingleNode node to be checked
 */
export const canShowSwitchButtons = (mediaSingleNode?: ProseMirrorNode) => {
	if (mediaSingleNode) {
		const mediaNode = mediaSingleNode.content.firstChild;
		return mediaNode && !isVideo(mediaNode.attrs.__fileMimeType);
	}
	return false;
};

export const updateToFullHeightSeparator = (items: FloatingToolbarItem<Command>[]): void => {
	const lastItem = items.at(-1);
	if (lastItem?.type === 'separator') {
		lastItem.fullHeight = true;
	} else if (items.length) {
		items.push({ type: 'separator', fullHeight: true });
	}
};

export const getMediaSingleAndMediaInlineSwitcherDropdown = (
	nodeType: 'inline' | 'block',
	intl: IntlShape,
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	hasCaption: boolean = false,
): FloatingToolbarDropdown<Command> => {
	const mediaInlineImageTitle = intl.formatMessage(
		mediaAndEmbedToolbarMessages.changeToMediaInlineImage,
	);
	const mediaSingleTitle = intl.formatMessage(mediaAndEmbedToolbarMessages.changeToMediaSingle);
	const inlineSwitcherTitle = intl.formatMessage(
		hasCaption
			? mediaAndEmbedToolbarMessages.changeToMediaInlineImageCaptionWarning
			: mediaAndEmbedToolbarMessages.changeToMediaInlineImage,
	);

	const InlineIcon = () => <ImageInlineIcon color="currentColor" spacing="spacious" label="" />;
	const BlockIcon = () => <MaximizeIcon color="currentColor" spacing="spacious" label="" />;

	const dropdownConfig = {
		inline: {
			handleInlineButtonClick: () => {
				return true;
			},
			handleBlockButtonClick: changeMediaInlineToMediaSingle(
				pluginInjectionApi?.analytics?.actions,
				pluginInjectionApi?.width.sharedState.currentState(),
			),
			id: 'media-inline-to-block-toolbar-item',
			icon: InlineIcon,
		},
		block: {
			handleInlineButtonClick: changeMediaSingleToMediaInline(
				pluginInjectionApi?.analytics?.actions,
			),
			handleBlockButtonClick: () => {
				return true;
			},
			id: 'media-block-to-inline-toolbar-item',
			icon: BlockIcon,
		},
	};

	const options: DropdownOptionT<Command>[] = [
		{
			id: 'editor.media.convert.mediainline',
			title: mediaInlineImageTitle,
			onClick: dropdownConfig[nodeType].handleInlineButtonClick,
			selected: nodeType === 'inline',
			icon: <InlineIcon />,
			tooltip: hasCaption ? inlineSwitcherTitle : undefined,
		},
		{
			id: 'editor.media.convert.mediasingle',
			title: mediaSingleTitle,
			onClick: dropdownConfig[nodeType].handleBlockButtonClick,
			selected: nodeType === 'block',
			icon: <BlockIcon />,
		},
	];

	return {
		id: dropdownConfig[nodeType].id,
		testId: 'media-inline-to-block-dropdown',
		title: intl.formatMessage(messages.sizeOptions),
		type: 'dropdown',
		options,
		icon: dropdownConfig[nodeType].icon,
	};
};
