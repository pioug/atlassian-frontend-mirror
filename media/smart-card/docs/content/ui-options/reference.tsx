import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`

### Props

Flexible Smart Links options can be applied at the top level of a
Smart Link in order to yield some different appearances.

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../../utils/props-ui')}
  />
)}
`;
