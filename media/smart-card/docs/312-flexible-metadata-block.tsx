import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
# Flexible UI: MetadataBlock

A metadata block is designed to contain groups of metadata in the form of elements.
Accepts an array of elements to be shown either primary (left hand side) or secondary (right hand side).

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/view/FlexibleCard/components/blocks/metadata-block')}
  />
)}

`;
