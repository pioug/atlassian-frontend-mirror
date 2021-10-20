import React, { useState } from 'react';

import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import InlineMessage from '../src';

const MessageContent = (
  <div>
    <h4>It is so great to use data-testid</h4>
    <span>
      Visit{' '}
      <a href="https://developer.atlassian.com/cloud/framework/atlassian-frontend/development/04-testing">
        here
      </a>{' '}
      to see more information
    </span>
  </div>
);

export default () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  return (
    <AtlaskitThemeProvider mode={mode}>
      <div>
        <button
          type="button"
          onClick={() =>
            setMode((oldMode) => (oldMode === 'light' ? 'dark' : 'light'))
          }
        >
          Toggle mode
        </button>
        <InlineMessage
          type="error"
          title="My testing Inline Message"
          secondaryText="Use data-testid for reliable testing"
          testId="the-inline-message"
        >
          {MessageContent}
        </InlineMessage>
      </div>
    </AtlaskitThemeProvider>
  );
};
