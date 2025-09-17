import React from 'react';

import Spinner from '@atlaskit/spinner';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function withFlexContent() {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: 200,
				margin: `${token('space.200', '16px')} auto`,
				border: `${token('border.width')} dashed ${N100}`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
			}}
		>
			<Tabs id="with-flex">
				<TabList>
					<Tab>Spinner should be centered</Tab>
				</TabList>
				<TabPanel>
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							alignItems: 'center',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							display: 'flex',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							flex: '1 0 auto',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							justifyContent: 'center',
						}}
					>
						<Spinner size="medium" />
					</div>
				</TabPanel>
			</Tabs>
		</div>
	);
}
