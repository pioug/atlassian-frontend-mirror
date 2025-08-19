import React from "react";

import { useIntl } from "react-intl-next";

import { useSharedPluginStateWithSelector } from "@atlaskit/editor-common/hooks";
import {
	getAriaKeyshortcuts,
	redo as redoKeymap,
	ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { undoRedoMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from "@atlaskit/editor-common/toolbar";
import type { ExtractInjectionAPI } from "@atlaskit/editor-common/types";
import { ToolbarButton, RedoIcon, ToolbarTooltip } from "@atlaskit/editor-toolbar";

import { redoFromToolbarWithAnalytics } from "../../pm-plugins/commands";
import { forceFocus } from "../../pm-plugins/utils";
import type { UndoRedoPlugin } from "../../undoRedoPluginType";

type RedoButtonProps = {
	api?: ExtractInjectionAPI<UndoRedoPlugin>
}

export const RedoButton = ({api}: RedoButtonProps) => {
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
		<ToolbarTooltip content={<ToolTipContent description={formatMessage(undoRedoMessages.redo)} keymap={redoKeymap}/>}>
			<ToolbarButton
				iconBefore={<RedoIcon label={formatMessage(undoRedoMessages.redo)} />}
				onClick={handleRedo}
				isDisabled={!canRedo}
				ariaKeyshortcuts={getAriaKeyshortcuts(redoKeymap)}
				testId="ak-editor-toolbar-button-redo"
			/>
		</ToolbarTooltip>

	)
}
