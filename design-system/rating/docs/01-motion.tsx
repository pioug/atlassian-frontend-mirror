import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  Rating comes with support for motion.
  Using the primitives \`StaggeredEntrance\` and \`ZoomIn\` we can compose motion into rating for a sweet entrance motion.

  **Use this pattern sparingly** when you want to give extra visual indication to the rating component.

  ${(
    <Example
      packageName="@atlaskit/rating"
      Component={require('../examples/with-motion').default}
      title="Star composed with motion"
      source={require('!!raw-loader!../examples/with-motion')}
    />
  )}
`;
