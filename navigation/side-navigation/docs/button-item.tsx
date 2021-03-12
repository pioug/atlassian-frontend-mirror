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

  Will render an item wrapped in a button tag \`<button>\` -
  useful when you have an action that does something _other than_ changing routes.

  ${code`
import { ButtonItem } from '@atlaskit/side-navigation';

<ButtonItem>Create article</ButtonItem>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/button-item.tsx').default}
      source={require('!!raw-loader!../examples/button-item.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      // We point to the original props object because for some reason ERT can't follow package boundaries.
      props={require('!!extract-react-types-loader!../../../design-system/menu/src/menu-item/button-item')}
    />
  )}
`;
