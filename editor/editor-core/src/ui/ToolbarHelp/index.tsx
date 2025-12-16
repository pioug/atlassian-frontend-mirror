import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { type HelpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import type { EditorState, PluginKey, Transaction } from '@atlaskit/editor-prosemirror/state';
import QuestionIcon from '@atlaskit/icon/core/question-circle';
import type { PositionType } from '@atlaskit/tooltip/types';

import { useEditorContext } from '../EditorContext';

import { messages } from './messages';

interface Props {
	// In future, this will be required once the fake plugin key is removed
	editorApi?: ExtractInjectionAPI<HelpDialogPlugin> | undefined;
	title?: string;
	titlePosition?: PositionType;
}

// Please, do not copy or use this kind of code below
// This is just a temporary solution to keep the tooltip trigger working for Trello since it's not using the composable editor
// @ts-ignore
const fakePluginKey = {
	key: 'helpDialog$',
	getState: (state: EditorState) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (state as any)['helpDialog$'];
	},
} as PluginKey;

const openHelpCommand = (tr: Transaction, dispatch?: Function): boolean => {
	tr = tr.setMeta(fakePluginKey, true);
	if (dispatch) {
		dispatch(tr);
		return true;
	}
	return false;
};

const TooltipHelpTrigger = ({
	title = 'Open help dialog',
	titlePosition = 'left',
	intl,
	editorApi,
}: Props & WrappedComponentProps) => {
	const editorContext = useEditorContext();

	// to have translation for the default tooltip helper
	let displayTitle = title;
	if (title === 'Open help dialog') {
		displayTitle = intl.formatMessage(messages.toolbarHelpTitle);
	}

	const showHelp = () => {
		if (editorApi) {
			editorApi?.helpDialog?.actions.openHelp();
		} else {
			const editorView = editorContext?.editorActions?._privateGetEditorView();
			if (editorView) {
				openHelpCommand(editorView.state.tr, editorView.dispatch);
			}
		}
	};

	return (
		<ToolbarButton
			onClick={showHelp}
			title={displayTitle}
			titlePosition={titlePosition}
			iconBefore={<QuestionIcon label={displayTitle} />}
		/>
	);
};

export default injectIntl(TooltipHelpTrigger);
