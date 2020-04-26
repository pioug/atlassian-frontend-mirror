import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Sometimes you'll need to do something that isn't supported by the component,
  but you don't want to completely rewrite it just to add that small feature.
  Luckily with overrides you can have your cake and eat it too.

  Here for example we can add extra behaviour into the overflow menu all powered by the \`overrides\` prop.
  Click the overflow avatar and you'll see a shiny "load more" button!

  ${(
    <Example
      highlight="31-48"
      packageName="@atlaskit/avatar-group"
      Component={require('../examples/overrides').default}
      source={require('!!raw-loader!../examples/overrides')}
    />
  )}
`;
