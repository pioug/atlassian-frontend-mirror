import React, { useMemo } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { ErrorMessage, HelperMessage } from '@atlaskit/form';
import { ValidationError, FieldTypeError } from './types';
import { messages } from './messages';
import DOMPurify from 'dompurify';

type HTMLElementTagNameList = (keyof HTMLElementTagNameMap)[];

function Description({
  description,
  tags,
}: {
  description: string;
  tags: HTMLElementTagNameList;
}) {
  const cleanedHtml = useMemo(
    () => ({
      __html: DOMPurify.sanitize(description, {
        ALLOWED_ATTR: [],
        ALLOWED_TAGS: tags,
      }),
    }),
    [description, tags],
  );

  return (
    <HelperMessage>
      <div dangerouslySetInnerHTML={cleanedHtml} />
    </HelperMessage>
  );
}

const FieldMessages = function ({
  error,
  description,
  intl,
}: { error?: string; description?: string } & InjectedIntlProps) {
  if (!error && description) {
    return (
      <Description
        description={description}
        tags={['b', 'i', 'strong', 'em', 'code']}
      />
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
