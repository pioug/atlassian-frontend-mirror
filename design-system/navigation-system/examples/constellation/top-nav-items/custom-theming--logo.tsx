import React from 'react';

import { ConfluenceIcon } from '@atlaskit/logo';
import { AppLogo, TopNavStart } from '@atlaskit/navigation-system';
import { parseHex } from '@atlaskit/navigation-system/experimental/color-utils/parse-hex';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';

export const CustomThemingLogoExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{ backgroundColor: parseHex('#964AC0'), highlightColor: parseHex('#F8EEFE') }}
		>
			<TopNavStart>
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
