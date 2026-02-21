import React from 'react';

import { cssMap } from '@atlaskit/css';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';

const styles = cssMap({
	wrapper: {
		minHeight: '64px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export const SyncedBlockLoadingState = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides
		<div className={SyncBlockSharedCssClassName.loading}>
			<Box xcss={styles.wrapper}>
				<Spinner size="small" label="Loading synced content" />
			</Box>
		</div>
	);
};
