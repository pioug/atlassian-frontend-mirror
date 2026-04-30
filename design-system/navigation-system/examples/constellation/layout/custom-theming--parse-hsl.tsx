import React from 'react';

import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { parseHsl } from '@atlaskit/navigation-system/theming/color-utils/parse-hsl';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseHslExample = (): React.JSX.Element => (
	<MockRoot>
		<TopNav
			customTheme={{
				backgroundColor: parseHsl('hsl(278, 89%, 97%)'),
				highlightColor: parseHsl('hsl(279, 48%, 52%)'),
			}}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseHslExample;
