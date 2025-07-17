import React from 'react';

import { parseUserColor } from '@atlaskit/navigation-system/experimental/color-utils/parse-user-color';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseUserColorExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{
				backgroundColor: parseUserColor('#F8EEFE'),
				highlightColor: parseUserColor('rgb(150, 74, 192)'),
			}}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseUserColorExample;
