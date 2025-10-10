/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	getAriaKeyshortcuts,
	redo,
	redoAlt,
	tooltip,
	ToolTipContent,
	undo as undoKeymap,
} from '@atlaskit/editor-common/keymaps';
import { undoRedoMessages } from '@atlaskit/editor-common/messages';
import {
	buttonGroupStyle,
	buttonGroupStyleBeforeVisualRefresh,
	separatorStyles,
} from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import RedoIcon from '@atlaskit/icon/core/migration/redo';
import UndoIcon from '@atlaskit/icon/core/migration/undo';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	redoFromToolbarWithAnalytics,
	undoFromToolbarWithAnalytics,
} from '../../pm-plugins/commands';
import { forceFocus } from '../../pm-plugins/utils';
import type { UndoRedoPlugin } from '../../undoRedoPluginType';

export interface Props {
	api: ExtractInjectionAPI<UndoRedoPlugin> | undefined;
	disabled?: boolean;
	editorView: EditorView;
	isReducedSpacing?: boolean;
	redoDisabled?: boolean;
	undoDisabled?: boolean;
}

export const ToolbarUndoRedo = ({
	disabled,
	isReducedSpacing,
	editorView,
	api,
	intl: { formatMessage },
}: Props & WrappedComponentProps) => {
	const { canRedo, canUndo } = useSharedPluginStateWithSelector(api, ['history'], (states) => ({
		canUndo: states.historyState?.canUndo,
		canRedo: states.historyState?.canRedo,
	}));

	const handleUndo = () => {
		forceFocus(editorView, api)(undoFromToolbarWithAnalytics(api?.analytics?.actions));
	};

	const handleRedo = () => {
		forceFocus(editorView, api)(redoFromToolbarWithAnalytics(api?.analytics?.actions));
	};
	const labelUndo = formatMessage(undoRedoMessages.undo);
	const labelRedo = formatMessage(undoRedoMessages.redo);

	const redoKeymap = fg('platform_editor_cmd_y_mac_redo_shortcut') ? redoAlt : redo;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<span
			css={
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
				fg('platform-visual-refresh-icons')
					? // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
						buttonGroupStyle
					: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
						buttonGroupStyleBeforeVisualRefresh
			}
		>
			<ToolbarButton
				buttonId={TOOLBAR_BUTTON.UNDO}
				spacing={isReducedSpacing ? 'none' : 'default'}
				onClick={handleUndo}
				disabled={!canUndo || disabled}
				aria-label={tooltip(undoKeymap, labelUndo)}
				aria-keyshortcuts={getAriaKeyshortcuts(undoKeymap)}
				title={<ToolTipContent description={labelUndo} keymap={undoKeymap} />}
				iconBefore={<UndoIcon label="" color="currentColor" spacing="spacious" />}
				testId="ak-editor-toolbar-button-undo"
			/>
			<ToolbarButton
				spacing={isReducedSpacing ? 'none' : 'default'}
				buttonId={TOOLBAR_BUTTON.REDO}
				onClick={handleRedo}
				disabled={!canRedo || disabled}
				title={<ToolTipContent description={labelRedo} keymap={redoKeymap} />}
				iconBefore={<RedoIcon label="" color="currentColor" spacing="spacious" />}
				testId="ak-editor-toolbar-button-redo"
				aria-label={tooltip(redoKeymap, labelRedo)}
				aria-keyshortcuts={getAriaKeyshortcuts(redoKeymap)}
			/>
			{!api?.primaryToolbar && (
				/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<span css={separatorStyles} />
			)}
		</span>
	);
};

export default injectIntl(ToolbarUndoRedo);
