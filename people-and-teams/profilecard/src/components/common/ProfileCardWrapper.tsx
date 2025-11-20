import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({ wrapper: { width: '360px' } });

export const ProfileCardWrapper = ({
	children,
	testId,
}: {
	children: React.ReactNode;
	testId?: string;
}): React.JSX.Element => {
	return (
		<Box xcss={styles.wrapper} testId={testId}>
			{children}
		</Box>
	);
};
