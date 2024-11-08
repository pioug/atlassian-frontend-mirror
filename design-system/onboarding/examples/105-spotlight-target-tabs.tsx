/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Spotlight, SpotlightManager, SpotlightTarget } from '@atlaskit/onboarding';
import { Box } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

function SpotlightTargetTabs() {
	const [active, setActive] = useState(true);

	return (
		<SpotlightManager>
			<Box
				padding="space.400"
				backgroundColor="color.background.discovery"
				paddingBlock="space.400"
			>
				<Button appearance="primary" onClick={() => setActive(true)}>
					Show spotlight
				</Button>
				<Tabs id={'tabs'}>
					<TabList>
						<SpotlightTarget name="spotlight-1">
							<Tab>Tab 1 - Spotlight Target</Tab>
						</SpotlightTarget>
						<Tab>Tab 2 - Non target</Tab>
					</TabList>
					<TabPanel>Tab Content One</TabPanel>
					<TabPanel>Tab Content Two</TabPanel>
					<TabPanel>Tab Content Three</TabPanel>
				</Tabs>
				{active && (
					<Spotlight
						heading="Spotlight"
						dialogPlacement="left top"
						target="spotlight-1"
						targetBgColor={token('color.background.discovery')}
						actions={[{ onClick: () => setActive(false), text: 'OK' }]}
					>
						Spotlight content
					</Spotlight>
				)}
			</Box>
			{active && (
				<Spotlight
					heading="Spotlight"
					dialogPlacement="left top"
					target="spotlight-1"
					targetBgColor={token('color.background.discovery')}
					actions={[{ onClick: () => setActive(false), text: 'OK' }]}
				>
					Spotlight content
				</Spotlight>
			)}
		</SpotlightManager>
	);
}

export default SpotlightTargetTabs;
