import React from 'react';

import { IntlProvider } from 'react-intl';

import { AppSwitcher } from '@atlaskit/atlassian-navigation/app-switcher';
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { PrimaryButton } from '@atlaskit/atlassian-navigation/primary-button';
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { cssMap } from '@atlaskit/css';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraLogoCS as JiraLogo } from '@atlaskit/logo/jira/logo';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '620px',
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
				<AtlassianNavigation
					label="Jira"
					renderAppSwitcher={() => <AppSwitcher tooltip="Switch apps" />}
					renderProductHome={() => <ProductHome icon={JiraIcon} logo={JiraLogo} />}
					primaryItems={[
						<PrimaryButton key="projects">Projects</PrimaryButton>,
						<PrimaryButton key="issues">Issues</PrimaryButton>,
					]}
				/>
			</Box>
		</IntlProvider>
	);
}
