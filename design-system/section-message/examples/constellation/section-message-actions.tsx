import React from 'react';

import SectionMessage, { SectionMessageAction } from '../../src';

export default () => (
  <SectionMessage
    title="Merged pull request"
    appearance="success"
    actions={[
      <SectionMessageAction href="#">View commit</SectionMessageAction>,
      // eslint-disable-next-line @repo/internal/react/use-noop
      <SectionMessageAction onClick={() => {}}>Dismiss</SectionMessageAction>,
    ]}
  >
    <p>Pull request #10146 merged after a successful build</p>
  </SectionMessage>
);
