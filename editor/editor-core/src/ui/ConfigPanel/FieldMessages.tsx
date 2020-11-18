import React, { Fragment, useMemo } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { ErrorMessage, HelperMessage } from '@atlaskit/form';
import { ValidationError, FieldTypeError } from './types';
import { messages } from './messages';

// sidestep XSS issues
function makeMarkup(fragment: Node, key?: string) {
  const { nodeName, nodeType, childNodes, textContent } = fragment;

  if (nodeType === Node.TEXT_NODE) {
    return <Fragment key={key}>{textContent}</Fragment>;
  }

  // NOTE: NodeList doesn't have .map
  const children: JSX.Element[] = [];
  childNodes.forEach((childNode, i) => {
    const markup = makeMarkup(childNode, String(i));
    if (markup) {
      children.push(markup);
    }
  });

  switch (nodeName) {
    case 'B':
      return <b key={key}>{children}</b>;
    case 'I':
      return <i key={key}>{children}</i>;
    case 'STRONG':
      return <strong key={key}>{children}</strong>;
    case 'EM':
      return <em key={key}>{children}</em>;
    case 'CODE':
      return <code key={key}>{children}</code>;
  }

  if (children.length === 1) {
    return <Fragment key={key}>{children[0]}</Fragment>;
  }
  if (children.length) {
    return <span key={key}>{children}</span>;
  }

  return null;
}

function Description({ description }: { description: string }) {
  const markup = useMemo(() => {
    const dom = new DOMParser().parseFromString(description, 'text/html');
    return makeMarkup(dom);
  }, [description]);

  return <HelperMessage>{markup}</HelperMessage>;
}

const FieldMessages = function ({
  error,
  description,
  intl,
}: { error?: string; description?: string } & InjectedIntlProps) {
  if (!error && description) {
    return <Description description={description} />;
  }

  switch (error) {
    case ValidationError.Required:
      return (
        <ErrorMessage>{intl.formatMessage(messages.required)}</ErrorMessage>
      );

    case ValidationError.Invalid:
      return (
        <ErrorMessage>{intl.formatMessage(messages.invalid)}</ErrorMessage>
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
