import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ## i18n

  We use [transifex](https://www.transifex.com/atlassian/atlaskit/dashboard/), along with the rest of AtlasKit to provide i18n.

  In order to push or pull i18n changes, you need to:

  - Gain access to transifex (Please reach out to component owners)
  - Log in to [transifex](https://www.transifex.com/atlassian/atlaskit/dashboard/) and generate an API key
  - To push i18n changes: Run "\`bolt i18n:push\`" with the API key
  - To pull i18n changes: Run "\`bolt i18n:pull\`" with the API key

  If you're pulling i18n changes, ensure to commit the changes to master by raising a PR

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/60-internationalisation').default}
      title="Internationalisation example"
      source={require('!!raw-loader!../examples/60-internationalisation')}
    />
  )}
`;
