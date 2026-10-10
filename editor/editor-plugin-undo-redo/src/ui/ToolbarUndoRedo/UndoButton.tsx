import React from 'react';

import { useIntl } from 'react-intl';

import {
	getAriaKeyshortcuts,
	ToolTipContent,
	undo as undoKeymap,
} from '@atlaskit/editor-common/keymaps';
import { messages as undoRedoMessages } from '@atlaskit/editor-common/messages/undo-redo';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';
import { UndoIcon } from '@atlaskit/editor-toolbar/undo-icon';

import { undoFromToolbarWithAnalytics } from '../../pm-plugins/commands';
import { forceFocus } from '../../pm-plugins/utils';
import type { UndoRedoPlugin } from '../../undoRedoPluginType';

type UndoButtonProps = {
	api?: ExtractInjectionAPI<UndoRedoPlugin>;
};

export const UndoButton = ({ api }: UndoButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();

	const { canUndo } = useSharedPluginStateWithSelector(api, ['history'], (states) => ({
		canUndo: states.historyState?.canUndo,
	}));

	const handleUndo = () => {
		if (editorView) {
			forceFocus(editorView, api)(undoFromToolbarWithAnalytics(api?.analytics?.actions));
		}
	};

	return (
		<ToolbarTooltip
			content={
				<ToolTipContent description={formatMessage(undoRedoMessages.undo)} keymap={undoKeymap} />
			}
		>
			<ToolbarButton
				iconBefore={<UndoIcon label={formatMessage(undoRedoMessages.undo)} size="small" />}
				onClick={handleUndo}
				isDisabled={!canUndo}
				ariaKeyshortcuts={getAriaKeyshortcuts(undoKeymap)}
				testId="ak-editor-toolbar-button-undo"
			/>
		</ToolbarTooltip>
	);
};
