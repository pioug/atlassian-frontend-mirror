/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';
import { default as React, Fragment, useCallback, useContext, useMemo, useEffect } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { MediaADFAttrs, RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';

import type { MediaFeatureFlags } from '@atlaskit/media-common';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { MediaSingle as UIMediaSingle, WidthContext } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';
import type { EventHandlers, MediaSingleWidthType } from '@atlaskit/editor-common/ui';
import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import {
	akEditorFullWidthLayoutWidth,
	akEditorDefaultLayoutWidth,
	akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { AnalyticsEventPayload } from '../../../analytics/events';
import { FullPagePadding } from '../../../ui/Renderer/style';
import type { RendererAppearance } from '../../../ui/Renderer/types';
import type { MediaProps } from '../media';
import { useAnnotationRangeDispatch } from '../../../ui/annotations/contexts/AnnotationRangeContext';
import { useAnnotationHoverDispatch } from '../../../ui/annotations/contexts/AnnotationHoverContext';

export interface Props {
	allowCaptions?: boolean;
	children: React.ReactNode;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dataAttributes?: Record<string, any>;
	editorAppearance?: EditorAppearance;
	eventHandlers?: EventHandlers;
	featureFlags?: MediaFeatureFlags;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	isInsideOfBlockNode?: boolean;
	isInsideOfInlineExtension?: boolean;
	layout: MediaSingleLayout;
	rendererAppearance: RendererAppearance;
	width?: number;
	widthType?: MediaSingleWidthType;
}

interface ChildElements {
	caption: React.ReactNode;
	media: ReactElement<MediaProps & MediaADFAttrs>;
}

const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 200;

const uiMediaSingleBaseStyles = css({
	transition: 'all 0.1s linear',
});

const uiMediaSingleLayoutStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '50%',
	transform: 'translateX(-50%)',
});

const isMediaElement = (
	media: React.ReactNode,
): media is ReactElement<MediaProps & MediaADFAttrs> => {
	if (!media) {
		return false;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { nodeType, type } = (media as any).props || {};

	// Use this to perform a rough check
	// better than assume the first item in children is media
	return nodeType === 'media' || ['external', 'file', 'link'].indexOf(type) >= 0;
};

const checkForMediaElement = (
	children: React.ReactNode,
): ReactElement<MediaProps & MediaADFAttrs> => {
	const [media] = React.Children.toArray(children);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (media && !isMediaElement(media) && (media as any).props.children) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return checkForMediaElement((media as any).props.children);
	}
	return media as ReactElement<MediaProps & MediaADFAttrs>;
};

// returns the existing container width if available (non SSR mode), otherwise
// we return a default width value
export const getMediaContainerWidth = (
	currentContainerWidth: number,
	layout: MediaSingleLayout,
): number => {
	if (!currentContainerWidth) {
		// SSR mode fallback to default layout width
		switch (layout) {
			case 'full-width':
				return akEditorFullWidthLayoutWidth;
			case 'wide':
				return akEditorWideLayoutWidth;
			default:
				return akEditorDefaultLayoutWidth;
		}
	}
	return currentContainerWidth;
};

const MediaSingleWithChildren = (props: Props & ChildElements & WrappedComponentProps) => {
	const {
		rendererAppearance,
		featureFlags,
		isInsideOfBlockNode,
		layout,
		width: widthAttr,
		widthType,
		allowCaptions = false,
		isInsideOfInlineExtension = false,
		dataAttributes,
		media,
		caption,
		editorAppearance,
	} = props;

	const [externalImageDimensions, setExternalImageDimensions] = React.useState({
		width: 0,
		height: 0,
	});
	const ref = React.useRef<HTMLDivElement>(null);
	const onExternalImageLoaded = React.useCallback(
		({ width, height }: { height: number; width: number }) => {
			setExternalImageDimensions({
				width,
				height,
			});
		},
		[],
	);

	// Ignored via go/ees005
	// eslint-disable-next-line prefer-const
	let { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, type } = media.props;

	if (type === 'external') {
		const { width: stateWidth, height: stateHeight } = externalImageDimensions;
		if (width === null) {
			width = stateWidth || DEFAULT_WIDTH;
		}
		if (height === null) {
			height = stateHeight || DEFAULT_HEIGHT;
		}
	}

	if (width === null) {
		width = DEFAULT_WIDTH;
		height = DEFAULT_HEIGHT;
	}

	const isFullPage = rendererAppearance === 'full-page';
	const isFullWidth = rendererAppearance === 'full-width';
	const padding = isFullPage ? FullPagePadding * 2 : 0;

	const calcDimensions = useCallback(
		(mediaContainerWidth: number) => {
			const containerWidth = getMediaContainerWidth(mediaContainerWidth, layout);
			let cardDimensions = {};
			if (fg('media-perf-uplift-mutation-fix')) {
				const maxWidth = widthAttr && typeof widthAttr === 'number' ? widthAttr : containerWidth;
				cardDimensions = {
					width: `${maxWidth}px`,
					height: `100%`,
				};
			} else {
				const maxWidth =
					isSSR() && widthAttr && typeof widthAttr === 'number'
						? Math.max(widthAttr, containerWidth)
						: containerWidth;
				const maxHeight = (height / width) * maxWidth;
				cardDimensions = {
					width: `${maxWidth}px`,
					height: `${maxHeight}px`,
				};
			}

			let nonFullWidthSize = containerWidth;
			if (!isInsideOfBlockNode && rendererAppearance !== 'comment') {
				const isContainerSizeGreaterThanMaxFullPageWidth =
					containerWidth - padding >= akEditorDefaultLayoutWidth;

				if (isContainerSizeGreaterThanMaxFullPageWidth) {
					nonFullWidthSize = akEditorDefaultLayoutWidth;
				} else {
					nonFullWidthSize = containerWidth - padding;
				}
			}
			const minWidth = Math.min(akEditorFullWidthLayoutWidth, containerWidth - padding);

			const lineLength = isFullWidth ? minWidth : nonFullWidthSize;
			return {
				cardDimensions,
				lineLength,
			};
		},
		[
			height,
			isFullWidth,
			isInsideOfBlockNode,
			layout,
			padding,
			rendererAppearance,
			width,
			widthAttr,
		],
	);

	const originalDimensions = useMemo(() => ({ width, height }), [height, width]);

	const { setHoverTarget } = useAnnotationRangeDispatch();
	const { cancelTimeout, initiateTimeout, setIsWithinRange } = useAnnotationHoverDispatch();

	const isFullPageRenderer = isFullPage || isFullWidth;

	useEffect(() => {
		const mediaSingleElement = ref.current;
		const handleMouseEnter = (event: MouseEvent) => {
			cancelTimeout();
			if (event.buttons === 0) {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				setHoverTarget && setHoverTarget(event.target as HTMLElement);
				setIsWithinRange(true);
			}
		};

		const handleMouseLeave = () => {
			initiateTimeout();
		};

		if (mediaSingleElement && isFullPageRenderer) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			mediaSingleElement.addEventListener('mouseenter', handleMouseEnter);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			mediaSingleElement.addEventListener('mouseleave', handleMouseLeave);
		}
		return () => {
			if (mediaSingleElement && isFullPageRenderer) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				mediaSingleElement.removeEventListener('mouseenter', handleMouseEnter);
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				mediaSingleElement.removeEventListener('mouseleave', handleMouseLeave);
			}
		};
	}, [setHoverTarget, isFullPageRenderer, cancelTimeout, initiateTimeout, setIsWithinRange]);

	// Note: in SSR mode the `window` object is not defined,
	// therefore width here is 0, see:
	// packages/editor/editor-common/src/ui/WidthProvider/index.tsx
	const { width: renderWidth } = useContext(WidthContext);
	const containerWidth = getMediaContainerWidth(renderWidth, layout);
	const { cardDimensions, lineLength } = useMemo(
		() => calcDimensions(containerWidth),
		[calcDimensions, containerWidth],
	);

	const renderMediaSingle = () => {
		const mediaComponent = React.cloneElement(media, {
			resizeMode: 'stretchy-fit',
			cardDimensions,
			originalDimensions,
			onExternalImageLoaded,
			disableOverlay: true,
			featureFlags,
			mediaSingleElement: ref.current,
		} as unknown as MediaProps & ImageLoaderProps);

		const uiMediaSingleStyles =
			layout === 'full-width' || layout === 'wide'
				? [uiMediaSingleBaseStyles, uiMediaSingleLayoutStyles]
				: [uiMediaSingleBaseStyles];

		return (
			<UIMediaSingle
				css={uiMediaSingleStyles}
				handleMediaSingleRef={ref}
				layout={layout}
				width={width}
				height={height}
				lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
				containerWidth={containerWidth}
				size={{
					width: widthAttr,
					widthType,
				}}
				fullWidthMode={isFullWidth}
				isInsideOfInlineExtension={isInsideOfInlineExtension}
				dataAttributes={dataAttributes}
				editorAppearance={editorAppearance}
			>
				<Fragment>{mediaComponent}</Fragment>
				{allowCaptions && caption}
			</UIMediaSingle>
		);
	};

	return renderMediaSingle();
};

const MediaSingle = (props: Props & WrappedComponentProps) => {
	const { children } = props;
	let media: ReactElement<MediaProps & MediaADFAttrs>;
	const [node, caption] = React.Children.toArray(children);

	if (!isMediaElement(node)) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const mediaElement = checkForMediaElement((node as any).props.children);
		if (!mediaElement) {
			return node as React.ReactElement<MediaProps>;
		}
		media = mediaElement;
	} else {
		media = node;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <MediaSingleWithChildren {...props} media={media} caption={caption} />;
};

export default injectIntl(MediaSingle);
