import React from 'react';

import SectionMessage, { SectionMessageAction } from '../../src';

export default () => (
  <SectionMessage
    title="Your managed accounts now include Trello access"
    appearance="discovery"
    actions={<SectionMessageAction href="#">Learn more</SectionMessageAction>}
  >
    <p>
      Some users haven't started using their Atlassian account for Trello.
      Changes you make to an account are reflected only if the user starts using
      the account for Trello.
    </p>
  </SectionMessage>
);
