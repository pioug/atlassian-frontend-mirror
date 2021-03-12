import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`

  Used to group related items in a menu, with an optional heading component.
  Generally you'll want to **always group items in sections**,
  even if there is only one item in the group; however a heading is not always necessary.


  ${code`highlight=1,4,6
import { Section } from '@atlaskit/menu';

<MenuGroup>
  <Section title="Actions">
    <ButtonItem>Create article</ButtonItem>
  </Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Section with Heading"
      Component={require('../examples/section-with-heading.tsx').default}
      source={require('!!raw-loader!../examples/section-with-heading.tsx')}
    />
  )}


  ## Component internals
  Internally this component contains a basic section component, optionally wrapped around a \`HeadingItem\` component
  Any children are rendered as siblings of the \`HeadingItem\`.
  This is done in a way to provide some added accessiblity features (see 'Accessibility' below).

  -  If a \`title\` prop is not provided, the \`SectionHeading\` component will not be rendered.
  -   The header text for the \`HeadingItem\` can be set with the \`title\` prop, and styles for the
      \`HeadingItem\` can be set with the \`cssFn\` prop.
  -   The \`testID\` will be applied to parent section component; the internal HeadingItem has'--heading'
      appended to the value of the testID prop.

  ## Scrollable sections

  While you can create anything you want with menu we don't really encourage doing _anything_.
  When creating pop-up menus you shouldn't allow it to get too long,
  but you still might have a lot of content to show.

  For that you can use _scrollable_ sections to keep the height at a reasonable length,
  but enable you to show a lot of content.

  By setting \`maxHeight\` to an appropriate height on the \`MenuGroup\` component,
  and then setting \`isScrollable\` on the desired \`Section\` -
  you too can have a scrollable section:

  ### Gotchas

  Scrollable sections will only work as a direct descendant of a menu group.
  This means scrollable **sections in sections will not work**.

  ${(
    <Example
      title="Scrollable sections"
      Component={require('../examples/scrollable-sections.tsx').default}
      source={require('!!raw-loader!../examples/scrollable-sections.tsx')}
    />
  )}


  ## Accessibility

  When there are a large number of items in a menu, allowing users who navigate with a screen reader
  to skip over sections can greatly improve the user experience. This behaviour is done by default with
  this component by setting a group role and label.

  It may be necessary to manually set the HeadingItem; in these cases the below code provides an example
  of how to recreate this accessibility feature.

  ${code`highlight=5,6
import { Section } from '@atlaskit/menu';
import { HeadingItem } from '@atlaskit/menu';

<MenuGroup>
  <Section aria-labelledby='actions'>
    <HeadingItem id='actions' aria-hidden>Actions</HeadingItem>
    <ButtonItem>Create article</ButtonItem>
  </Section>
</MenuGroup>
  `}

   The above is equivalent to the following code:

  ${code`highlight=1,6
import { Section } from '@atlaskit/menu';
import { HeadingItem } from '@atlaskit/menu';

<MenuGroup>
  <Section title="Actions">
    <ButtonItem>Create article</ButtonItem>
  </Section>
</MenuGroup>
  `}

  ${(
    <Props
      heading="Section Props"
      props={require('!!extract-react-types-loader!../src/menu-section/section.tsx')}
    />
  )}

  ${(
    <Props
      heading="Heading Props"
      props={require('!!extract-react-types-loader!../src/menu-item/heading-item.tsx')}
    />
  )}

`;
