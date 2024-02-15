import React, { ReactNode, useEffect } from 'react';

import { di } from 'react-magnetic-di';

import { ErrorMessage } from '@atlaskit/form';
import { JQLSyntaxError } from '@atlaskit/jql-ast';

import { JQL_EDITOR_INPUT_ID } from '../../../../common/constants';
import { commonMessages } from '../../../../common/messages';
import { useEditorViewIsInvalid } from '../../../../hooks/use-editor-view-is-invalid';
import {
  useExternalMessages,
  useIntl,
  useJqlError,
  useScopedId,
  useStoreActions,
} from '../../../../state';
import { FormatMessages, MessageContainer } from '../format';

import { messages } from './messages';

const useFormattedErrorMessage = (): ReactNode => {
  di(
    useIntl,
    useJqlError,
    useStoreActions,
    useExternalMessages,
    useEditorViewIsInvalid,
  );

  const [{ formatMessage }] = useIntl();
  const [jqlError] = useJqlError();
  const [{ errors: externalErrors }] = useExternalMessages();
  const [, { externalErrorMessageViewed }] = useStoreActions();
  const editorViewIsInvalid = useEditorViewIsInvalid();

  useEffect(() => {
    // Emit a UI event whenever external errors has changed
    externalErrorMessageViewed();
  }, [externalErrorMessageViewed, externalErrors]);

  if (!editorViewIsInvalid) {
    return null;
  }

  // Prioritise client over external errors
  if (jqlError instanceof JQLSyntaxError) {
    return `${jqlError.message} ${formatMessage(messages.jqlErrorPosition, {
      lineNumber: jqlError.line,
      charPosition: jqlError.charPositionInLine + 1,
    })}`;
  } else if (externalErrors.length > 0) {
    return <FormatMessages messages={externalErrors} />;
  } else if (jqlError !== null) {
    return formatMessage(commonMessages.unknownError);
  }

  return null;
};

export const ErrorMessages = () => {
  di(useScopedId, useFormattedErrorMessage);

  const [editorId] = useScopedId(JQL_EDITOR_INPUT_ID);
  const errorMessage = useFormattedErrorMessage();

  return errorMessage != null ? (
    <MessageContainer>
      <ErrorMessage testId="jql-editor-validation">
        <span role="alert" aria-describedby={editorId}>
          {errorMessage}
        </span>
      </ErrorMessage>
    </MessageContainer>
  ) : null;
};
