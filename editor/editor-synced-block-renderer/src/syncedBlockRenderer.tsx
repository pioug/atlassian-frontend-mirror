import React, { useEffect, useState } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import {
	getDefaultSyncBlockSchema,
	type SyncBlockData,
	type SyncBlockNode,
} from '@atlaskit/editor-synced-block-provider';
import type { NodeDataProvider } from '@atlaskit/node-data-provider';
import { ReactRenderer } from '@atlaskit/renderer';
import { RendererActionsContext } from '@atlaskit/renderer/actions';

export type SyncedBlockRendererProps = {
	dataProviders?: ProviderFactory;
	useFetchDocNode: () => DocNode;
};

const SyncedBlockRenderer = ({ useFetchDocNode, dataProviders }: SyncedBlockRendererProps) => {
	const latestDocNode = useFetchDocNode();

	return (
		<RendererActionsContext>
			<div data-testid="sync-block-renderer-wrapper">
				<ReactRenderer
					appearance="full-width"
					adfStage="stage0"
					schema={getDefaultSyncBlockSchema()}
					document={latestDocNode}
					disableHeadingIDs={true}
					dataProviders={dataProviders}
				/>
			</div>
		</RendererActionsContext>
	);
};

export const getSyncedBlockRenderer = (props: SyncedBlockRendererProps): React.JSX.Element => {
	return <SyncedBlockRenderer useFetchDocNode={props.useFetchDocNode} />;
};

/**
 * From packages packages/editor/renderer/src/react/types.ts
 * Avoid importing from renderer package directly to avoid circular dependency
 */
export interface RendererContext {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adDoc?: any;
	containerAri?: string;
	objectAri?: string;
	schema?: Schema;
}

/**
 * This is a subset of the full NodeMeta type defined in renderer package
 * packages/editor/renderer/src/react/types.ts
 */
export interface NodeMeta {
	dataAttributes: {
		'data-renderer-start-pos': number;
	};
	localId?: string;
	marks: PMNode['marks'];
	nodeType: NodeType['name'];
	portal?: HTMLElement | undefined;
	providers?: ProviderFactory | undefined;
	rendererContext?: RendererContext;
	resourceId?: string;
}

const SyncBlockNodeComponent = (
	props: NodeMeta & { dataPromise: Promise<SyncBlockData[]> | null },
): React.JSX.Element => {
	const [data, setData] = useState<SyncBlockData[] | null>(null);

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
		return <div>loading...</div>;
	}

	const syncBlockData = data.find((item) => item.resourceId === props.resourceId);
	if (!syncBlockData?.content) {
		return <div>Sync block not found</div>;
	}

	const syncBlockDoc = { ...syncBlockData.content, version: 1 } as DocNode;

	return (
		<div data-testid="sync-block-renderer-wrapper">
			<ReactRenderer
				appearance="full-width"
				adfStage="stage0"
				schema={getDefaultSyncBlockSchema()}
				document={syncBlockDoc}
				disableHeadingIDs={true}
				dataProviders={props.providers}
			/>
		</div>
	);
};

export const getSyncBlockNodeComponent = (
	dataProvider: NodeDataProvider<SyncBlockNode, SyncBlockData>,
	doc: DocNode,
) => {
	const { content } = doc;
	const isEmpty = !content || !Array.isArray(content) || content.length === 0;
	const syncBlockNodes = isEmpty
		? []
		: content.filter((node: JSONNode) => node.type === 'syncBlock');

	const dataPromise = dataProvider.fetchNodesData(syncBlockNodes as SyncBlockNode[]);

	return (props: NodeMeta) => SyncBlockNodeComponent({ ...props, dataPromise });
};
