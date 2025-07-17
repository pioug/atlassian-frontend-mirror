import React from 'react';

import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingRgbObjectExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{
				backgroundColor: { r: 248, g: 238, b: 254 },
				highlightColor: { r: 150, g: 74, b: 192 },
			}}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingRgbObjectExample;
