import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Heading that should be displayed inside a [section](/packages/navigation/side-navigation/docs/section).
  When using the \`title\` prop you won't need to use this directly.

  ${code`
import { HeadingItem } from '@atlaskit/side-navigation';

<HeadingItem>Actions</HeadingItem>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/heading-item.tsx').default}
      source={require('!!raw-loader!../examples/heading-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      // We point to the original props object because for some reason ERT can't follow package boundaries.
      props={require('!!extract-react-types-loader!../../../design-system/menu/src/menu-item/heading-item')}
    />
  )}
`;
