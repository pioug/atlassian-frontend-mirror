import React from 'react';

import { useLiveSyncedBlockContent } from '../hooks/useLiveSyncedBlockContent';

import SyncedBlockRenderer from './SyncedBlockRenderer';

type SyncedBlockLiveView = {
	contentAri: string;
	sourceDocumentAri: string;
};

const SyncedBlockLiveView = ({ sourceDocumentAri, contentAri }: SyncedBlockLiveView) => {
	const syncedBlockContent = useLiveSyncedBlockContent({
		sourceDocumentAri,
		contentAri,
	});

	if (!syncedBlockContent) {
		return <div>Loading...</div>;
	}

	return <SyncedBlockRenderer syncedBlockContent={syncedBlockContent} />;
};

export default SyncedBlockLiveView;
