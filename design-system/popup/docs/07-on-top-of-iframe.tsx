import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Popup should close when a user clicks outside it's content.
  In this example we showcase how a popup is closed after a user clicks inside iframe.

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/on-top-of-iframe').default}
      source={require('!!raw-loader!../examples/on-top-of-iframe')}
    />
  )}
`;
