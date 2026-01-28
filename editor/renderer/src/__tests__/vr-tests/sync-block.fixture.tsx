import React, { useMemo } from 'react';
import { createMockEnvironment } from 'relay-test-utils';
import { mockSyncedBlockProviderWithStaticData } from '@atlaskit/editor-test-helpers/sync-block-mock-providers';
import type { DocNode } from '@atlaskit/adf-schema';
import {
	getSyncBlockNodesFromDoc,
	useMemoizedSyncedBlockNodeComponent,
} from '@atlaskit/editor-synced-block-renderer';

import Renderer from '../../ui/Renderer';
import type { RendererProps } from '../../ui/renderer-props';
import { RelayEnvironmentProvider } from 'react-relay';

const mockEnvironment = createMockEnvironment();

import {
	syncBlockWithParagraphAndPanelAdf,
	syncBlockNotFoundAdf,
	syncBlockPermissionDeniedAdf,
	syncBlockGenericErrorAdf,
	syncBlockLoadingStateAdf,
	syncBlockInvalidRequestErrorAdf,
	syncBlockUnsyncNotFoundAdf,
} from './__fixtures__/sync-block.adf';
import { SyncBlockActionsProvider } from '@atlaskit/editor-common/sync-block';

const mockSourceInfo: Record<string, { title: string; url: string }> = {
	'ari:cloud:confluence:test-sync-block-not-found:page/1234/abc': {
		title: 'Test page with long title',
		url: 'https://test.atlassian.net/wiki/spaces/TEST/pages/123',
	},
	'ari:cloud:confluence:test-sync-block-not-found-unsync:page/1234/abc': {
		title: 'Test page with long title',
		url: 'https://test.atlassian.net/wiki/spaces/TEST/pages/123',
	},
};

export const SyncBlockRenderer = ({
	doc,
	mockRelayEnvironment = false,
	isNotFoundError = false,
}: {
	doc: DocNode;
	isNotFoundError?: boolean;
	mockRelayEnvironment?: boolean;
}) => {
	const syncBlockNodes = useMemo(() => getSyncBlockNodesFromDoc(doc), [doc]);
	const SyncBlockNodeComponent = useMemoizedSyncedBlockNodeComponent({
		syncBlockNodes,
		syncBlockProvider: mockSyncedBlockProviderWithStaticData,
		syncBlockRendererOptions: undefined,
	});

	const nodeComponents: RendererProps['nodeComponents'] = {
		syncBlock: SyncBlockNodeComponent,
	};
	const rendererContent = (
		<Renderer
			document={doc}
			appearance="full-width"
			adfStage={'stage0'}
			nodeComponents={nodeComponents}
		/>
	);

	if (mockRelayEnvironment) {
		return (
			<RelayEnvironmentProvider environment={mockEnvironment}>
				{rendererContent}
			</RelayEnvironmentProvider>
		);
	}

	if (isNotFoundError) {
		return (
			<SyncBlockActionsProvider
				fetchSyncBlockSourceInfo={(sourceAri: string) => {
					const sourceInfo = mockSourceInfo[sourceAri];
					return Promise.resolve(sourceInfo);
				}}
			>
				{rendererContent}
			</SyncBlockActionsProvider>
		);
	}

	return rendererContent;
};

export const SyncBlockWithParagraphAndPanelRenderer = () => {
	return <SyncBlockRenderer doc={syncBlockWithParagraphAndPanelAdf} />;
};

export const SyncBlockWithPermissionDenied = () => {
	return <SyncBlockRenderer doc={syncBlockPermissionDeniedAdf} mockRelayEnvironment={true} />;
};

export const SyncBlockNotFound = () => {
	return <SyncBlockRenderer doc={syncBlockNotFoundAdf} isNotFoundError={true} />;
};

export const SyncBlockUnsyncNotFound = () => {
	return <SyncBlockRenderer doc={syncBlockUnsyncNotFoundAdf} isNotFoundError={true} />;
};

export const SyncBlockGenericError = () => {
	return <SyncBlockRenderer doc={syncBlockGenericErrorAdf} />;
};

export const SyncBlockInvalidRequestError = () => {
	return <SyncBlockRenderer doc={syncBlockInvalidRequestErrorAdf} />;
};

export const SyncBlockLoadingState = () => {
	return <SyncBlockRenderer doc={syncBlockLoadingStateAdf} />;
};
