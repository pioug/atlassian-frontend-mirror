import React from 'react';

import InlineMessage from '../src';

const MessageContent = (
  <div>
    <h4>Authenticate heading</h4>
    <span>
      <a href="http://www.atlassian.com">Authenticate</a> to see more
      information
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
