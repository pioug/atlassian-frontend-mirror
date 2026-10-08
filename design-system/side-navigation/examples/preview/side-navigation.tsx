/* eslint-disable @atlaskit/platform/use-entrypoints-in-examples -- This fixture captures this package’s own legacy components; its public entry points are all deprecated. */
import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { ButtonItem } from '../../src/components/Item/button-item';
import { NavigationContent } from '../../src/components/NavigationContent/index';
import { Section } from '../../src/components/Section/section';
import { SideNavigation } from '../../src/components/SideNavigation/index';
const styles = cssMap({
	subject: {
		width: '280px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<SideNavigation label="Project navigation">
					<NavigationContent>
						<Section>
							<ButtonItem isSelected>Overview</ButtonItem>
							<ButtonItem>Board</ButtonItem>
							<ButtonItem>Reports</ButtonItem>
							<ButtonItem>Settings</ButtonItem>
						</Section>
					</NavigationContent>
				</SideNavigation>
			</Box>
		</IntlProvider>
	);
}
