import React from 'react';
import { md, Example } from '@atlaskit/docs';
export default md`

${(
  <Example
    Component={require('./dropzone-minimal-example').default}
    title="Dropzone Example"
    source={require('!!raw-loader!./dropzone-minimal-example')}
  />
)}
`;
