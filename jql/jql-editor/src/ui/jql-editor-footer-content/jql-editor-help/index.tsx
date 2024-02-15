import React from 'react';

import { HelperMessage } from '@atlaskit/form';

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
    <span>
      {formatMessage(messages.searchCommand, {
        b: (text: string) => <b>{text}</b>,
      })}
    </span>
  );
  const NewLineMessage = (
    <span>
      {formatMessage(
        isSearch ? messages.newLineCommand : messages.fieldNewLineCommand,
        {
          b: (text: string) => <b>{text}</b>,
        },
      )}
    </span>
  );

  return (
    <HelpContainer id={helpContentId} isVisible={editorViewHasFocus}>
      {isSearch && <HelperMessage>{SearchMessage}</HelperMessage>}
      <HelperMessage>{NewLineMessage}</HelperMessage>
    </HelpContainer>
  );
};
