import uuidV4 from 'uuid/v4';

import type { MediaAttributes, MediaInlineAttributes } from '@atlaskit/adf-schema';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@atlaskit/editor-common/media-single';
import type {
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
	FileState,
	CopySourceFile,
	CopyDestination,
	MediaClient,
} from '@atlaskit/media-client';
import {
	getAttrsFromUrl,
	isImageRepresentationReady,
	isMediaBlobUrl,
} from '@atlaskit/media-client';
import { getMediaClient } from '@atlaskit/media-client-react';
import type { MediaTraceContext } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	replaceExternalMedia,
	updateCurrentMediaNodeAttrs,
	updateMediaNodeAttrs,
} from '../pm-plugins/commands/helpers';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import { batchMediaNodeAttrsUpdate } from '../pm-plugins/utils/batchMediaNodeAttrs';
import { getIdentifier } from '../pm-plugins/utils/media-common';
import type {
	MediaOptions,
	MediaPluginState,
	getPosHandler as ProsemirrorGetPosHandler,
	SupportedMediaAttributes,
} from '../types';

type RemoteDimensions = { id: string; height: number; width: number };

export interface MediaNodeUpdaterProps {
	view: EditorView;
	node: PMNode; // assumed to be media type node (ie. child of MediaSingle, MediaGroup)
	mediaProvider?: Promise<MediaProvider>;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	isMediaSingle: boolean;
	mediaOptions?: MediaOptions;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

const isMediaTypeSupported = (type: SupportedMediaAttributes['type']) => {
	if (type) {
		return ['image', 'file'].includes(type);
	}
	return false;
};

export class MediaNodeUpdater {
	props: MediaNodeUpdaterProps;
	mediaPluginState: MediaPluginState | undefined;

	constructor(props: MediaNodeUpdaterProps) {
		this.props = props;
		this.mediaPluginState = mediaStateKey.getState(props.view.state);
	}

	setProps(newComponentProps: Partial<MediaNodeUpdaterProps>) {
		this.props = { ...this.props, ...newComponentProps };
	}

	isMediaBlobUrl(): boolean {
		const attrs = this.getAttrs();

		return !!(attrs && attrs.type === 'external' && isMediaBlobUrl(attrs.url));
	}

	// Updates the node with contextId if it doesn't have one already
	updateContextId = async () => {
		const attrs = this.getAttrs() as MediaAttributes;
		if (!attrs || (attrs && !isMediaTypeSupported(attrs.type))) {
			return;
		}

		const { id } = attrs;
		const objectId = await this.getObjectId();

		batchMediaNodeAttrsUpdate(this.props.view, {
			id: id,
			nextAttributes: {
				__contextId: objectId,
			},
		});
	};

	updateNodeContextId = async (getPos: ProsemirrorGetPosHandler) => {
		const attrs = this.getAttrs() as MediaAttributes;
		if (!attrs || (attrs && !isMediaTypeSupported(attrs.type))) {
			return;
		}

		const objectId = await this.getObjectId();

		updateCurrentMediaNodeAttrs(
			{
				__contextId: objectId,
			},
			{
				node: this.props.node,
				getPos,
			},
		)(this.props.view.state, this.props.view.dispatch);
	};

	private hasFileAttributesDefined = (attrs: SupportedMediaAttributes) => {
		return (
			attrs &&
			attrs.type === 'file' &&
			attrs.__fileName &&
			attrs.__fileMimeType &&
			attrs.__fileSize &&
			attrs.__contextId
		);
	};

	private getNewFileAttrsForNode = async () => {
		const attrs = this.getAttrs() as MediaAttributes;
		const mediaProvider = await this.props.mediaProvider;
		if (
			!mediaProvider ||
			!mediaProvider.uploadParams ||
			!attrs ||
			!isMediaTypeSupported(attrs.type) ||
			this.hasFileAttributesDefined(attrs)
		) {
			return;
		}
		const mediaClientConfig = mediaProvider.viewMediaClientConfig;
		const mediaClient = getMediaClient(mediaClientConfig);

		let fileState: FileState;
		const { id, collection: collectionName } = attrs;
		try {
			fileState = await mediaClient.file.getCurrentState(id, {
				collectionName,
			});
			if (fileState.status === 'error') {
				return;
			}
		} catch (err) {
			return;
		}

		const contextId = this.getNodeContextId() || (await this.getObjectId());
		const { name, mimeType, size } = fileState;
		const newAttrs = {
			__fileName: name,
			__fileMimeType: mimeType,
			__fileSize: size,
			__contextId: contextId,
		};

		if (!hasPrivateAttrsChanged(attrs, newAttrs)) {
			return;
		}

		return newAttrs;
	};

	updateMediaSingleFileAttrs = async () => {
		const newAttrs = await this.getNewFileAttrsForNode();
		const { id } = this.getAttrs() as MediaAttributes;

		if (id && newAttrs) {
			batchMediaNodeAttrsUpdate(this.props.view, {
				id: id,
				nextAttributes: newAttrs,
			});
		}
	};

	updateNodeAttrs = async (getPos: ProsemirrorGetPosHandler) => {
		const newAttrs = await this.getNewFileAttrsForNode();

		if (newAttrs) {
			updateCurrentMediaNodeAttrs(newAttrs, {
				node: this.props.node,
				getPos,
			})(this.props.view.state, this.props.view.dispatch);
		}
	};

	getAttrs = (): SupportedMediaAttributes | undefined => {
		const { attrs } = this.props.node;
		if (attrs) {
			return attrs as MediaAttributes | MediaInlineAttributes;
		}

		return undefined;
	};

	getObjectId = async (): Promise<string | null> => {
		const contextIdentifierProvider = await this.props.contextIdentifierProvider;

		return contextIdentifierProvider?.objectId || null;
	};

	uploadExternalMedia = async (getPos: ProsemirrorGetPosHandler) => {
		const { node, mediaOptions } = this.props;
		if (mediaOptions?.isExternalMediaUploadDisabled) {
			return;
		}
		const mediaProvider = await this.props.mediaProvider;

		if (node && mediaProvider) {
			const uploadMediaClientConfig = mediaProvider.uploadMediaClientConfig;
			if (!uploadMediaClientConfig || !node.attrs.url) {
				return;
			}
			const mediaClient = getMediaClient(uploadMediaClientConfig);

			const collection = mediaProvider.uploadParams && mediaProvider.uploadParams.collection;

			try {
				const uploader = await mediaClient.file.uploadExternal(node.attrs.url, collection);

				const { uploadableFileUpfrontIds, dimensions } = uploader;
				const pos = getPos();

				if (typeof pos !== 'number') {
					return;
				}

				replaceExternalMedia(pos + 1, {
					id: uploadableFileUpfrontIds.id,
					collection,
					height: dimensions.height,
					width: dimensions.width,
					occurrenceKey: uploadableFileUpfrontIds.occurrenceKey,
				})(this.props.view.state, this.props.view.dispatch);
			} catch (e) {
				//keep it as external media
				if (this.props.dispatchAnalyticsEvent) {
					this.props.dispatchAnalyticsEvent({
						action: ACTION.UPLOAD_EXTERNAL_FAIL,
						actionSubject: ACTION_SUBJECT.EDITOR,
						eventType: EVENT_TYPE.OPERATIONAL,
					});
				}
			}
		}
	};

	getNodeContextId = (): string | null => {
		const attrs = this.getAttrs() as MediaAttributes;
		if (!attrs || (attrs && !isMediaTypeSupported(attrs.type))) {
			return null;
		}

		return attrs.__contextId || null;
	};

	updateDimensions = (dimensions: RemoteDimensions) => {
		batchMediaNodeAttrsUpdate(this.props.view, {
			id: dimensions.id,
			nextAttributes: {
				height: dimensions.height,
				width: dimensions.width,
			},
		});
	};

	async getRemoteDimensions(): Promise<false | RemoteDimensions> {
		const mediaProvider = await this.props.mediaProvider;
		const { mediaOptions } = this.props;
		const attrs = this.getAttrs();
		if (!mediaProvider || !attrs) {
			return false;
		}
		const { height, width } = attrs;
		if (attrs.type === 'external' || !attrs.id) {
			return false;
		}
		const { id, collection } = attrs;
		if (height && width) {
			return false;
		}

		// can't fetch remote dimensions on mobile, so we'll default them
		if (mediaOptions && !mediaOptions.allowRemoteDimensionsFetch) {
			return {
				id,
				height: DEFAULT_IMAGE_HEIGHT,
				width: DEFAULT_IMAGE_WIDTH,
			};
		}

		const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
		const mediaClient = getMediaClient(viewMediaClientConfig);

		const currentState = await mediaClient.file.getCurrentState(id, {
			collectionName: collection,
		});

		if (!isImageRepresentationReady(currentState)) {
			return false;
		}

		const imageMetadata = await mediaClient.getImageMetadata(id, {
			collection,
		});

		if (!imageMetadata || !imageMetadata.original) {
			return false;
		}

		return {
			id,
			height: imageMetadata.original.height || DEFAULT_IMAGE_HEIGHT,
			width: imageMetadata.original.width || DEFAULT_IMAGE_WIDTH,
		};
	}

	shouldNodeBeDeepCopied = async () => {
		const scope =
			this.props.mediaOptions?.mediaShallowCopyScope ??
			this.mediaPluginState?.mediaOptions?.mediaShallowCopyScope ??
			'context';
		if (scope === 'context') {
			return await this.hasDifferentContextId();
		} else {
			const attrs = this.getAttrs();
			if (!attrs || !this.mediaPluginState) {
				return false;
			}

			const id = getIdentifier(attrs as MediaAttributes);
			const isIdentifierOutsideEditorScope = !this.mediaPluginState.isIdentifierInEditorScope(id);
			return isIdentifierOutsideEditorScope;
		}
	};

	hasDifferentContextId = async (): Promise<boolean> => {
		const nodeContextId = this.getNodeContextId();
		const currentContextId = await this.getObjectId();

		if (nodeContextId && currentContextId && nodeContextId !== currentContextId) {
			return true;
		}

		return false;
	};

	isNodeFromDifferentCollection = async (): Promise<boolean> => {
		const mediaProvider = await this.props.mediaProvider;
		if (!mediaProvider || !mediaProvider.uploadParams) {
			return false;
		}

		const currentCollectionName = mediaProvider.uploadParams.collection;
		const attrs = this.getAttrs() as MediaAttributes;
		if (!attrs || (attrs && !isMediaTypeSupported(attrs.type))) {
			return false;
		}

		const { collection: nodeCollection, __contextId } = attrs;
		const contextId = __contextId || (await this.getObjectId());

		if (contextId && currentCollectionName !== nodeCollection) {
			return true;
		}

		return false;
	};

	async handleExternalMedia(getPos: ProsemirrorGetPosHandler) {
		if (this.isMediaBlobUrl()) {
			try {
				await this.copyNodeFromBlobUrl(getPos);
			} catch (e) {
				await this.uploadExternalMedia(getPos);
			}
		} else {
			await this.uploadExternalMedia(getPos);
		}
	}

	private handleCopyFileSwitcher = async (attrs: {
		mediaClient: MediaClient;
		source: CopySourceFile;
		destination: CopyDestination;
		traceContext?: MediaTraceContext;
	}): Promise<string> => {
		const { mediaClient, source, destination, traceContext } = attrs;
		try {
			// calling copyWithToken by passing the auth providers
			const { id } = await mediaClient.file.copyFile(source, destination, undefined, traceContext);
			return id;
		} catch (err) {
			if (fg('platform_media_cross_client_copy')) {
				// calling /v2/file/copy by removing the auth tokens to make cross product copy and pastes
				const { authProvider: _sourceAP, ...copyV2Source } = source;
				const { authProvider: _destAP, ...copyV2Destination } = destination;
				const { id } = await mediaClient.file.copyFile(
					copyV2Source,
					copyV2Destination,
					undefined,
					traceContext,
				);
				return id;
			} else {
				throw err;
			}
		}
	};

	copyNodeFromBlobUrl = async (getPos: ProsemirrorGetPosHandler) => {
		const attrs = this.getAttrs();

		if (!attrs || attrs.type !== 'external') {
			return;
		}
		const { url } = attrs;
		const mediaAttrs = getAttrsFromUrl(url);
		if (!mediaAttrs) {
			return;
		}
		const mediaProvider = await this.props.mediaProvider;
		if (!mediaProvider || !mediaProvider.uploadParams) {
			return;
		}
		const currentCollectionName = mediaProvider.uploadParams.collection;
		const { contextId, id, collection, height, width, mimeType, name, size } = mediaAttrs;
		const uploadMediaClientConfig = mediaProvider.uploadMediaClientConfig;
		if (!uploadMediaClientConfig || !uploadMediaClientConfig.getAuthFromContext) {
			return;
		}
		const mediaClient = getMediaClient(uploadMediaClientConfig);
		const getAuthFromContext = uploadMediaClientConfig.getAuthFromContext;

		const mediaFileId = await this.handleCopyFileSwitcher({
			mediaClient,
			source: {
				id,
				collection,
				authProvider: () => getAuthFromContext(contextId),
			},
			destination: {
				collection: currentCollectionName,
				authProvider: uploadMediaClientConfig.authProvider,
				occurrenceKey: uuidV4(),
			},
		});

		const pos = getPos();
		if (typeof pos !== 'number') {
			return;
		}

		replaceExternalMedia(pos + 1, {
			id: mediaFileId,
			collection: currentCollectionName,
			height,
			width,
			__fileName: name,
			__fileMimeType: mimeType,
			__fileSize: size,
		})(this.props.view.state, this.props.view.dispatch);
	};

	// Copies the pasted node into the current collection using a getPos handler
	copyNodeFromPos = async (getPos: ProsemirrorGetPosHandler, traceContext?: MediaTraceContext) => {
		const attrs = this.getAttrs() as MediaAttributes;
		if (!attrs || (attrs && !isMediaTypeSupported(attrs.type))) {
			return;
		}

		const copiedAttrs = await this.copyFile(attrs.id, attrs.collection, traceContext);
		if (!copiedAttrs) {
			return;
		}

		updateCurrentMediaNodeAttrs(copiedAttrs, {
			node: this.props.node,
			getPos,
		})(this.props.view.state, this.props.view.dispatch);
	};

	// Copies the pasted node into the current collection
	copyNode = async (traceContext?: MediaTraceContext) => {
		const attrs = this.getAttrs() as MediaAttributes;
		const { view } = this.props;
		if (!attrs || (attrs && !isMediaTypeSupported(attrs.type))) {
			return;
		}

		const copiedAttrs = await this.copyFile(attrs.id, attrs.collection, traceContext);
		if (!copiedAttrs) {
			return;
		}

		updateMediaNodeAttrs(attrs.id, copiedAttrs)(view.state, view.dispatch);
	};

	private copyFile = async (
		id: string,
		collection: string, // Some consumers pass empty string eg: Jira
		traceContext?: MediaTraceContext,
	): Promise<object | undefined> => {
		const mediaProvider = await this.props.mediaProvider;
		if (!mediaProvider?.uploadParams) {
			return;
		}

		const nodeContextId = this.getNodeContextId();
		const uploadMediaClientConfig = mediaProvider.uploadMediaClientConfig;

		if (!uploadMediaClientConfig?.getAuthFromContext || !nodeContextId) {
			return;
		}

		const mediaClient = getMediaClient(uploadMediaClientConfig);

		const currentCollectionName = mediaProvider.uploadParams.collection;
		const objectId = await this.getObjectId();

		const getAuthFromContext = uploadMediaClientConfig.getAuthFromContext;

		const mediaFileId = await this.handleCopyFileSwitcher({
			mediaClient,
			source: {
				id,
				collection,
				authProvider: () => getAuthFromContext(nodeContextId),
			},
			destination: {
				collection: currentCollectionName,
				authProvider: uploadMediaClientConfig.authProvider,
				occurrenceKey: uuidV4(),
			},
			traceContext,
		});

		return {
			id: mediaFileId,
			collection: currentCollectionName,
			__contextId: objectId,
		};
	};
}

const hasPrivateAttrsChanged = (
	currentAttrs: MediaAttributes,
	newAttrs: Partial<MediaAttributes>,
): boolean => {
	return (
		currentAttrs.__fileName !== newAttrs.__fileName ||
		currentAttrs.__fileMimeType !== newAttrs.__fileMimeType ||
		currentAttrs.__fileSize !== newAttrs.__fileSize ||
		currentAttrs.__contextId !== newAttrs.__contextId
	);
};

export const createMediaNodeUpdater = (props: MediaNodeUpdaterProps) => {
	const updaterProps = {
		...props,
	};

	return new MediaNodeUpdater(updaterProps);
};
