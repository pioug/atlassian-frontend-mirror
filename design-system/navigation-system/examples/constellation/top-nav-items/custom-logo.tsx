import React from 'react';

import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { CustomLogo } from '@atlaskit/navigation-system/top-nav-items';

import customLogoSrc from '../../images/200x20.png';
import customIconSrc from '../../images/20x20.png';
import { MockTopBar } from '../common/mock-top-bar';

const CustomLogoImage = () => <img src={customLogoSrc} alt="" />;
const CustomIconImage = () => <img src={customIconSrc} alt="" />;

export const CustomLogoExample = () => {
	return (
		<MockTopBar>
			<TopNavStart>
				<CustomLogo
					href="https://jira.atlassian.com"
					logo={CustomLogoImage}
					icon={CustomIconImage}
					label="Home page"
				/>
			</TopNavStart>
		</MockTopBar>
	);
};

export default CustomLogoExample;
