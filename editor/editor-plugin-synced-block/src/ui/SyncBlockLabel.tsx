import React from 'react';

import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SyncBlockLabelSharedCssClassName } from '@atlaskit/editor-common/sync-block';

const SyncBlockLabelDataId = 'sync-block-label';

const SyncBlockLabelComponent = () => {
	const { formatMessage } = useIntl();
	return (
		<div
			data-testid={SyncBlockLabelDataId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={SyncBlockLabelSharedCssClassName.labelClassName}
		>
			{formatMessage(messages.syncedBlockLabel)}
		</div>
	);
};

export const SyncBlockLabel = React.memo(SyncBlockLabelComponent);
