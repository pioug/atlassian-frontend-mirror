/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { clearFormatting as clearFormattingKeymap, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import type { Command, TextFormattingState } from '@atlaskit/editor-common/types';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import TableCellClearIcon from '@atlaskit/icon/core/table-cell-clear';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { clearFormattingWithAnalytics } from '../../../editor-commands/clear-formatting';
import { getInputMethod } from '../input-method-utils';
import type { IconHookProps, MenuIconItem, ToolbarType } from '../types';

interface ClearIconHookProps extends IconHookProps {
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	textFormattingState: TextFormattingState | undefined;
	toolbarType: ToolbarType;
}

export const useClearIcon = ({
	intl,
	textFormattingState,
	editorAnalyticsAPI,
	toolbarType,
}: ClearIconHookProps): MenuIconItem | null => {
	const isPluginAvailable = Boolean(textFormattingState);
	const formattingIsPresent = Boolean(textFormattingState?.formattingIsPresent);
	const clearFormattingLabel = intl.formatMessage(toolbarMessages.clearFormatting);

	const clearFormattingToolbar: Command = useCallback(
		(state, dispatch) =>
			clearFormattingWithAnalytics(getInputMethod(toolbarType), editorAnalyticsAPI)(
				state,
				dispatch,
			),
		[editorAnalyticsAPI, toolbarType],
	);

	return useMemo(() => {
		if (!isPluginAvailable) {
			return null;
		}

		return {
			key: 'clearFormatting',
			command: clearFormattingToolbar,
			content: clearFormattingLabel,
			elemBefore: editorExperiment('platform_editor_controls', 'variant1') ? (
				<TableCellClearIcon label="" />
			) : undefined,
			elemAfter: (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={shortcutStyle}>{tooltip(clearFormattingKeymap)}</div>
			),
			value: {
				name: 'clearFormatting',
			},
			isActive: false,
			isDisabled: !formattingIsPresent,
			'aria-label': clearFormattingKeymap
				? tooltip(clearFormattingKeymap, String(clearFormattingLabel))
				: String(clearFormattingLabel),
		};
	}, [isPluginAvailable, clearFormattingToolbar, clearFormattingLabel, formattingIsPresent]);
};
