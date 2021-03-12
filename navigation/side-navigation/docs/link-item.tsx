import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage title="Important usage instructions">
      The <a href="section">section component</a> is required to be used to
      ensure spacing around blocks of items exists! Make sure to use it.
    </SectionMessage>
  )}

  Will render an item wrapped in an anchor tag \`<a>\` -
  useful when you have an item that should change routes.
  If wanting to do SPA transitions make sure to use a [custom item](/packages/navigation/side-navigation/docs/custom-item) with your router link instead.

  ${code`
import { LinkItem } from '@atlaskit/side-navigation';

<LinkItem href="#">My articles</LinkItem>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/link-item.tsx').default}
      source={require('!!raw-loader!../examples/link-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      // We point to the original props object because for some reason ERT can't follow package boundaries.
      props={require('!!extract-react-types-loader!../../../design-system/menu/src/menu-item/link-item')}
    />
  )}
`;
