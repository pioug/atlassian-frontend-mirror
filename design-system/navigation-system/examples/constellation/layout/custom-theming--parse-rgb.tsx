import React from 'react';

import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { parseRgb } from '@atlaskit/navigation-system/theming/color-utils/parse-rgb';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseRgbExample = (): React.JSX.Element => (
	<MockRoot>
		<TopNav
			customTheme={{
				backgroundColor: parseRgb('rgb(248, 238, 254)'),
				highlightColor: parseRgb('rgb(150, 74, 192)'),
			}}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseRgbExample;
