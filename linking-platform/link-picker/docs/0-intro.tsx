import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  Standalone link picker

  ## Usage

  ${(
    <Example
      packageName="@atlaskit/link-picker"
      Component={require('../examples/00-basic').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="LinkPicker Props"
      props={require('!!extract-react-types-loader!../src')}
    />
  )}
`;
