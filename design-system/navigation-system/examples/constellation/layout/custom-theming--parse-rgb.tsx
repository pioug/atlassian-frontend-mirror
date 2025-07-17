import React from 'react';

import { parseRgb } from '@atlaskit/navigation-system/experimental/color-utils/parse-rgb';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseRgbExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{
				backgroundColor: parseRgb('rgb(248, 238, 254)'),
				highlightColor: parseRgb('rgb(150, 74, 192)'),
			}}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseRgbExample;
