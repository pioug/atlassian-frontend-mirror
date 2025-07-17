import React from 'react';

import { parseHex } from '@atlaskit/navigation-system/experimental/color-utils/parse-hex';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';
import { MockContent } from '../common/mock-content';

export const CustomThemingParseHexExample = () => (
	<MockRoot>
		<TopNav
			UNSAFE_theme={{ backgroundColor: parseHex('#F8EEFE'), highlightColor: parseHex('#964AC0') }}
		>
			<MockContent />
		</TopNav>
	</MockRoot>
);

export default CustomThemingParseHexExample;
