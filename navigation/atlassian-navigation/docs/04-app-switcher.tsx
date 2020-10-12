import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  App switcher is a pre-made button with an icon that you can use to then implement an app switcher,
  generally you'll want to use the [Atlassian switcher](/packages/navigation/atlassian-switcher) component composed with

  ${code`
import { AppSwitcher } from '@atlaskit/atlassian-navigation';

<AppSwitcher tooltip="Switch to..." />;
`}

  ${(
    <Example
      title="App switcher"
      Component={require('../examples/app-switcher.tsx').default}
      source={require('!!raw-loader!../examples/app-switcher.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/AppSwitcher')}
    />
  )}
`;
