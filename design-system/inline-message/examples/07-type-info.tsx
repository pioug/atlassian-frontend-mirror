import React from 'react';
import InlineMessage from '../src';

const MessageContent = (
  <div>
    <h4>Authenticate heading</h4>
    <span>
      Authenticate <a href="https://atlaskit.atlassian.com/">here</a> to see
      more information
    </span>
  </div>
);

export default () => (
  <div>
    <InlineMessage
      type="info"
      title="JIRA Service Desk"
      secondaryText="Authenticate to see more information"
    >
      {MessageContent}
    </InlineMessage>
    <InlineMessage
      type="info"
      secondaryText="Authenticate to see more information"
    >
      {MessageContent}
    </InlineMessage>
  </div>
);
