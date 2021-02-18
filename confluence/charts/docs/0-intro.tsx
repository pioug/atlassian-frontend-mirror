import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  undefined

  ## Usage

  ${(
    <Example
      packageName="@atlaskit/charts"
      Component={require('../examples/00-basic').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="Charts Props"
      props={require('!!extract-react-types-loader!../src')}
    />
  )}
`;
