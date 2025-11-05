import React from 'react';

import type { SyncedBlockRendererDataProviders } from '@atlaskit/editor-common/provider-factory';
import type { SyncedBlockRendererProps } from '@atlaskit/editor-plugin-synced-block';

import type { SyncedBlockRendererOptions } from './types';
import { SyncedBlockRenderer } from './ui/SyncedBlockRenderer';

type GetSyncedBlockRendererProps = {
	syncBlockRendererDataProviders: SyncedBlockRendererDataProviders;
	syncBlockRendererOptions: SyncedBlockRendererOptions | undefined;
};

// For rendering reference synced block nodes in Editor
export const getSyncedBlockRenderer =
	({ syncBlockRendererDataProviders, syncBlockRendererOptions }: GetSyncedBlockRendererProps) =>
	({ useFetchSyncBlockData }: SyncedBlockRendererProps): React.JSX.Element => {
		return (
			<SyncedBlockRenderer
				syncBlockRendererOptions={syncBlockRendererOptions}
				syncBlockRendererDataProviders={syncBlockRendererDataProviders}
				useFetchSyncBlockData={useFetchSyncBlockData}
			/>
		);
	};
