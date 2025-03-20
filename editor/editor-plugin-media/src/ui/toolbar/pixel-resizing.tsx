import React from 'react';

import { FloatingToolbarConfig } from '@atlaskit/editor-common/types';

import { Props, PixelEntry } from '../../pm-plugins/pixel-resizing/ui';
import { PIXEL_RESIZING_TOOLBAR_WIDTH } from '../../pm-plugins/pixel-resizing/ui/constants';
import { MediaToolbarBaseConfig } from '../../types';

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
