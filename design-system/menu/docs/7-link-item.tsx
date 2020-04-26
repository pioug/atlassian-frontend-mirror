import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Will render an item wrapped in an anchor tag \`<a>\` -
  useful when wanting to transition to another page.
  If needing to use a specific routers component for route transitions you'll want to compose them together using \`CustomItem\`.

  ${code`highlight=1,5
import { LinkItem } from '@atlaskit/menu';

<MenuGroup>
<Section title="Actions">
  <LinkItem href="/articles">View articles</LinkItem>
</Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Link item"
      Component={require('../examples/link-item.tsx').default}
      source={require('!!raw-loader!../examples/link-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/item/link-item.tsx')}
    />
  )}
`;
