import React from 'react';

import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="information">
    This package is now documented on{' '}
    <a href="https://atlassian.design/components/primitives/overview">
      atlassian.design
    </a>
  </SectionMessage>
)}
`;
