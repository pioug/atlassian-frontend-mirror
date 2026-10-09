import React from 'react';

import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { parseHex } from '@atlaskit/navigation-system/theming/color-utils/parse-hex';
import { AppLogo } from '@atlaskit/navigation-system/top-nav-items';

import { MockRoot } from '../../utils/mock-root';

export const CustomThemingLogoExample = (): React.JSX.Element => (
	<MockRoot>
		<TopNav
			customTheme={{ backgroundColor: parseHex('#964AC0'), highlightColor: parseHex('#F8EEFE') }}
		>
			<TopNavStart sideNavToggleButton={null}>
				<AppLogo
					icon={ConfluenceIcon}
					name="Confluence"
					label="Home page"
					href="https://atlassian.design"
				/>
			</TopNavStart>
		</TopNav>
	</MockRoot>
);

export default CustomThemingLogoExample;
