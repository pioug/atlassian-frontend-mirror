import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../../../src/view/FlexibleCard/components/blocks/block')}
  />
)}
`;
