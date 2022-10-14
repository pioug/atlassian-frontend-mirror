import React from 'react';
import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="error">
    This package is deprecated and will be supported until{' '}
    {new Date(2022, 10, 12)}.
  </SectionMessage>
)}
`;
