import React from 'react';

import { code, md, Props } from '@atlaskit/docs';

const _default_1: any = md`
  ${code`import { AnalyticsListener } from '@atlaskit/analytics-next';`}

  An \`AnalyticsListener\` wraps your app and listens to any events which are fired within it.

  ${(
		<Props
			heading="AnalyticsListener Props"
			props={require('!!extract-react-types-loader!../src/components/AnalyticsListener/ModernAnalyticsListener')}
		/>
	)}
`;
export default _default_1;
