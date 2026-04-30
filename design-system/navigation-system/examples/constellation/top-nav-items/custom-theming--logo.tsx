import React from 'react';

import { ConfluenceIcon } from '@atlaskit/logo';
import { AppLogo, TopNavStart } from '@atlaskit/navigation-system';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { parseHex } from '@atlaskit/navigation-system/theming/color-utils/parse-hex';

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
