import React, { useEffect, useState } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import {
	SyncBlockStatus,
	type FetchSyncBlockDataResult,
} from '@atlaskit/editor-synced-block-provider';
import { ReactRenderer, type NodeProps } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

import { SyncedBlockErrorComponent } from './SyncedBlockErrorComponent';
import { SyncedBlockLoadingState } from './SyncedBlockLoadingState';

export interface SyncedBlockProps {
	localId?: string;
	resourceId?: string;
}

export type SyncedBlockNodeProps = NodeProps<SyncedBlockProps>;

export const SyncedBlockNodeComponentRenderer = (
	props: SyncedBlockNodeProps & { dataPromise: Promise<FetchSyncBlockDataResult[]> | null },
): React.JSX.Element => {
	const [data, setData] = useState<FetchSyncBlockDataResult[] | null>(null);

	useEffect(() => {
		if (!props.dataPromise) {
			return;
		}
		if (data) {
			return;
		}
		props.dataPromise.then((data) => {
			setData(data);
		});
	}, [props.dataPromise, data]);

	if (!data) {
		return <SyncedBlockLoadingState />;
	}

	const fetchResult = data.find((item) => item.resourceId === props.resourceId);

	if (!fetchResult) {
		return <SyncedBlockErrorComponent status={SyncBlockStatus.Errored} />;
	}
	if ('status' in fetchResult) {
		return <SyncedBlockErrorComponent status={fetchResult.status} />;
	}

	const syncBlockData = fetchResult;
	const syncBlockDoc = {
		content: syncBlockData.content,
		version: 1,
		type: 'doc',
	} as DocNode;

	return (
		<RendererActionsContext>
			<div
				data-sync-block
				data-testid="sync-block-renderer-wrapper"
				data-resource-id={props.resourceId}
				data-local-id={props.localId}
			>
				<ReactRenderer
					appearance="full-width"
					adfStage="stage0"
					document={syncBlockDoc}
					disableHeadingIDs={true}
					dataProviders={props.providers}
				/>
			</div>
		</RendererActionsContext>
	);
};
