import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage title="Important usage instructions">
      Section is required to be used to ensure spacing around blocks of items
      exists! Make sure to use it.
    </SectionMessage>
  )}

  Used to separate items into sections.
  When using the \`title\` prop your section will implicitly group the items for screen readers without you needing to do anything.

  ${code`
import { Section } from '@atlaskit/side-navigation';

<Section title="Actions">
  <ButtonItem>Create issue</ButtonItem>
</Section>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/section.tsx').default}
      source={require('!!raw-loader!../examples/section.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      // We point to the original props object because for some reason ERT can't follow package boundaries.
      props={require('!!extract-react-types-loader!../src/components/Section/section')}
    />
  )}
`;
