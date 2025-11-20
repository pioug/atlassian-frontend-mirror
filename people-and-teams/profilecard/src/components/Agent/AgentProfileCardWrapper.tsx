import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({ wrapper: { width: '360px' } });

export const AgentProfileCardWrapper = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	return <Box xcss={styles.wrapper}>{children}</Box>;
};
