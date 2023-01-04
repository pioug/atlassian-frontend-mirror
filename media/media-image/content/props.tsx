import React from 'react';
import { md, PropsTable } from '@atlaskit/docs';

export default md`
  ${(
    <PropsTable
      heading="MediaImage Props"
      props={require('!!extract-react-types-loader!../src/mediaImage')}
    />
  )}
`;
