import React from 'react';

import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';

const SyncBlockLabelDataId = 'sync-block-label';

const SyncBlockLabelComponent = () => {
	const { formatMessage } = useIntl();
	return (
		<div
			data-testId={SyncBlockLabelDataId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className="ak-editor-sync-block__label"
		>
			{formatMessage(messages.syncedBlockLabel)}
		</div>
	);
};

export const SyncBlockLabel = React.memo(SyncBlockLabelComponent);
