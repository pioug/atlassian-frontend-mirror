import { type MediaType, type ImageResizeMode, type Identifier } from '@atlaskit/media-client';
import { type CardPreview } from '../../../types';

export type ImageRendererProps = {
	readonly cardPreview?: CardPreview;
	readonly mediaType: MediaType;
	readonly alt?: string;
	readonly resizeMode?: ImageResizeMode;
	readonly onDisplayImage?: () => void;
	readonly onImageError?: (cardPreview: CardPreview) => void;
	readonly onImageLoad?: (cardPreview: CardPreview) => void;
	readonly nativeLazyLoad?: boolean;
	readonly forceSyncDisplay?: boolean;
	readonly wrapperRef: React.RefObject<HTMLDivElement>;
	readonly identifier: Identifier;
	readonly useWhiteBackground?: boolean;
	// Overrides the background color of the rendered <img>. Applied as an inline style for both
	// SVG and raster media. When set on an SVG, callers should also pass useWhiteBackground={false}
	// so the default white background CSS class does not override the inline value.
	readonly backgroundColor?: React.CSSProperties['backgroundColor'];
	readonly testId?: string;
};
