import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Focus management is a huge part of ensuring having an accessible popup.
  For that reason ours comes with built in management to focus on not only the content when its shown,
  but ensure that focus is locked to it when open.

  Sometimes however we'll want to focus on a specific element when opening the popup,
  for that we can use the \`setInitialFocusRef\` function that is passed to the \`content\` render props.

  Pass it a \`ref\` of your desired element and it will focus it when the popup opens.
  Note that this will only work once on initial mount - afterwards it will end up nooping.

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/13-setting-focus').default}
      source={require('!!raw-loader!../examples/13-setting-focus')}
    />
  )}
`;
