import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { JiraIcon } from '@atlaskit/logo/jira/icon';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo, AppSwitcher } from '@atlaskit/navigation-system/top-nav-items';

// eslint-disable-next-line import/extensions -- PNG asset imports in this package require the explicit extension for module resolution.
import dstLogo from '../../images/dst.png';
import { MockTopBar } from '../common/mock-top-bar';

const CustomAppSwitcherIcon = () => <Avatar size="small" appearance="square" src={dstLogo} />;

export const CustomAppSwitcherExample = (): React.JSX.Element => {
	return (
		<MockTopBar>
			<TopNavStart sideNavToggleButton={null}>
				<AppSwitcher icon={CustomAppSwitcherIcon} label="App switcher" onClick={() => {}} />
				<AppLogo href="https://jira.atlassian.com" icon={JiraIcon} name="Jira" label="Home page" />
			</TopNavStart>
		</MockTopBar>
	);
};

export default CustomAppSwitcherExample;
