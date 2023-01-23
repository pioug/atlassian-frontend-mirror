import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';

export default customMd`

${(
  <CustomExample
    Component={require('../../../examples/link-url').default}
    source={require('!!raw-loader!../../../examples/link-url')}
  />
)}
`;
