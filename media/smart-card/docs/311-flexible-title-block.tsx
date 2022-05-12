import React from 'react';
import { md, Props } from '@atlaskit/docs';
import { overrideActionsProps } from '../docs-helpers/flexible-ui';

export default md`

# Flexible UI: TitleBlock

The title block is the foundation of Flexible UI feature in Smart Links.
It contains an icon, the link, and any associated metadata and actions in one block.
The TitleBlock will also render differently given the state of the smart link.
This can be found in the corresponding Resolving, Resolved and Errored views.

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/view/FlexibleCard/components/blocks/title-block')}
    overrides={{
      actions: overrideActionsProps,
    }}
  />
)}

`;
