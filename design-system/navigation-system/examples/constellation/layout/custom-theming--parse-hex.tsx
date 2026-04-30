import React from 'react';

import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { parseHex } from '@atlaskit/navigation-system/theming/color-utils/parse-hex';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseHexExample = (): React.JSX.Element => (
	<MockRoot>
		<TopNav
			customTheme={{ backgroundColor: parseHex('#F8EEFE'), highlightColor: parseHex('#964AC0') }}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseHexExample;
