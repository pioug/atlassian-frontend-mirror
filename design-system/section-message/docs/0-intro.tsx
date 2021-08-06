import React from 'react';

import { md } from '@atlaskit/docs';

import SectionMessage from '../src';

export default md`
${(
  <SectionMessage appearance="information">
    This component is now documented on{' '}
    <a href="https://atlassian.design/components">atlassian.design</a>
  </SectionMessage>
)}
`;
