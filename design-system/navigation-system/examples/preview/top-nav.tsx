import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { TopNav, TopNavEnd, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Profile,
} from '@atlaskit/navigation-system/top-nav-items';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '680px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box xcss={styles.subject}>
				<Root>
					<TopNav testId="component-preview">
						<TopNavStart sideNavToggleButton={null}>
							<AppSwitcher label="App switcher" />
							<AppLogo href="#" icon={ConfluenceIcon} name="Confluence" label="Confluence home" />
							<CreateButton>Create</CreateButton>
						</TopNavStart>
						<TopNavEnd>
							<Profile label="Your profile" />
						</TopNavEnd>
					</TopNav>
				</Root>
			</Box>
		</IntlProvider>
	);
}
