import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { fg } from '@atlaskit/platform-feature-flags';
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
	const { formatMessage } = useIntl();

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides
		<div className={SyncBlockSharedCssClassName.loading}>
			<Box xcss={styles.wrapper}>
				<Spinner
					size="small"
					label={
						fg('platform_synced_block_patch_4')
							? formatMessage(messages.loadingSyncedContent)
							: 'Loading synced content'
					}
				/>
			</Box>
		</div>
	);
};
