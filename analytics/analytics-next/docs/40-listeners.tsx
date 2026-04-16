/* eslint-disable @atlaskit/design-system/use-primitives-text -- Legacy analytics-next docs intentionally use plain HTML prose instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock, PropsBlock } from './DocBlocks';

export default function Listeners(): React.JSX.Element {
	return (
		<div>
			<CodeBlock code={`import { AnalyticsListener } from '@atlaskit/analytics-next';`} />
			<p>
				An <code>AnalyticsListener</code> wraps your app and listens to any events which are fired
				within it.
			</p>
			<PropsBlock
				heading="AnalyticsListener Props"
				props={require('!!extract-react-types-loader!../src/components/AnalyticsListener/ModernAnalyticsListener')}
			/>
		</div>
	);
}
