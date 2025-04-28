import React from 'react';

import ImageLoader from 'react-render-image';

import { LoadingSkeleton } from '../loading-skeleton';

import { type ImageIconProps } from './types';

const ImageIcon = ({
	defaultIcon,
	testId,
	url,
	width,
	height,
	onError,
	onLoad,
}: ImageIconProps) => (
	<ImageLoader
		src={url}
		loading={<LoadingSkeleton testId={`${testId}-loading`} width={width} height={height} />}
		loaded={
			<img
				src={url}
				data-testid={`${testId}-image`}
				alt=""
				style={{
					width,
					height,
				}}
			/>
		}
		errored={defaultIcon}
		onError={onError}
		onLoad={onLoad}
	/>
);

export default ImageIcon;
