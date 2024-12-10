/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
	getAriaKeyshortcuts,
	redo as redoKeymap,
	tooltip,
	ToolTipContent,
	undo as undoKeymap,
} from '@atlaskit/editor-common/keymaps';
import { undoRedoMessages } from '@atlaskit/editor-common/messages';
import { buttonGroupStyle, separatorStyles } from '@atlaskit/editor-common/styles';
import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import RedoIcon from '@atlaskit/icon/core/migration/redo';
import UndoIcon from '@atlaskit/icon/core/migration/undo';

import { redoFromToolbar, undoFromToolbar } from '../../pm-plugins/commands';
import type { UndoRedoPlugin } from '../../undoRedoPluginType';

export interface Props {
	undoDisabled?: boolean;
	redoDisabled?: boolean;
	disabled?: boolean;
	isReducedSpacing?: boolean;
	editorView: EditorView;
	api: ExtractInjectionAPI<UndoRedoPlugin> | undefined;
}

const closeTypeAheadAndRunCommand =
	(editorView: EditorView, api: ExtractInjectionAPI<UndoRedoPlugin> | undefined) =>
	(command: Command) => {
		if (!editorView) {
			return;
		}
		if (api?.typeAhead?.actions?.isOpen(editorView.state)) {
			api?.typeAhead?.actions?.close({
				attachCommand: command,
				insertCurrentQueryAsRawText: false,
			});
		} else {
			command(editorView.state, editorView.dispatch);
		}
	};
const forceFocus =
	(editorView: EditorView, api: ExtractInjectionAPI<UndoRedoPlugin> | undefined) =>
	(command: Command) => {
		closeTypeAheadAndRunCommand(editorView, api)(command);

		if (!editorView.hasFocus()) {
			editorView.focus();
		}
	};

export const ToolbarUndoRedo = ({
	disabled,
	isReducedSpacing,
	editorView,
	api,
	intl: { formatMessage },
}: Props & WrappedComponentProps) => {
	const { historyState } = useSharedPluginState(api, ['history']);

	const handleUndo = () => {
		forceFocus(editorView, api)(undoFromToolbar);
	};

	const handleRedo = () => {
		forceFocus(editorView, api)(redoFromToolbar);
	};
	const labelUndo = formatMessage(undoRedoMessages.undo);
	const labelRedo = formatMessage(undoRedoMessages.redo);

	const { canUndo, canRedo } = historyState ?? {};

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<span css={buttonGroupStyle}>
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
