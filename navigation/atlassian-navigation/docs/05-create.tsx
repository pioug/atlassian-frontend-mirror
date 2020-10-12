import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Primary call to action component for the Atlassian navigation package which handles responsive viewports.
  Compose this with the [Atlassian navigation](atlassian-navigation) package.

  ${code`
import { Create } from '@atlaskit/atlassian-navigation';

<Create text="Create" onClick={console.log} />;
`}

  ${(
    <Example
      title="Create"
      Component={require('../examples/create.tsx').default}
      source={require('!!raw-loader!../examples/create.tsx')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/Create')}
    />
  )}
`;
