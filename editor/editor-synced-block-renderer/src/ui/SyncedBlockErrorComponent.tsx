import React from 'react';

import { getPageIdAndTypeFromAri, SyncBlockError } from '@atlaskit/editor-synced-block-provider';

import { SyncedBlockPermissionDenied } from './SyncedBlockPermissionDenied';

export const SyncedBlockErrorComponent = ({
	error,
	resourceId,
}: {
	error: SyncBlockError;
	resourceId?: string;
}) => {
	switch (error) {
		case SyncBlockError.Forbidden:
			if (resourceId) {
				const { id: contentId } = getPageIdAndTypeFromAri(resourceId);
				if (contentId) {
					return <SyncedBlockPermissionDenied contentId={contentId} />;
				}
			}
			return <div>Something went wrong</div>;
		case SyncBlockError.NotFound:
			return <div>Sync Block Not Found</div>;
		case SyncBlockError.Errored:
		default:
			return <div>Something went wrong</div>;
	}
};
