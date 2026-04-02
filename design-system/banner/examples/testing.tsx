import React from 'react';

import Banner from '@atlaskit/banner';
import { cssMap } from '@atlaskit/css';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';


const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

export default (): React.JSX.Element => (
	<Banner
		icon={
			<Flex xcss={iconSpacingStyles.space050}>
				<WarningIcon label="Warning" />
			</Flex>
		}
		testId="myBannerTestId"
	>
		Your Banner is rendered with a [data-testid="myBannerTestId"].
	</Banner>
);
