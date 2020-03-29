import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import InlineMessage from '../../..';

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

const createWrapper = (testId?: string) => (
  <InlineMessage
    type="error"
    title="My testing Inline Message"
    secondaryText="Use data-testid to reliable testing"
    testId={testId ? testId : undefined}
  >
    {MessageContent}
  </InlineMessage>
);

describe('Inline message should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const inlineMessageBtn = 'the-inline-message--button';
    const inlineMessageComponent = 'the-inline-message';
    const inlineMessageTitle = 'the-inline-message--title';
    const inlineMessageText = 'the-inline-message--text';
    const inlineMessageContent = 'the-inline-message--inline-dialog';

    const { getByTestId } = render(createWrapper('the-inline-message'));
    expect(getByTestId(inlineMessageBtn)).toBeTruthy();
    expect(getByTestId(inlineMessageComponent)).toBeTruthy();
    expect(getByTestId(inlineMessageTitle)).toBeTruthy();
    expect(getByTestId(inlineMessageText)).toBeTruthy();
    // the content is only displayed when it is clicked on the inline-message.
    fireEvent.click(getByTestId(inlineMessageBtn));
    expect(getByTestId(inlineMessageContent)).toBeTruthy();
  });
});
