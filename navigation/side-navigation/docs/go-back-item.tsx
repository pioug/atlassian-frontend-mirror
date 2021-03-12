import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Used when wanting to customize the go back button in [nestable navigation content](/packages/navigation/side-navigation/docs/nestable-navigation-content) and [nesting item](/packages/navigation/side-navigation/docs/nesting-item).
  The most common case for this is needing to translate the text,
  but another would be if you want an SPA transition to happen when a user interacts with the element.

  ${code`
import { GoBackItem } from '@atlaskit/side-navigation';

<GoBackItem>Back to project</GoBackItem>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/go-back-item.tsx').default}
      source={require('!!raw-loader!../examples/go-back-item.tsx')}
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
