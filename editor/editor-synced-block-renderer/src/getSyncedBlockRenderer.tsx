import React from 'react';

import type { SyncedBlockRendererProps } from '@atlaskit/editor-plugin-synced-block';

import type { SyncedBlockRendererOptions } from './types';
import { SyncedBlockRenderer } from './ui/SyncedBlockRenderer';

type GetSyncedBlockRendererProps = {
	getAccountId?: () => string | null;
	syncBlockRendererOptions: SyncedBlockRendererOptions | undefined;
};

// For rendering reference synced block nodes in Editor
export const getSyncedBlockRenderer =
	({ syncBlockRendererOptions, getAccountId }: GetSyncedBlockRendererProps) =>
	({ syncBlockFetchResult, api }: SyncedBlockRendererProps): React.JSX.Element => {
		return (
			<SyncedBlockRenderer
				syncBlockRendererOptions={syncBlockRendererOptions}
				syncBlockFetchResult={syncBlockFetchResult}
				api={api}
				getAccountId={getAccountId}
			/>
		);
	};
