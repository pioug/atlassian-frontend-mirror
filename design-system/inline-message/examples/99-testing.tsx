import React from 'react';
import InlineMessage from '../src';

const MessageContent = (
  <div>
    <h4>It is so great to use data-testid</h4>
    <span>
      Visit{' '}
      <a href="https://atlaskit.atlassian.com/docs/guides/testing">here</a> to
      see more information
    </span>
  </div>
);

export default () => (
  <div>
    <InlineMessage
      type="error"
      title="My testing Inline Message"
      secondaryText="Use data-testid for reliable testing"
      testId="the-inline-message"
    >
      {MessageContent}
    </InlineMessage>
  </div>
);
