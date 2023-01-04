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
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </HelperMessage>
        <ErrorMessage testId="error--long">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </ErrorMessage>
        <ValidMessage testId="valid--long">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </ValidMessage>
      </div>
      <div data-testid="messages--inline-content" style={{ maxWidth: 240 }}>
        <HelperMessage testId="helper--long">
          This message contains <strong>strong</strong> text.
        </HelperMessage>
        <ErrorMessage testId="error--long">
          This message contains <a href="//">a link</a>.
        </ErrorMessage>
        <ValidMessage testId="valid--long">
          This message contains a{' '}
          <Lozenge appearance="success">success</Lozenge> lozenge.
        </ValidMessage>
      </div>
    </div>
  );
}
