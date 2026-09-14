import React from 'react';

import loremIpsum from 'lorem-ipsum';

import Tabs from '@atlaskit/tabs/tabs';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import { token } from '@atlaskit/tokens';

const createSeededRandom = (initialSeed: number) => {
	let seed = initialSeed;

	return () => {
		if (seed >= 9007199254740992) {
			seed = 0;
		}

		const x = Math.sin(0.8765111159592828 + seed++) * 10000;
		return x - Math.floor(x);
	};
};

const Lorem = ({ count }: { count: number }) => (
	<div
		dangerouslySetInnerHTML={{
			__html: loremIpsum({
				count,
				units: 'paragraphs',
				format: 'html',
				random: createSeededRandom(0),
			}),
		}}
	/>
);

export default (): React.JSX.Element => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			height: 200,
			margin: `${token('space.200')} auto`,
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
					// eslint-disable-next-line @atlassian/a11y/no-noninteractive-tabindex
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
