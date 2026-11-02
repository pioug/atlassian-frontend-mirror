import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	base: {
		height: '60px',
		width: '80px',
		borderRadius: token('radius.small'),
		backgroundColor: token('elevation.surface.raised'),
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default function IconContainer({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return <Flex xcss={styles.base}>{children}</Flex>;
}
