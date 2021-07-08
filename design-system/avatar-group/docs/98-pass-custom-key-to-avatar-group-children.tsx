import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
Allow user to pass \`key\` as part of \`data\` prop for uniquely identify each Avatar component inside \`AvatarGroup\`.
If key is not passed, using index as fallback for now. Index might solve our problem for now, but its better
that key should be passed to avoid unnecessary
unmounting when \`Avatar\` order changes inside \`AvatarGroup\`.

  ${(
    <Example
      highlight="31-48"
      packageName="@atlaskit/avatar-group"
      Component={
        require('../examples/30-avatar-group-with-custom-key-passed').default
      }
      source={require('!!raw-loader!../examples/30-avatar-group-with-custom-key-passed')}
    />
  )}
`;
