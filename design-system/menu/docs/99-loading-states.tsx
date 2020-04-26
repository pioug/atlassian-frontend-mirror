import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Occasionally you will need to asynchronously load some of your menus.
  There are a few things to take care of:

  1. Only use skeletons when you're quite certain of what the loaded state will look like
  1. When transitioning from loading skeleton to loaded items try to ensure the jump does not look too janky - use the equivalent skeleton item that is appropriate
  1. Ensure loading does not take _too_ long - try to anticipate if a user will look at your menu via hover events and the like and pre-load the data as soon as you can
  1. When content is loading in make sure it all loads in at once per \`MenuGroup\` - our minds aren't fast enough to distinguish each \`Section\` loading individually for example

  For a more in-depth look at how to approach loading states have our _work in progress_ [Skeleton exploration](https://hello.atlassian.net/wiki/spaces/ADG/pages/598816601/Loading+experiences+-+3.4+-+Guideline+exploration+-+Skeleton#Exploration-(spec)) (only Atlassians will be able to access this link unfortuntely).

  ${(
    <Example
      title="Loading skeleton"
      Component={require('../examples/loading-skeleton.tsx').default}
      source={require('!!raw-loader!../examples/loading-skeleton.tsx')}
    />
  )}
`;
