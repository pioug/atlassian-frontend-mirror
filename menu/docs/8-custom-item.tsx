import React from 'react';
import { code, md, Props, Example } from '@atlaskit/docs';

export default md`
  Useful when wanting to create a item using a your own component that inherits the look and feel of a menu item.
  Use cases could include using your own router link component for example.

  ${code`highlight=1,5
import { CustomItem } from '@atlaskit/menu';

<MenuGroup>
<Section title="Actions">
  <CustomItem component={Component}>View articles</CustomItem>
</Section>
</MenuGroup>
  `}

${(
  <Example
    title="Custom item"
    Component={require('../examples/custom-item.tsx').default}
    source={require('!!raw-loader!../examples/custom-item.tsx')}
  />
)}

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/components/item/custom-item.tsx')}
  />
)}
`;
