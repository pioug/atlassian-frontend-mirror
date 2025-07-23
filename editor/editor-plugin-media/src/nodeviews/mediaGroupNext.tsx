import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { usePreviousState } from '@atlaskit/editor-common/hooks';
import { nodeViewsMessages as messages } from '@atlaskit/editor-common/media';
import type {
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import {
	isNodeSelectedOrInRange,
	SelectedState,
	setNodeSelection,
} from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import EditorCloseIcon from '@atlaskit/icon/core/migration/cross--editor-close';
import type { Identifier } from '@atlaskit/media-client';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { Filmstrip } from '@atlaskit/media-filmstrip';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import type { MediaOptions } from '../types';

import { createMediaNodeUpdater, type MediaNodeUpdater } from './mediaNodeUpdater';

const getIdentifier = (item: PMNode): Identifier => {
	if (item.attrs.type === 'external') {
		return {
			mediaItemType: 'external-image',
			dataURI: item.attrs.url,
		};
	}
	return {
		id: item.attrs.id,
		mediaItemType: 'file',
		collectionName: item.attrs.collection,
	};
};

const isNodeSelected =
	(props: { anchorPos: number; headPos: number; nodeSize: number }) =>
	(mediaItemPos: number, mediaGroupPos: number): boolean => {
		const selected = isNodeSelectedOrInRange(
			props.anchorPos,
			props.headPos,
			mediaGroupPos,
			props.nodeSize,
		);

		if (selected === SelectedState.selectedInRange) {
			return true;
		}
		if (selected === SelectedState.selectedInside && props.anchorPos === mediaItemPos) {
			return true;
		}
		return false;
	};

const prepareFilmstripItem =
	({
		allowLazyLoading,
		allowMediaInlineImages,
		enableDownloadButton,
		handleMediaNodeRemoval,
		getPos,
		intl,
		isMediaItemSelected,
		setMediaGroupNodeSelection,
		featureFlags,
	}: {
		getPos: () => number | undefined;
		allowLazyLoading: boolean | undefined;
		allowMediaInlineImages: boolean | undefined;
		enableDownloadButton: boolean | undefined;
		handleMediaNodeRemoval: (node: PMNode | undefined, getPos: () => number | undefined) => void;
		isMediaItemSelected: (mediaItemPos: number, mediaGroupPos: number) => boolean;
		setMediaGroupNodeSelection: (mediaItemPos: number) => void;
		featureFlags: MediaOptions['featureFlags'] | undefined;
	} & WrappedComponentProps) =>
	(item: PMNode, idx: number) => {
		// We declared this to get a fresh position every time
		const getNodePos = () => {
			const pos = getPos();

			if (typeof pos !== 'number') {
				// That may seems weird, but the previous type wasn't match with the real ProseMirror code. And a lot of Media API was built expecting a number
				// Because the original code would return NaN on runtime
				// We are just make it explict now.
				// We may run a deep investagation on Media code to figure out a better fix. But, for now, we want to keep the current behavior.
				// TODO: ED-13910 - prosemirror-bump leftovers
				return NaN;
			}

			return pos + idx + 1;
		};

		// Media Inline creates a floating toolbar with the same options, excludes these options if enabled
		const mediaInlineOptions = (allowMediaInline: boolean = false) => {
			if (!allowMediaInline) {
				return {
					shouldEnableDownloadButton: enableDownloadButton,
					actions: [
						{
							handler: handleMediaNodeRemoval.bind(null, undefined, getNodePos),
							icon: <EditorCloseIcon label={intl.formatMessage(messages.mediaGroupDeleteLabel)} />,
						},
					],
				};
			}
		};

		const mediaGroupPos = getPos();

		return {
			identifier: getIdentifier(item),
			isLazy: allowLazyLoading,
			selected: isMediaItemSelected(
				getNodePos(),
				typeof mediaGroupPos === 'number' ? mediaGroupPos : NaN,
			),
			onClick: () => {
				setMediaGroupNodeSelection(getNodePos());
			},
			...mediaInlineOptions(
				fg('platform_editor_remove_media_inline_feature_flag')
					? allowMediaInlineImages
					: getMediaFeatureFlag('mediaInline', featureFlags),
			),
		};
	};

/**
 * Keep returning the same ProseMirror Node, unless the node content changed.
 *
 * React uses shallow comparation with `Object.is`,
 * but that can cause multiple re-renders when the same node is given in a different instance.
 *
 * To avoid unnecessary re-renders, this hook uses the `Node.eq` from ProseMirror API to compare
 * previous and new values.
 */
const useLatestMediaGroupNode = (nextMediaNode: PMNode) => {
	const previousMediaNode = usePreviousState(nextMediaNode);
	const [mediaNode, setMediaNode] = React.useState(nextMediaNode);

	React.useEffect(() => {
		if (!previousMediaNode) {
			return;
		}

		if (!previousMediaNode.eq(nextMediaNode)) {
			setMediaNode(nextMediaNode);
		}
	}, [previousMediaNode, nextMediaNode]);

	return mediaNode;
};

const runMediaNodeUpdate = async ({
	mediaNodeUpdater,
	getPos,
	node,
	updateAttrs,
}: {
	mediaNodeUpdater: MediaNodeUpdater;
	node: PMNode;
	getPos: () => number | undefined;
	updateAttrs: boolean;
}) => {
	if (updateAttrs) {
		await mediaNodeUpdater.updateNodeAttrs(getPos);
	}

	const contextId = mediaNodeUpdater.getNodeContextId();
	if (!contextId) {
		await mediaNodeUpdater.updateNodeContextId(getPos);
	}

	const shouldNodeBeDeepCopied = await mediaNodeUpdater.shouldNodeBeDeepCopied();

	if (shouldNodeBeDeepCopied) {
		await mediaNodeUpdater.copyNodeFromPos(getPos, {
			traceId: node.attrs.__mediaTraceId,
		});
	}
};

const noop = () => {};

type MediaGroupProps = {
	forwardRef?: (ref: HTMLElement) => void;
	node: PMNode;
	view: EditorView;
	getPos: () => number | undefined;
	disabled?: boolean;
	editorViewMode?: boolean;
	allowLazyLoading?: boolean;
	mediaProvider: Promise<MediaProvider>;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	isCopyPasteEnabled?: boolean;
	// These two numbers have to be passed separately. They can technically be derived from the view, but
	// because the view is *reference* then `shouldComponentUpdate` can't identify changes from incoming props
	anchorPos: number; // This value is required so that shouldComponentUpdate can calculate correctly
	headPos: number; // This value is required so that shouldComponentUpdate can calculate correctly
	mediaOptions: MediaOptions;
} & WrappedComponentProps;

export const MediaGroupNext = injectIntl(
	React.memo((props: MediaGroupProps) => {
		const {
			mediaOptions: {
				allowLazyLoading,
				allowMediaInlineImages,
				enableDownloadButton,
				featureFlags,
			},
			intl,
			getPos,
			anchorPos,
			headPos,
			view,
			disabled,
			editorViewMode,
			mediaProvider,
			contextIdentifierProvider,
			isCopyPasteEnabled,
		} = props;
		const mediaGroupNode = useLatestMediaGroupNode(props.node);
		const mediaPluginState = useMemo(() => {
			return mediaStateKey.getState(view.state);
		}, [view.state]);
		const mediaClientConfig = mediaPluginState?.mediaClientConfig;
		const handleMediaGroupUpdate = mediaPluginState?.handleMediaGroupUpdate;

		const [viewMediaClientConfig, setViewMediaClientConfig] = useState<
			MediaClientConfig | undefined
		>(undefined);
		const nodeSize = mediaGroupNode.nodeSize;

		const mediaNodesWithOffsets: Array<{ node: PMNode; offset: number }> = useMemo(() => {
			const result: Array<{ node: PMNode; offset: number }> = [];
			mediaGroupNode.forEach((item, childOffset) => {
				result.push({
					node: item,
					offset: childOffset,
				});
			});
			return result;
		}, [mediaGroupNode]);
		const previousMediaNodesWithOffsets = usePreviousState(mediaNodesWithOffsets);

		const handleMediaNodeRemoval = useMemo(() => {
			return disabled || !mediaPluginState ? noop : mediaPluginState.handleMediaNodeRemoval;
		}, [disabled, mediaPluginState]);

		const setMediaGroupNodeSelection = useCallback(
			(pos: number) => {
				setNodeSelection(view, pos);
			},
			[view],
		);
		const isMediaItemSelected = useMemo(() => {
			return isNodeSelected({
				anchorPos,
				headPos,
				nodeSize,
			});
		}, [anchorPos, headPos, nodeSize]);

		const filmstripItem = useMemo(() => {
			return prepareFilmstripItem({
				allowLazyLoading,
				allowMediaInlineImages,
				enableDownloadButton,
				handleMediaNodeRemoval,
				getPos,
				intl,
				isMediaItemSelected,
				setMediaGroupNodeSelection,
				featureFlags,
			});
		}, [
			allowLazyLoading,
			allowMediaInlineImages,
			enableDownloadButton,
			handleMediaNodeRemoval,
			getPos,
			intl,
			isMediaItemSelected,
			setMediaGroupNodeSelection,
			featureFlags,
		]);
		const items = useMemo(() => {
			return mediaNodesWithOffsets.map(({ node, offset }) => {
				return filmstripItem(node, offset);
			});
		}, [mediaNodesWithOffsets, filmstripItem]);

		useEffect(() => {
			setViewMediaClientConfig(mediaClientConfig);
		}, [mediaClientConfig]);

		useEffect(() => {
			mediaNodesWithOffsets.forEach(({ node, offset }) => {
				const mediaNodeUpdater = createMediaNodeUpdater({
					view,
					mediaProvider,
					contextIdentifierProvider,
					node,
					isMediaSingle: false,
				});

				const updateAttrs = isCopyPasteEnabled || isCopyPasteEnabled === undefined;

				runMediaNodeUpdate({
					mediaNodeUpdater,
					node,
					updateAttrs,
					getPos: () => {
						const pos = getPos();

						if (typeof pos !== 'number') {
							return undefined;
						}

						return pos + offset + 1;
					},
				});
			});
		}, [
			view,
			contextIdentifierProvider,
			getPos,
			mediaProvider,
			mediaNodesWithOffsets,
			isCopyPasteEnabled,
		]);

		useEffect(() => {
			if (!handleMediaGroupUpdate || !previousMediaNodesWithOffsets) {
				return;
			}

			const old = previousMediaNodesWithOffsets.map(({ node }) => node);
			const next = mediaNodesWithOffsets.map(({ node }) => node);

			handleMediaGroupUpdate(old, next);

			return () => {
				handleMediaGroupUpdate(next, []);
			};
		}, [handleMediaGroupUpdate, mediaNodesWithOffsets, previousMediaNodesWithOffsets]);

		return (
			<Filmstrip
				items={items}
				mediaClientConfig={viewMediaClientConfig}
				featureFlags={featureFlags}
				shouldOpenMediaViewer={
					editorViewMode && editorExperiment('platform_editor_controls', 'control')
				}
			/>
		);
	}),
);

MediaGroupNext.displayName = 'MediaGroup';
