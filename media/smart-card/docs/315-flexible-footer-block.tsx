import React from 'react';
import { md, Props } from '@atlaskit/docs';
import { overrideActionsProps } from '../docs-helpers/flexible-ui';

export default md`
# Flexible UI: FooterBlock

A footer block provides the source of the link, and some actions.
Typically used at the bottom of a Smart Link.

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/view/FlexibleCard/components/blocks/footer-block')}
    overrides={{
      actions: overrideActionsProps,
    }}
  />
)}
`;
