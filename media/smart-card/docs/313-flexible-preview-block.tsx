import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
# Flexible UI: PreviewBlock

A preview block provides a thumbnail for the link.

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/view/FlexibleCard/components/blocks/preview-block')}
  />
)}

`;
