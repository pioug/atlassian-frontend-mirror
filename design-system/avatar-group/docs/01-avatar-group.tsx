import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  \`AvatarGroup\` is a wrapper around avatars designed to render a collection
  of avatars. You will want to use avatar group when you want to stack avatars,
  or have easy collapse states once a set number of avatars are used, including a
  dropdown to show hidden avatars.

  \`AvatarGroup\` takes in a data array. Each object in the array will be turned into
  an \`Avatar\`, with the properties of the object being spread onto an avatar. While
  doing this it is important to remember to include a \`key\` property. For other data,
  see [The avatar documentation](./avatar) for the properties \`Avatar\` accepts.

  ### The Four Exceptions

  There are four props of \`Avatar\` that \`AvatarGroup\` can or will override:

  - \`onAvatarClick\` will be passed to \`onClick\` unless there is an explicit \`onClick\` on the avatar object
  - \`borderColor\` will get the \`AvatarGroup\`'s \`borderColor\`
  - \`size\` will get the \`AvatarGroup\`'s \`size\`
  - \`groupAppearance\` will get the \`AvatarGroup\`'s \`appearance\`

  ## Usage

  ${code`import AvatarGroup from '@atlaskit/avatar-group';`}

  ${(
    <Example
      packageName="@atlaskit/avatar-group"
      Component={require('../examples/02-basicAvatarGroup').default}
      source={require('!!raw-loader!../examples/02-basicAvatarGroup')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/AvatarGroup')}
    />
  )}
`;
