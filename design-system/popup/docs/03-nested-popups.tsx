import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  Popups in popups.
  Nested popups.
  Whatever we want to call them - sometimes we need this behaviour.
  For the most part you can have this behaviour working out of the box,
  like in the example below:

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/nested').default}
      source={require('!!raw-loader!../examples/nested')}
    />
  )}

  ## Gotchas

  ### The case for stopping propagation

  If you look at the example above you'll notice that it has this code:

  ${code`
<PopupMenuGroup onClick={e => e.stopPropagation()}>
  `}

  This is needed to prevent the children from closing its parent popup when interacting with its child elements.
  Without it - it would end up closing all the popups which is probably not what we want.
`;
