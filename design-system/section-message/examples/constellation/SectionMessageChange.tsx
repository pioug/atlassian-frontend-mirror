import React from 'react';

import SectionMessage from '../../src';

export default () => (
  <SectionMessage
    title="Your managed accounts now include Trello access"
    appearance="change"
    actions={[
      {
        key: '1',
        href: '#',
        text: 'Learn more',
      },
    ]}
  >
    <p>
      Some users haven't started using their Atlassian account for Trello.
      Changes you make to an account are reflected only if the user starts using
      the account for Trello.
    </p>
  </SectionMessage>
);
