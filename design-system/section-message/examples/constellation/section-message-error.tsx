import React from 'react';

import SectionMessage from '../../src';

export default () => (
  <SectionMessage
    title="This account will be permanently deleted"
    appearance="error"
  >
    <p>The user `user15` no longer has access to Atlassian services.</p>
  </SectionMessage>
);
