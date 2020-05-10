import React from 'react';

import SectionMessage from '../../src';

export default () => (
  <SectionMessage
    title="Editing is restricted"
    actions={[
      {
        key: '1',
        href: '#',
        text: 'Action 1',
      },
      {
        key: '2',
        href: '#',
        text: 'Action 2',
      },
    ]}
  >
    <p>
      You're not allowed to change these restrictions. It's either due to the
      restrictions on the page, or permission settings for this space.
    </p>
  </SectionMessage>
);
