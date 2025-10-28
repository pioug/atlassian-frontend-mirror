import React from 'react';

import { SyncedBlockRenderer, type SyncedBlockRendererProps } from './ui/SyncedBlockRenderer';

export const getSyncedBlockRenderer = (props: SyncedBlockRendererProps): React.JSX.Element => {
	return <SyncedBlockRenderer useFetchSyncBlockData={props.useFetchSyncBlockData} />;
};
