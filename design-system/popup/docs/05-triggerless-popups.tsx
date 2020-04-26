import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Popups are seen in many different places.
  Some have an obvious trigger that you use to open a popup - but what if you don't have an obvious one?
  Sometimes we want to tie a popup to a particular element,
  but open it via other interactions.

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/triggerless').default}
      source={require('!!raw-loader!../examples/triggerless')}
    />
  )}
`;
