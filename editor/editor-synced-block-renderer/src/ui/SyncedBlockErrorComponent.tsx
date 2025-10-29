import React from 'react';

import { SyncBlockError } from '@atlaskit/editor-synced-block-provider';

export const SyncedBlockErrorComponent = ({ error }: { error: SyncBlockError }) => {
	switch (error) {
		case SyncBlockError.Forbidden:
			return <div>You don't have permission to view this sync block</div>;
		case SyncBlockError.NotFound:
			return <div>Sync Block Not Found</div>;
		case SyncBlockError.Errored:
		default:
			return <div>Something went wrong</div>;
	}
};
