/* eslint-disable @repo/internal/react/use-primitives */
import React from 'react';

import SectionMessage from '../../src';

export default () => (
  <SectionMessage
    title="This account has been permanently deleted"
    appearance="error"
  >
    <p>The user `IanAtlas` no longer has access to Atlassian services.</p>
  </SectionMessage>
);
