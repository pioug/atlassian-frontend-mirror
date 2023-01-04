import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`${(
  <Example
    Component={require('./sampleAvatarPicker').default}
    title="Avatar Picker With Source"
    source={require('!!raw-loader!./sampleAvatarPicker')}
  />
)}
`;
