import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`

### BaseActionItem Props

All action items inherit these props.
Named action such as \`EditAction\` or \`DeleteAction\` comes with the preset
icon and label. Thus only requires \`name\` and \`onClick\`.

${(
  <Props
    heading=""
    props={require('!!extract-react-types-loader!../../utils/props-action-item')}
  />
)}

`;
