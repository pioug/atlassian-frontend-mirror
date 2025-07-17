import React from 'react';

import { TopNavMiddle } from '@atlaskit/navigation-system';
import { parseHex } from '@atlaskit/navigation-system/experimental/color-utils/parse-hex';
import { useLegacySearchTheme } from '@atlaskit/navigation-system/experimental/use-legacy-search-theme';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';
import { MockSearch } from '../../utils/mock-search';

const ThemedSearch = () => {
	const searchTheme = useLegacySearchTheme();
	return <MockSearch theme={searchTheme} />;
};

export const CustomThemingSearchExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{ backgroundColor: parseHex('#964AC0'), highlightColor: parseHex('#F8EEFE') }}
		>
			<TopNavMiddle>
				<ThemedSearch />
			</TopNavMiddle>
		</TopNav>
	</MockRoot>
);

export default CustomThemingSearchExample;
