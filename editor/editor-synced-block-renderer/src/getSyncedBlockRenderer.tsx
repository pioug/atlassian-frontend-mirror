import React from 'react';

import { SyncedBlockRenderer, type SyncedBlockRendererProps } from './ui/SyncedBlockRenderer';

export const getSyncedBlockRenderer = ({
	syncBlockRendererDataProviders,
	useFetchSyncBlockData,
}: SyncedBlockRendererProps): React.JSX.Element => {
	return (
		<SyncedBlockRenderer
			syncBlockRendererDataProviders={syncBlockRendererDataProviders}
			useFetchSyncBlockData={useFetchSyncBlockData}
		/>
	);
};
