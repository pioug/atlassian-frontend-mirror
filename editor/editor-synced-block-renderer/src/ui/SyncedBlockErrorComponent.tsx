import React from 'react';

import { SyncBlockStatus } from '@atlaskit/editor-synced-block-provider';

export const SyncedBlockErrorComponent = ({ status }: { status: SyncBlockStatus }) => {
	switch (status) {
		case SyncBlockStatus.Unauthorized:
			return <div>You don't have permission to view this sync block</div>;
		case SyncBlockStatus.NotFound:
			return <div>Sync Block Not Found</div>;
		case SyncBlockStatus.Errored:
		default:
			return <div>Something went wrong</div>;
	}
};
