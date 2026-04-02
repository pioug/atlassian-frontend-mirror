import React from 'react';

import Banner from '@atlaskit/banner';
import { cssMap } from '@atlaskit/css';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import Link from '@atlaskit/link';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const Icon = (
	<Flex xcss={iconSpacingStyles.space050}>
		<ErrorIcon label="Error" />
	</Flex>
);

export default (): React.JSX.Element => (
	<Banner icon={Icon} appearance="error">
		This is an error banner from <Link href="http://atlassian.com">Atlassian</Link>
	</Banner>
);
