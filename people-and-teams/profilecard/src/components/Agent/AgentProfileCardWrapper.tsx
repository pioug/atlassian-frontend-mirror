import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		width: '360px',
		borderRadius: token('radius.large'),
		backgroundColor: token('elevation.surface.overlay'),
	},
});

export const AgentProfileCardWrapper = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	return <Box xcss={styles.wrapper}>{children}</Box>;
};
