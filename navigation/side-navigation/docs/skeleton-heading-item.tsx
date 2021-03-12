import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Renders a skeleton which should be used in place of any heading item that is currently loading.
  See [loading states](/packages/navigation/side-navigation/docs/loading-states) for best practices.

${code`
import { SkeletonHeadingItem } from '@atlaskit/side-navigation';

<SkeletonHeadingItem />
`}

  ${(
    <Example
      title=""
      Component={require('../examples/skeleton-heading-item.tsx').default}
      source={require('!!raw-loader!../examples/skeleton-heading-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      // We point to the original props object because for some reason ERT can't follow package boundaries.
      props={require('!!extract-react-types-loader!../../../design-system/menu/src/menu-item/skeleton-heading-item')}
    />
  )}
`;
