import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  This is the root component you should use every time you want a side navigation experience.
  It will take up \`100%\` of its parents height & width -
  so make sure you place it into an element that **has its height & width explicitly set**.
  Comes with a minimum width of \`240px\`.

  ${code`highlight=1,3,5
import { SideNavigation } from '@atlaskit/side-navigation';

<SideNavigation label="project">
  ...
</SideNavigation>
  `}

  ${(
    <Example
      title=""
      Component={require('../examples/side-navigation.tsx').default}
      source={require('!!raw-loader!../examples/side-navigation.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/SideNavigation')}
    />
  )}
`;
