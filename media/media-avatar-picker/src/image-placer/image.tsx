import React from 'react';
import { isImageRemote } from '../image-cropper/isImageRemote';
import { ImageWrapper } from './imageWrapper';
import { isSSR } from '../util';

export interface ImagePlacerImageProps {
	src?: string;
	x: number;
	y: number;
	width: number;
	height: number;
	onLoad: (imageElement: HTMLImageElement, width: number, height: number) => void;
	onError: (errorMessage: string) => void;
}

// TODO: i18n https://product-fabric.atlassian.net/browse/MS-1261
export const IMAGE_ERRORS = {
	BAD_URL: 'Invalid image url',
	LOAD_FAIL: 'Image failed to load',
};

export class ImagePlacerImage extends React.Component<ImagePlacerImageProps, {}> {
	constructor(props: ImagePlacerImageProps) {
		super(props);
		if (isSSR()) {
			return;
		}
		const { src, onError } = this.props;
		if (src !== undefined) {
			try {
				isImageRemote(src);
			} catch (e) {
				onError(IMAGE_ERRORS.BAD_URL);
			}
		}
	}

	onLoad = (e: React.SyntheticEvent<HTMLImageElement>): void => {
		const image = e.currentTarget;
		const { naturalWidth: width, naturalHeight: height } = image;
		this.props.onLoad(image, width, height);
	};

	onError = (): void => {
		this.props.onError(IMAGE_ERRORS.LOAD_FAIL);
	};

	render(): React.JSX.Element | null {
		const { src, x, y, width, height } = this.props;

		if (src) {
			try {
				const crossOrigin = isImageRemote(src) ? 'anonymous' : undefined;
				return (
					<ImageWrapper
						x={x}
						y={y}
						width={width}
						height={height}
						src={src}
						crossOrigin={crossOrigin}
						onLoad={this.onLoad}
						onError={this.onError}
						draggable={false}
					/>
				);
			} catch (e) {
				return null;
			}
		}

		return null;
	}
}
