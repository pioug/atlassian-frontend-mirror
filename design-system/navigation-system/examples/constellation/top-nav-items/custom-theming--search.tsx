import React from 'react';

import { TopNavMiddle } from '@atlaskit/navigation-system';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { parseHex } from '@atlaskit/navigation-system/theming/color-utils/parse-hex';
import { useLegacySearchTheme } from '@atlaskit/navigation-system/theming/use-legacy-search-theme';

import { MockRoot } from '../../utils/mock-root';
import { MockSearch } from '../../utils/mock-search';

const ThemedSearch = () => {
	const searchTheme = useLegacySearchTheme();
	// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
	return <MockSearch theme={searchTheme} />;
};

export const CustomThemingSearchExample = (): React.JSX.Element => (
	<MockRoot>
		<TopNav
			customTheme={{ backgroundColor: parseHex('#964AC0'), highlightColor: parseHex('#F8EEFE') }}
		>
			<TopNavMiddle>
				<ThemedSearch />
			</TopNavMiddle>
		</TopNav>
	</MockRoot>
);

export default CustomThemingSearchExample;
