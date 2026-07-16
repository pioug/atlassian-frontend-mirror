import React, { useCallback, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	SyncBlockError,
	useFetchSyncBlockData,
	useFetchSyncBlockTitle,
} from '@atlaskit/editor-synced-block-provider';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { SyncedBlockPlugin, SyncedBlockRendererProps } from '../syncedBlockPluginType';

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
	const syncBlockFetchResult = useFetchSyncBlockData(
		syncBlockStore,
		resourceId,
		localId,
		api?.analytics?.actions?.fireAnalyticsEvent,
	);
	const title = useFetchSyncBlockTitle(syncBlockStore, node);

	const contentUpdatedAt = syncBlockFetchResult?.syncBlockInstance?.data?.contentUpdatedAt;
	const isUnpublishedBlock = syncBlockFetchResult.syncBlockInstance?.data?.status === 'unpublished';
	const isUnsyncedBlock =
		isUnpublishedBlock ||
		syncBlockFetchResult?.syncBlockInstance?.error?.type === SyncBlockError.NotFound;

	const isTextSelectionEnabled = fg('platform_synced_block_patch_14');

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
		if (!containerEl || !isTextSelectionEnabled || !isSyncBlockActivationEnabled) {
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
	}, [isTextSelectionEnabled, isSyncBlockActivationEnabled]);

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
				contentEditable={isTextSelectionEnabled || undefined}
				suppressContentEditableWarning
				// Prevent the contentEditable div from being keyboard-focusable.
				// It is only used to enable text selection, not as an input target.
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={isTextSelectionEnabled ? -1 : undefined}
				onBeforeInput={isTextSelectionEnabled ? preventInput : undefined}
				onPaste={isTextSelectionEnabled ? preventInput : undefined}
				// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
				onDrop={isTextSelectionEnabled ? preventInput : undefined}
			>
				{syncedBlockRenderer({
					syncBlockFetchResult,
					api,
				})}
			</div>
			<SyncBlockLabel
				isSource={false}
				title={title}
				contentUpdatedAt={contentUpdatedAt}
				localId={localId}
				isUnsyncedBlock={isUnsyncedBlock}
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
