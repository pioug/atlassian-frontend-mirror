import React from 'react';

import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="information">
    This component is now documented on{' '}
    {/* eslint-disable-next-line @repo/internal/react/use-primitives */}
    <a href="https://atlassian.design/components">atlassian.design</a>
  </SectionMessage>
)}
`;
