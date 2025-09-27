import React from 'react';

import Lorem from 'react-lorem-component';

import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

export default () => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			height: 200,
			margin: `${token('space.200', '16px')} auto`,
			border: `${token('border.width')} dashed ${token('color.border')}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			display: 'flex',
		}}
	>
		<Tabs id="overflow">
			<TabList>
				<Tab>Constrained height scrolls</Tab>
				<Tab>Unconstrained height</Tab>
			</TabList>
			<TabPanel>
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						display: 'flex',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						flexDirection: 'column',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						flexBasis: '100%',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						overflowY: 'scroll',
					}}
					// Tab index required here to support keyboard users scrolling the container
					// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex, @atlassian/a11y/no-noninteractive-tabindex
					tabIndex={0}
					role="region"
					aria-label="Scrollable content"
				>
					<p
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							overflow: 'hidden',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							textOverflow: 'ellipsis',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							whiteSpace: 'nowrap',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							flex: '0 0 auto',
						}}
					>
						This paragraph is testing horizontal overflow to make sure that the scroll container
						stays where it should be.
					</p>
					<Lorem count={5} />
				</div>
			</TabPanel>
			<TabPanel>
				<div>
					<Lorem count={5} />
				</div>
			</TabPanel>
		</Tabs>
	</div>
);
