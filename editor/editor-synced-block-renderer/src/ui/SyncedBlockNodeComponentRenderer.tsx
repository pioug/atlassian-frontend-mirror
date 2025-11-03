import React, { useEffect, useState } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import { SyncBlockError, type SyncBlockInstance } from '@atlaskit/editor-synced-block-provider';
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
	props: SyncedBlockNodeProps & { dataPromise: Promise<SyncBlockInstance[]> | null },
): React.JSX.Element => {
	const [data, setData] = useState<SyncBlockInstance[] | null>(null);

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

	if (fetchResult?.error || !fetchResult?.data) {
		return (
			<SyncedBlockErrorComponent
				error={fetchResult?.error ?? SyncBlockError.Errored}
				resourceId={props.resourceId}
			/>
		);
	}

	const syncBlockDoc = {
		content: fetchResult.data.content,
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
