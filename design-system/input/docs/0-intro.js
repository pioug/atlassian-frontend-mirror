import React from 'react';
import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage
    appearance="warning"
    title="Note: @atlaskit/input is deprecated."
  >
    This is an internal component and should not be used directly.
  </SectionMessage>
)}

An internal base component for an unstyled <input>.
`;
