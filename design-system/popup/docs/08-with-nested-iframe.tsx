import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Popup should close when a user clicks outside it's content.
  Here we showcase how a popup is closed after a user clicks inside iframe on the complex layout example.
  Note, that a popup shouldn't close if iframe clicked is located inside it.

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/with-nested-iframe').default}
      source={require('!!raw-loader!../examples/with-nested-iframe')}
    />
  )}
`;
