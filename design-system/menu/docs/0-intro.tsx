import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`

  ## Documentation

  All the documentation can be found in the **sidebar nav links**  👈

  - [Menu group](menu/docs/menu-group)
  - [Popup menu group](menu/docs/popup-menu-group)
  - [Section](menu/docs/section)
  - [Heading item](menu/docs/heading-item)
  - [Skeleton heading item](menu/docs/skeleton-heading-item)
  - [Button item](menu/docs/button-item)
  - [Link item](menu/docs/link-item)
  - [Custom item](menu/docs/custom-item)
  - [Overriding item styles](menu/docs/overriding-item-styles)
  - [Skeleton item](menu/docs/skeleton-item)
  - [Loading states](menu/docs/loading-states)

  ## Usage

  ${code`
import {
  MenuGroup,
  Section,
  ButtonItem
} from '@atlaskit/menu';

<MenuGroup>
  <Section title="Starred">
    <ButtonItem>Navigation System</ButtonItem>
  </Section>
  <Section hasSeparator>
    <ButtonItem>Create project</ButtonItem>
  </Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Menu"
      Component={require('../examples/menu.tsx').default}
      source={require('!!raw-loader!../examples/menu.tsx')}
    />
  )}
`;
