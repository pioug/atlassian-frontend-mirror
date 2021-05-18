import React from 'react';

import SectionMessage, { SectionMessageAction } from '../../src';

export default () => (
  <SectionMessage
    title="Editing is restricted"
    actions={[
      <SectionMessageAction href="#">Action 1</SectionMessageAction>,
      <SectionMessageAction href="#">Action 2</SectionMessageAction>,
    ]}
  >
    <p>
      You're not allowed to change these restrictions. It's either due to the
      restrictions on the page, or permission settings for this space.
    </p>
  </SectionMessage>
);
