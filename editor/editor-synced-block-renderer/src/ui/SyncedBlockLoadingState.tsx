import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		minHeight: '64px',
		border: `${token('border.width')} solid ${token('color.border')}`,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: token('radius.small'),
	},
});

export const SyncedBlockLoadingState = (): React.JSX.Element => {
	return (
		<Box xcss={styles.wrapper}>
			<Spinner size="small" label="Loading synced content" />
		</Box>
	);
};
