import React from 'react';

import { IntlShape } from 'react-intl-next';

import { pixelEntryMessages as messages } from '@atlaskit/editor-common/media';
import {
	FloatingToolbarConfig,
	FloatingToolbarOverflowDropdownOptions,
	Command,
} from '@atlaskit/editor-common/types';
import { NodeType } from '@atlaskit/editor-prosemirror/model';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import GrowHorizontalIcon from '@atlaskit/icon/core/grow-horizontal';
import ImageFullscreenIcon from '@atlaskit/icon/core/image-fullscreen';
import { fg } from '@atlaskit/platform-feature-flags';

import { openPixelEditor } from '../../pm-plugins/pixel-resizing/commands';
import { Props, PixelEntry } from '../../pm-plugins/pixel-resizing/ui';
import { PIXEL_RESIZING_TOOLBAR_WIDTH } from '../../pm-plugins/pixel-resizing/ui/constants';
import { MediaOptions, MediaToolbarBaseConfig } from '../../types';

import { getSelectedMediaSingle } from './utils';

export const getPixelResizingToolbar = (
	toolbarBaseConfig: MediaToolbarBaseConfig,
	{
		pluginInjectionApi,
		intl,
		pluginState,
		hoverDecoration,
		isEditorFullWidthEnabled,
	}: Omit<Props, 'editorView' | 'selectedMediaSingleNode'>,
): FloatingToolbarConfig => ({
	...toolbarBaseConfig,
	width: PIXEL_RESIZING_TOOLBAR_WIDTH,
	scrollable: true,
	items: [
		{
			type: 'custom',
			fallback: [],
			render: (editorView) => {
				if (!editorView) {
					return null;
				}
				const selectedMediaSingleNode = getSelectedMediaSingle(editorView.state);
				if (!editorView || !selectedMediaSingleNode) {
					return null;
				}
				return (
					<PixelEntry
						editorView={editorView}
						intl={intl}
						selectedMediaSingleNode={selectedMediaSingleNode}
						pluginInjectionApi={pluginInjectionApi}
						pluginState={pluginState}
						hoverDecoration={hoverDecoration}
						isEditorFullWidthEnabled={isEditorFullWidthEnabled}
					/>
				);
			},
		},
	],
});

export const getResizeDropdownOption = (
	mediaOptions: MediaOptions,
	state: EditorState,
	formatMessage: IntlShape['formatMessage'],
	selectedNodeType?: NodeType,
): FloatingToolbarOverflowDropdownOptions<Command> => {
	if (selectedNodeType?.name !== 'mediaSingle') {
		return [];
	}

	const { allowResizing, allowResizingInTables, allowAdvancedToolBarOptions, allowPixelResizing } =
		mediaOptions;

	const isWithinTable = hasParentNodeOfType(state.schema.nodes.table)(state.selection);
	if (
		allowAdvancedToolBarOptions &&
		allowResizing &&
		(!isWithinTable || allowResizingInTables === true) &&
		allowPixelResizing
	) {
		return [
			{
				title: formatMessage(messages.resizeOption),
				onClick: openPixelEditor(),
				icon: fg('platform_editor_controls_patch_7') ? (
					<ImageFullscreenIcon label="" />
				) : (
					<GrowHorizontalIcon label="" />
				),
				testId: 'media-pixel-resizing-dropdown-option',
			},
		];
	}

	return [];
};
