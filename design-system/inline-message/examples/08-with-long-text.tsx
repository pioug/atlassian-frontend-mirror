import React from 'react';

import InlineMessage from '../src';

const MessageContent = (
  <div>
    <span>Authenticate heading</span>
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
    secondaryText="Carrot cake chocolate bar caramels. Wafer jelly beans toffee chocolate ice cream jujubes candy canes. Sugar plum brownie jelly chocolate cake. Candy canes topping halvah tiramisu caramels dessert brownie jelly-o. Sweet tart cookie cupcake jelly-o jelly caramels bear claw."
  >
    {MessageContent}
  </InlineMessage>
);
