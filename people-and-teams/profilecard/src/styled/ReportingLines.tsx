import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	reportingLinesSection: {
		marginLeft: token('space.050'),
		marginTop: token('space.100'),
	},
	managerSection: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: token('space.050'),
		marginTop: token('space.050'),
		marginBottom: token('space.050'),
		marginRight: token('space.050'),
	},
	managerName: {
		font: token('font.body.small'),
		marginLeft: token('space.100'),
	},
	offsetWrapper: {
		marginTop: token('space.050'),
		marginLeft: token('space.negative.050'),
	},
});

export const ReportingLinesSection = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => <Box xcss={cx(styles.reportingLinesSection)}>{children}</Box>;

export const ManagerSection = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.managerSection)}>{children}</Box>
);

export const ManagerName = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.managerName)}>{children}</Box>
);

export const OffsetWrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.offsetWrapper)}>{children}</Box>
);
