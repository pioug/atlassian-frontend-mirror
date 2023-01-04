import React from 'react';
import { md, PropsTable } from '@atlaskit/docs';

export default md`
${(
  <PropsTable
    heading="Avatar List Props"
    props={require('!!extract-react-types-loader!../../src/avatar-list')}
  />
)}

${(
  <PropsTable
    heading="Avatar Picker Dialog Props"
    props={require('!!extract-react-types-loader!../../src/avatar-picker-dialog')}
  />
)}

${(
  <PropsTable
    heading="Predefined Avatar List Props"
    props={require('!!extract-react-types-loader!../../src/predefined-avatar-list')}
  />
)}

${(
  <PropsTable
    heading="Predefined Avatar View Props"
    props={require('!!extract-react-types-loader!../../src/predefined-avatar-view')}
  />
)}`;
