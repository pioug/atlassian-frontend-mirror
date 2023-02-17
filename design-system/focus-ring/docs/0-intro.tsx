import React from 'react';

import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    This component has accessibility issues that we are working to resolve. Do
    not use without support from the Atlassian Design System accessibility team.
  </SectionMessage>
)}
`;
