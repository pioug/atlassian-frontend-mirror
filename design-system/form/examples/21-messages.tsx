import React from 'react';

import Lozenge from '@atlaskit/lozenge';

import { ErrorMessage, HelperMessage, ValidMessage } from '../src/messages';

export default function MessagesExample() {
  return (
    <div>
      <div data-testid="messages--short" style={{ width: 'max-content' }}>
        <HelperMessage testId="helper">This is a help message.</HelperMessage>
        <ErrorMessage testId="error">This is an error message.</ErrorMessage>
        <ValidMessage testId="valid">This is a success message.</ValidMessage>
      </div>
      <div data-testid="messages--long" style={{ maxWidth: 240 }}>
        <HelperMessage testId="helper--long">
          This is a help message, but it's really really really long.
        </HelperMessage>
        <ErrorMessage testId="error--long">
          This is an error message, but it's really really really long.
        </ErrorMessage>
        <ValidMessage testId="valid--long">
          This is a validation message, but it's really really really long.
        </ValidMessage>
      </div>
      <div data-testid="messages--inline-content" style={{ maxWidth: 240 }}>
        <HelperMessage testId="helper--long">
          This message contains <strong>strong</strong> text.
        </HelperMessage>
        <ErrorMessage testId="error--long">
          This message contains a link to{' '}
          <a href="http://www.atlassian.com">the Atlassian website</a>.
        </ErrorMessage>
        <ValidMessage testId="valid--long">
          This message contains a{' '}
          <Lozenge appearance="success">success</Lozenge> lozenge.
        </ValidMessage>
      </div>
    </div>
  );
}
