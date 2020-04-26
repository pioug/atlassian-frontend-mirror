import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { ErrorMessage, HelperMessage } from '@atlaskit/form';

import { ValidationError, FieldTypeError } from './types';
import { messages } from './messages';

function createMarkup(content: string) {
  return { __html: content };
}

const FieldMessages = function({
  error,
  description,
  intl,
}: { error?: string; description?: string } & InjectedIntlProps) {
  if (!error && description) {
    return (
      <HelperMessage>
        <div dangerouslySetInnerHTML={createMarkup(description)} />
      </HelperMessage>
    );
  }

  switch (error) {
    case ValidationError.Required:
      return (
        <ErrorMessage>{intl.formatMessage(messages.required)}</ErrorMessage>
      );

    case FieldTypeError.isMultipleAndRadio:
      return (
        <ErrorMessage>
          {intl.formatMessage(messages.isMultipleAndRadio)}
        </ErrorMessage>
      );

    default:
      return null;
  }
};

export default injectIntl(FieldMessages);
