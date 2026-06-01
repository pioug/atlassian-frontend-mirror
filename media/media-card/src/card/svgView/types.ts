import { type FileIdentifier, type ImageResizeMode } from '@atlaskit/media-client';
import { type MediaCardError } from '../../errors';

export type ContentSource = 'remote' | 'local';

export type SvgViewProps = {
	readonly identifier: FileIdentifier;
	readonly resizeMode: ImageResizeMode;
	readonly onLoad?: () => void;
	readonly onError?: (error: MediaCardError) => void;
	readonly wrapperRef: React.RefObject<HTMLDivElement>;
	readonly alt?: string;
	// Overrides the default white background used to mask SVG transparency. When provided, the
	// white background CSS class is dropped and this value is applied as an inline style instead.
	readonly backgroundColor?: React.CSSProperties['backgroundColor'];
};
