import React from 'react';

import { md, Props } from '@atlaskit/docs';

export default md`

  The default set of plugin configurations for Link Create

  ## Usage

  ${(
    <Props
      heading="LinkCreatePresets Props"
      props={require('!!extract-react-types-loader!../src')}
    />
  )}
`;
