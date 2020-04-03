import React from 'react';
import { code, md, Props, Example } from '@atlaskit/docs';

export default md`
  Will render an item wrapped in a button tag \`<button>\` -
  useful when you have an action that does something _other than_ changing routes.

  ${code`highlight=1,5
import { ButtonItem } from '@atlaskit/menu';

<MenuGroup>
<Section title="Actions">
  <ButtonItem>Create article</ButtonItem>
</Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Button item"
      Component={require('../examples/button-item.tsx').default}
      source={require('!!raw-loader!../examples/button-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/item/button-item.tsx')}
    />
  )}
`;
