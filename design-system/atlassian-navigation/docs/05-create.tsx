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
      Component={require('../examples/create').default}
      source={require('!!raw-loader!../examples/create')}
    />
  )}

  ${(
    <Example
      title="Create as a link"
      Component={require('../examples/create-with-link').default}
      source={require('!!raw-loader!../examples/create-with-link')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/Create')}
    />
  )}
`;
