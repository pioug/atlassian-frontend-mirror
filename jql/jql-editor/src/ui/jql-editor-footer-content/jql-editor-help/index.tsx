import React from 'react';

import { HelperMessage } from '@atlaskit/form';
import { Text } from '@atlaskit/primitives/compiled';

import { JQL_EDITOR_HELP_CONTENT_ID } from '../../../common/constants';
import { useEditorThemeContext } from '../../../hooks/use-editor-theme';
import { useEditorViewHasFocus, useIntl, useScopedId } from '../../../state';

import { messages } from './messages';
import { HelpContainer } from './styled';

export const JQLEditorHelp = () => {
	const [{ formatMessage }] = useIntl();
	const [editorViewHasFocus] = useEditorViewHasFocus();
	const { isSearch } = useEditorThemeContext();
	const [helpContentId] = useScopedId(JQL_EDITOR_HELP_CONTENT_ID);
	const SearchMessage = (
		<Text size="UNSAFE_small" color="inherit">
			{formatMessage(messages.searchCommand, {
				b: (text: React.ReactNode[]) => <b>{text}</b>,
			})}
		</Text>
	);
	const NewLineMessage = (
		<Text size="UNSAFE_small" color="inherit">
			{formatMessage(isSearch ? messages.newLineCommand : messages.fieldNewLineCommand, {
				b: (text: React.ReactNode[]) => <b>{text}</b>,
			})}
		</Text>
	);

	return (
		<HelpContainer id={helpContentId} isVisible={editorViewHasFocus}>
			{isSearch && <HelperMessage>{SearchMessage}</HelperMessage>}
			<HelperMessage>{NewLineMessage}</HelperMessage>
		</HelpContainer>
	);
};
