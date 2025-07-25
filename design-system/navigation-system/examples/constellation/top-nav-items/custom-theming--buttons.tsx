import React from 'react';

import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import { RovoIcon } from '@atlaskit/logo';
import { EndItem, TopNavEnd } from '@atlaskit/navigation-system';
import { parseHex } from '@atlaskit/navigation-system/experimental/color-utils/parse-hex';
import { TopNavButton } from '@atlaskit/navigation-system/experimental/top-nav-button';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';

export const CustomThemingButtonsExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{ backgroundColor: parseHex('#964AC0'), highlightColor: parseHex('#F8EEFE') }}
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
