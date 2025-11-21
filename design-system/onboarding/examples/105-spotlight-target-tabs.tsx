import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Spotlight, SpotlightManager, SpotlightTarget } from '@atlaskit/onboarding';
import { Box } from '@atlaskit/primitives/compiled';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

const wrapperStyles = cssMap({
	root: {
		paddingInlineStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockStart: token('space.400'),
		paddingBlockEnd: token('space.400'),
	},
});
function SpotlightTargetTabs(): React.JSX.Element {
	const [active, setActive] = useState(true);

	return (
		<SpotlightManager>
			<Box xcss={wrapperStyles.root} backgroundColor="color.background.discovery">
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
