import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  The driver component of meta creation flow

  ## Usage

  ${(
    <Example
      packageName="@atlaskit/link-create"
      Component={require('../examples/00-basic').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="LinkCreate Props"
      props={require('!!extract-react-types-loader!../src')}
    />
  )}
`;
