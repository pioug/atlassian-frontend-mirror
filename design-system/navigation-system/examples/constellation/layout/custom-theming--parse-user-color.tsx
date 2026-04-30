import React from 'react';

import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { parseUserColor } from '@atlaskit/navigation-system/theming/color-utils/parse-user-color';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseUserColorExample = (): React.JSX.Element => (
	<MockRoot>
		<TopNav
			customTheme={{
				backgroundColor: parseUserColor('#F8EEFE'),
				highlightColor: parseUserColor('rgb(150, 74, 192)'),
			}}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseUserColorExample;
