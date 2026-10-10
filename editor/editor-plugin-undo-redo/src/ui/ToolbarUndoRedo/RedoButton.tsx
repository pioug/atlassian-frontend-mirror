import React from 'react';

import { useIntl } from 'react-intl';

import {
	getAriaKeyshortcuts,
	redo as redoKeymap,
	ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { messages as undoRedoMessages } from '@atlaskit/editor-common/messages/undo-redo';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { RedoIcon } from '@atlaskit/editor-toolbar/redo-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import { redoFromToolbarWithAnalytics } from '../../pm-plugins/commands';
import { forceFocus } from '../../pm-plugins/utils';
import type { UndoRedoPlugin } from '../../undoRedoPluginType';

type RedoButtonProps = {
	api?: ExtractInjectionAPI<UndoRedoPlugin>;
};

export const RedoButton = ({ api }: RedoButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();
	const { canRedo } = useSharedPluginStateWithSelector(api, ['history'], (states) => ({
		canRedo: states.historyState?.canRedo,
	}));

	const handleRedo = () => {
		if (editorView) {
			forceFocus(editorView, api)(redoFromToolbarWithAnalytics(api?.analytics?.actions));
		}
	};

	return (
		<ToolbarTooltip
			content={
				<ToolTipContent description={formatMessage(undoRedoMessages.redo)} keymap={redoKeymap} />
			}
		>
			<ToolbarButton
				iconBefore={<RedoIcon label={formatMessage(undoRedoMessages.redo)} size="small" />}
				onClick={handleRedo}
				isDisabled={!canRedo}
				ariaKeyshortcuts={getAriaKeyshortcuts(redoKeymap)}
				testId="ak-editor-toolbar-button-redo"
			/>
		</ToolbarTooltip>
	);
};
