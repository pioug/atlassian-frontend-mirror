import React from 'react';
import { md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

${(
  <SectionMessage title="Integral to theming" appearance="info">
    {md`
      **\`Checkbox 10.0\`** introduced component tokens to Checkbox as its core theming api.
      This page is a guide to the structure of the component tokens.
      For more details on theming @atlaskit/checkbox, please see the [theming guide](https://atlaskit.atlassian.com/packages/core/checkbox/docs/theming-guide).
    `}
  </SectionMessage>
)}

${(
  <Props
    heading="Component Tokens"
    props={require('!!extract-react-types-loader!../docs/component/component-tokens')}
  />
)}

`;
