import React from 'react';

import InlineMessage from '../src';

const MessageContent = (
  <div>
    <h4>Authenticate heading</h4>
    <span>
      {/* TODO: Use descriptive text for link (DSP-11466) */}
      {/* eslint-disable-next-line jsx-a11y/anchor-ambiguous-text */}
      Authenticate <a href="https://atlaskit.atlassian.com/">here</a> to see
      more information
    </span>
  </div>
);

export default () => (
  <InlineMessage
    appearance="connectivity"
    title="JIRA Service Desk"
    secondaryText="Carrot cake chocolate bar caramels."
    placement="right"
  >
    {MessageContent}
  </InlineMessage>
);
