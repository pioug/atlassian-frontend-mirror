import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Renders a skeleton element that has the same sizing as \`HeadingItem\`.
  Useful when you're asyncronously loading data for a menu,
  it has not yet loaded,
  and you are quite certain you know what the data will look like after it has loaded.

  ${code`highlight=1,5
import { SkeletonHeadingItem } from '@atlaskit/menu';

<MenuGroup>
  <Section>
    <SkeletonHeadingItem />
    <SkeletonItem />
  </Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Skeleton heading item"
      Component={require('../examples/skeleton-heading-item.tsx').default}
      source={require('!!raw-loader!../examples/skeleton-heading-item.tsx')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/menu-item/skeleton-heading-item.tsx')}
    />
  )}
`;
