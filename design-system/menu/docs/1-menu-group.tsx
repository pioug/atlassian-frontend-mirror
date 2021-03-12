import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  This is one of the two available group components that you will want to use.
  If you will be composing your menu as a popup you'll want to use [Popup menu group](popup-menu-group) which constrains its width to appropriate values.

  ${code`highlight=1,3,7
import { MenuGroup } from '@atlaskit/menu';

<MenuGroup>
  <Section title="Actions">
    <ButtonItem>Create article</ButtonItem>
  </Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Menu with max height"
      Component={require('../examples/scrollable-menu.tsx').default}
      source={require('!!raw-loader!../examples/scrollable-menu.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/menu-section/menu-group.tsx')}
    />
  )}
`;
