import React from 'react';

import { parseHsl } from '@atlaskit/navigation-system/experimental/color-utils/parse-hsl';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseHslExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{
				backgroundColor: parseHsl('hsl(278, 89%, 97%)'),
				highlightColor: parseHsl('hsl(279, 48%, 52%)'),
			}}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseHslExample;
