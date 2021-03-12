import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Renders a skeleton which should be used in place any any item that is currently loading.
  See [loading states](/packages/navigation/side-navigation/docs/loading-states) for best practices.

  ${code`
import { SkeletonItem } from '@atlaskit/side-navigation';

<SkeletonItem />
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/skeleton-item.tsx').default}
      source={require('!!raw-loader!../examples/skeleton-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      // We point to the original props object because for some reason ERT can't follow package boundaries.
      props={require('!!extract-react-types-loader!../../../design-system/menu/src/menu-item/skeleton-item')}
    />
  )}
`;
