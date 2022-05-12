import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
# Flexible UI: ActionItem

The certain blocks, such as TitleBlock or FooterBlock, can render link actions.
Each action item accepts an onClick event and provides preset icon and label.
With exception of a custom action which either Icon or label must be provided.

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../docs-helpers/flexible-ui-action-item')}
  />
)}
`;
