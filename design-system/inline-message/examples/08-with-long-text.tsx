import React from 'react';

import InlineMessage from '../src';

const MessageContent = (
  <div>
    <span>Authenticate heading</span>
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
    secondaryText="Carrot cake chocolate bar caramels. Wafer jelly beans toffee chocolate ice cream jujubes candy canes. Sugar plum brownie jelly chocolate cake. Candy canes topping halvah tiramisu caramels dessert brownie jelly-o. Sweet tart cookie cupcake jelly-o jelly caramels bear claw."
  >
    {MessageContent}
  </InlineMessage>
);
