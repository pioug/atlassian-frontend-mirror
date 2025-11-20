import type { MediaInlineAttrs } from '@atlaskit/editor-common/media-inline';
import { MediaInlineImageCard } from '@atlaskit/editor-common/media-inline';
import type {
	ContextIdentifierProvider,
	ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { useProvider } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { InlineCardEvent } from '@atlaskit/media-card';
import { MediaInlineCard } from '@atlaskit/media-card';
import type { FileIdentifier, FileState } from '@atlaskit/media-client';
import { MediaClientContext, getMediaClient } from '@atlaskit/media-client-react';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { ClipboardAttrs } from '../../ui/MediaCard';
import { getClipboardAttrs, mediaIdentifierMap } from '../../ui/MediaCard';
import type { RendererAppearance } from '../../ui/Renderer/types';
import type { RendererContext } from '../types';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import type { MediaSSR } from '../../types/mediaOptions';
import { ErrorBoundary } from '../../ui/Renderer/ErrorBoundary';
import { ACTION_SUBJECT } from '../../analytics/enums';
import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';

type RenderMediaInlineProps = {
	children?: React.ReactNode;
	clipboardAttrs: ClipboardAttrs;
	collection?: string;
	eventHandlers?: EventHandlers;
	featureFlags?: MediaFeatureFlags;
	identifier: FileIdentifier;
	intl?: IntlShape;
	rendererAppearance?: RendererAppearance;
	rendererContext?: RendererContext;
};

type MediaInlineProps = {
	collection?: string;
	eventHandlers?: EventHandlers;
	featureFlags?: MediaFeatureFlags;
	id: string;
	marks?: Array<Mark>;
	providers: ProviderFactory;
	rendererAppearance?: RendererAppearance;
	ssr?: MediaSSR;
};

const RenderMediaInline = ({
	rendererAppearance: _rendererAppearance,
	clipboardAttrs,
	collection: collectionName,
	eventHandlers,
	identifier,
}: RenderMediaInlineProps) => {
	const [contextIdentifier, setContextIdentifier] = useState<
		ContextIdentifierProvider | undefined
	>();

	const [fileState, setFileState] = useState<FileState | undefined>();

	const mediaClient = useContext(MediaClientContext);
	const contextIdentifierProvider = useProvider('contextIdentifierProvider');

	useEffect(() => {
		if (contextIdentifierProvider) {
			contextIdentifierProvider.then((resolvedContextID) => {
				if (contextIdentifier !== resolvedContextID) {
					setContextIdentifier(resolvedContextID);
				}
			});
		}
	}, [contextIdentifier, contextIdentifierProvider]);

	const updateFileState = useCallback(
		async (id: string) => {
			const options = {
				collectionName,
			};
			try {
				if (mediaClient) {
					const fileState = await mediaClient.file.getCurrentState(id, options);
					setFileState(fileState);
				}
			} catch (error) {
				// do not set state on error
			}
		},
		[collectionName, mediaClient],
	);

	useEffect(() => {
		const { id } = identifier;
		const nodeIsInCache = id && mediaIdentifierMap.has(id);
		if (!nodeIsInCache) {
			mediaIdentifierMap.set(identifier.id as string, {
				...identifier,
				collectionName,
			});
		}
		return () => {
			mediaIdentifierMap.delete(id);
		};
	}, [identifier, collectionName]);

	useEffect(() => {
		const { id } = clipboardAttrs;
		id && updateFileState(id);
	}, [contextIdentifier, clipboardAttrs, updateFileState]);

	/*
	 * Only show the loading view if the media client is not ready
	 * prevents calling the media API before the provider is ready
	 */
	if (!mediaClient) {
		return <MediaInlineCardLoadingView message="" isSelected={false} />;
	}

	const handleMediaInlineClick = (result: InlineCardEvent) => {
		if (eventHandlers?.media?.onClick) {
			eventHandlers?.media?.onClick(result);
		}
	};

	const shouldOpenMediaViewer = true;
	const shouldDisplayToolTip = true;
	const { id, collection } = clipboardAttrs;
	return (
		// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
		<span
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...getClipboardAttrs({
				id,
				collection,
				contextIdentifierProvider: contextIdentifier,
				fileState,
			})}
			data-node-type="mediaInline"
		>
			<MediaInlineCard
				identifier={identifier}
				onClick={handleMediaInlineClick}
				shouldOpenMediaViewer={shouldOpenMediaViewer}
				shouldDisplayToolTip={shouldDisplayToolTip}
				mediaClientConfig={mediaClient.mediaClientConfig}
				mediaViewerItems={Array.from(mediaIdentifierMap.values())}
			/>
		</span>
	);
};

const MediaInline = (props: MediaInlineProps & WrappedComponentProps & MediaInlineAttrs) => {
	const {
		collection,
		id,
		intl,
		rendererAppearance,
		featureFlags,
		type: fileType,
		alt,
		width,
		height,
		marks,
		ssr,
	} = props;

	const clipboardAttrs: ClipboardAttrs = {
		id,
		collection,
	};

	const identifier: FileIdentifier = {
		id,
		mediaItemType: 'file',
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		collectionName: collection!,
	};

	const mediaClient = useContext(MediaClientContext);
	const { createAnalyticsEvent } = useAnalyticsEvents();

	if (fileType === 'image') {
		const hasLinkMark = marks?.find((mark) => mark.type.name === 'link');
		const borderMark = marks?.find((mark) => mark?.type.name === 'border');
		const borderColor = borderMark?.attrs.color ?? '';
		const borderSize = borderMark?.attrs.size ?? 0;

		return (
			<ErrorBoundary
				component={ACTION_SUBJECT.RENDERER}
				componentId={ACTION_SUBJECT_ID.MEDIA_INLINE_IMAGE}
				createAnalyticsEvent={createAnalyticsEvent}
			>
				<MediaInlineImageCard
					mediaClient={ssr?.config ? getMediaClient(ssr.config) : mediaClient}
					identifier={identifier}
					alt={alt}
					width={width}
					height={height}
					ssr={ssr}
					border={{ borderSize, borderColor }}
					serializeDataAttrs
					shouldOpenMediaViewer={!hasLinkMark}
				/>
			</ErrorBoundary>
		);
	}

	return (
		<RenderMediaInline
			identifier={identifier}
			clipboardAttrs={clipboardAttrs}
			eventHandlers={props.eventHandlers}
			rendererAppearance={rendererAppearance}
			intl={intl}
			collection={collection}
			featureFlags={featureFlags}
		/>
	);
};

export default injectIntl(MediaInline);
