import React from 'react';
import { code, md, Props, Example } from '@atlaskit/docs';

export default md`
  Used to render a heading inside a section.

  ${code`highlight=1,5
import { HeadingItem } from '@atlaskit/menu';

<MenuGroup>
  <Section>
    <HeadingItem>Actions</HeadingItem>
    <ButtonItem>Create article</ButtonItem>
  </Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Heading item"
      Component={require('../examples/heading-item.tsx').default}
      source={require('!!raw-loader!../examples/heading-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/item/heading-item.tsx')}
    />
  )}
`;
