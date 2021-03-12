import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Renders a skeleton element that has the same sizing as an item.
  Useful when you're asyncronously loading data for a menu,
  if it has not yet loaded,
  and you are quite certain you know what the data will look like after it has loaded.

${code`highlight=1,6
import { SkeletonItem } from '@atlaskit/menu';

<MenuGroup>
  <Section>
    <SkeletonHeadingItem />
    <SkeletonItem />
  </Section>
</MenuGroup>
`}

${(
  <Example
    title="Skeleton item"
    Component={require('../examples/skeleton-item.tsx').default}
    source={require('!!raw-loader!../examples/skeleton-item.tsx')}
  />
)}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/menu-item/skeleton-item.tsx')}
    />
  )}
`;
