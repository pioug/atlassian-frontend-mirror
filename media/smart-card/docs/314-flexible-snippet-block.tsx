import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
# Flexible UI: SnippetBlock

A snippet block provides a description for a link.

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/view/FlexibleCard/components/blocks/snippet-block')}
  />
)}

`;
