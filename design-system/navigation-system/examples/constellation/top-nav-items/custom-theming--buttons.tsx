import React from 'react';

import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import { RovoIcon } from '@atlaskit/logo';
import { EndItem, TopNavEnd } from '@atlaskit/navigation-system';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { parseHex } from '@atlaskit/navigation-system/theming/color-utils/parse-hex';
import { TopNavButton } from '@atlaskit/navigation-system/theming/top-nav-button';

import { MockRoot } from '../../utils/mock-root';

export const CustomThemingButtonsExample = (): React.JSX.Element => (
	<MockRoot>
		<TopNav
			customTheme={{ backgroundColor: parseHex('#964AC0'), highlightColor: parseHex('#F8EEFE') }}
		>
			<TopNavEnd>
				<TopNavButton iconBefore={(props) => <RovoIcon {...props} size="xxsmall" label="" />}>
					Chat
				</TopNavButton>
				<EndItem icon={AngleBracketsIcon} label="Dev tools" />
			</TopNavEnd>
		</TopNav>
	</MockRoot>
);

export default CustomThemingButtonsExample;
