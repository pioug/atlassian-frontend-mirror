import React from 'react';

import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { NavLogo } from '@atlaskit/navigation-system/top-nav-items';

import customLogoSrc from '../../images/200x20.png';
import customIconSrc from '../../images/20x20.png';
import { MockTopBar } from '../common/mock-top-bar';

const CustomLogo = () => <img src={customLogoSrc} alt="" />;
const CustomIcon = () => <img src={customIconSrc} alt="" />;

export const CustomNavLogoExample = () => {
	return (
		<MockTopBar>
			<TopNavStart>
				<NavLogo
					href="https://jira.atlassian.com"
					logo={CustomLogo}
					icon={CustomIcon}
					label="Home page"
				/>
			</TopNavStart>
		</MockTopBar>
	);
};

export default CustomNavLogoExample;
