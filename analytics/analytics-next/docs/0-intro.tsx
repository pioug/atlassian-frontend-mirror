import React from 'react';

import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

${(
  <SectionMessage
    appearance="warning"
    title="Maintaince Mode: @atlaskit/analytics is in maintenance mode."
  >
    This package is officially in maintenance mode, which means only bugfixes or
    VULN fixes are currently being accepted and no known breaking changes will
    be approved in the PR process. <br />
    Please refer to this
    <a
      href="https://hello.atlassian.net/wiki/spaces/APD/pages/2470435075/DACI+analytics-next+in+a+maintenance+mode"
      target="_blank"
    >
      {' '}
      DACI{' '}
    </a>{' '}
    for more details.
  </SectionMessage>
)}

This package aims to help assist consumers track the way their React components are being used.

### Contents

- [Concepts](./analytics-next/docs/concepts) (Read first!)
- [Usage with presentational components](./analytics-next/docs/usage-with-presentational-components)
- [Usage with container components](./analytics-next/docs/usage-for-container-components)
- [Listeners](./analytics-next/docs/listeners)
- [Error Boundary](./analytics-next/docs/error-boundary)
- [Events](./analytics-next/docs/events)
- [Advanced usage](./analytics-next/docs/advanced-usage)
- [Ugprade guide](./analytics-next/docs/upgrade-guide)
`;
