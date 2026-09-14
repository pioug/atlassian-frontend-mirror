import React, { useCallback, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import {
	SyncBlockError,
	type SyncBlockSourceInfo,
	type SyncBlockStoreManager,
	useFetchSyncBlockData,
	useFetchSyncBlockTitle,
} from '@atlaskit/editor-synced-block-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { SyncedBlockPlugin, SyncedBlockRendererProps } from '../syncedBlockPluginType';

import { getUnpublishedSourceType } from './getUnpublishedSourceType';
import { SyncBlockLabel } from './SyncBlockLabel';

type Props = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	localId: string;
	node: PMNode;
	resourceId: string;
	syncBlockStore: SyncBlockStoreManager;
	syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
};

const SyncBlockRendererWrapperDataId = 'sync-block-plugin-renderer-wrapper';

const SyncBlockRendererWrapperComponent = ({
	syncedBlockRenderer,
	syncBlockStore,
	node,
	resourceId,
	localId,
	api,
}: Props): React.JSX.Element => {
	const isSamePageSyncEnabled = isExperimentEnabled('editor-synced-block-same-page-sync');
	const syncBlockFetchResult = useFetchSyncBlockData(
		syncBlockStore,
		resourceId,
		localId,
		api?.analytics?.actions?.fireAnalyticsEvent,
	);
	const title = useFetchSyncBlockTitle(syncBlockStore, node);

	const contentUpdatedAt = syncBlockFetchResult?.syncBlockInstance?.data?.contentUpdatedAt;
	const isUnpublishedBlock = syncBlockFetchResult.syncBlockInstance?.data?.status === 'unpublished';
	const localSameDocumentSource = isSamePageSyncEnabled
		? syncBlockFetchResult.syncBlockInstance?.localSameDocumentSource
		: undefined;
	const localSourceBlockInstanceId = localSameDocumentSource?.sourceBlockInstanceId;
	const [localSourceInfo, setLocalSourceInfo] = useState<SyncBlockSourceInfo>();
	useEffect(() => {
		let isMounted = true;
		if (!localSourceBlockInstanceId) {
			setLocalSourceInfo(undefined);
			return;
		}
		void syncBlockStore.sourceManager
			?.getSyncBlockSourceInfo(localSourceBlockInstanceId)
			.then((sourceInfo) => {
				if (isMounted) {
					setLocalSourceInfo(sourceInfo);
				}
			});
		return () => {
			isMounted = false;
		};
	}, [localSourceBlockInstanceId, syncBlockStore.sourceManager]);
	const isUnsyncedBlock =
		(isUnpublishedBlock && !localSameDocumentSource) ||
		syncBlockFetchResult?.syncBlockInstance?.error?.type === SyncBlockError.NotFound;

	// Evaluated unconditionally so the experiment exposure is tracked correctly
	// (recorded on every render, not lazily on first click).
	const isSyncBlockActivationEnabled = expValEquals(
		'platform_editor_sync_block_activation',
		'isEnabled',
		true,
	);

	// Prevent editing in the contentEditable renderer wrapper. We set
	// contentEditable="true" to enable text selection (creating an editable
	// island inside ProseMirror's contentEditable="false" nodeview wrapper),
	// but users must not be able to type into or modify the renderer content.
	const preventInput = useCallback((e: React.SyntheticEvent) => {
		e.preventDefault();
	}, []);

	// Browsers suppress link navigation on a plain click inside a
	// contentEditable region (they place the caret instead), which breaks links
	// rendered in the content — e.g. the "when the page is published" link in
	// the unpublished error card. Re-trigger navigation for _blank anchors
	// ourselves. A native listener (rather than an onClick on the div) is used
	// so we delegate link clicks without making the container itself interactive.
	const rendererRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const containerEl = rendererRef.current;
		if (!containerEl || !isSyncBlockActivationEnabled) {
			return;
		}
		const unbind = bind(containerEl, {
			type: 'click',
			listener: (e: MouseEvent) => {
				// Let the browser handle modified/non-primary clicks (open-in-new-tab,
				// etc.) natively so we don't open a second tab on top of it.
				if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
					return;
				}
				const target = e.target instanceof Element ? e.target : null;
				const anchor = target?.closest('a[href]');
				if (
					!(anchor instanceof HTMLAnchorElement) ||
					e.defaultPrevented ||
					anchor.target !== '_blank'
				) {
					return;
				}
				window.open(anchor.href, '_blank', 'noopener,noreferrer');
			},
		});
		return unbind;
	}, [isSyncBlockActivationEnabled]);

	return (
		<div>
			{/* contentEditable creates a re-editable island inside the nodeview's
			    contentEditable="false" wrapper (set by ProseMirror for nodeviews
			    without contentDOM). This enables native text selection and prevents
			    the browser from treating click-drag as a drag operation on the
			    non-editable block. */}
			<div
				ref={rendererRef}
				data-testid={SyncBlockRendererWrapperDataId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={SyncBlockSharedCssClassName.renderer}
				contentEditable
				suppressContentEditableWarning
				// Prevent the contentEditable div from being keyboard-focusable.
				// It is only used to enable text selection, not as an input target.
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={-1}
				onBeforeInput={preventInput}
				onPaste={preventInput}
				// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
				onDrop={preventInput}
			>
				{syncedBlockRenderer({
					syncBlockFetchResult,
					api,
					localId,
				})}
			</div>
			<SyncBlockLabel
				isSource={false}
				title={title}
				contentUpdatedAt={contentUpdatedAt}
				localId={localId}
				isUnsyncedBlock={isUnsyncedBlock}
				unpublishedInfo={
					localSameDocumentSource && isUnpublishedBlock
						? {
								sourceType: getUnpublishedSourceType({
									sourceAri:
										localSourceInfo?.sourceAri ??
										syncBlockFetchResult.syncBlockInstance?.data?.sourceAri,
									sourceProduct:
										localSourceInfo?.productType ?? localSameDocumentSource.sourceProduct,
								}),
								variant: 'local-reference',
							}
						: undefined
				}
			/>
		</div>
	);
};

export const SyncBlockRendererWrapper: React.MemoExoticComponent<
	({
		syncedBlockRenderer,
		syncBlockStore,
		node,
		resourceId,
		localId,
		api,
	}: Props) => React.JSX.Element
> = React.memo(SyncBlockRendererWrapperComponent);
