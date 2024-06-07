import React from 'react';

import { di } from 'react-magnetic-di';

import { useEditorViewHasInfos } from '../../hooks/use-editor-view-has-infos';
import { useEditorViewHasWarnings } from '../../hooks/use-editor-view-has-warnings';
import { useEditorViewIsInvalid } from '../../hooks/use-editor-view-is-invalid';

import { JQLEditorHelp } from './jql-editor-help';
import { ErrorMessages, InfoMessages, WarningMessages } from './jql-messages';

/**
 * Message components are rendered by priority.
 * Message component decides on its own what exactly to render (GQL vs external messages).
 */

export const JQLEditorFooterContent = () => {
	di(
		useEditorViewIsInvalid,
		useEditorViewHasWarnings,
		useEditorViewHasInfos,
		ErrorMessages,
		WarningMessages,
		InfoMessages,
		JQLEditorHelp,
	);

	const editorViewIsInvalid = useEditorViewIsInvalid();
	const editorViewHasWarnings = useEditorViewHasWarnings();
	const editorViewHasInfos = useEditorViewHasInfos();

	if (editorViewIsInvalid) {
		return <ErrorMessages />;
	}

	if (editorViewHasWarnings) {
		return <WarningMessages />;
	}

	if (editorViewHasInfos) {
		return <InfoMessages />;
	}

	return <JQLEditorHelp />;
};
