import React from 'react';

import { code, md, Props } from '@atlaskit/docs';

export default md`
  ${code`import { AnalyticsListener } from '@atlaskit/analytics-next';`}

  An \`AnalyticsListener\` wraps your app and listens to any events which are fired within it.

  ${(
    <Props
      heading="AnalyticsListener Props"
      props={require('!!extract-react-types-loader!../src/components/AnalyticsListener/LegacyAnalyticsListener')}
    />
  )}
`;
