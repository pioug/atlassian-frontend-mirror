import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
${(
  <Example
    Component={require('../../examples/0-basic-example').default}
    title="Single File Preview"
    source={require('!!raw-loader!../../examples/0-basic-example')}
  />
)}
`;
