import React from 'react';

import { cssMap } from '@atlaskit/css';
import { RovoIcon as RovoLogoIcon } from '@atlaskit/logo';
import { Box } from '@atlaskit/primitives/compiled';

type AIChatIconProps = {
	label: string;
	testId?: string;
};

const styles = cssMap({
	small: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '12px',
		width: '12px',
	},
});

export const AIChatIcon = ({ label, testId }: AIChatIconProps) => (
	<Box xcss={styles.small}>
		<RovoLogoIcon label={label} testId={testId} size="xxsmall" />
	</Box>
);
