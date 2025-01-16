import React from 'react';

import ImageLoader from 'react-render-image';

import LoadingSkeleton from '../loading-skeleton';

import { type ImageIconProps } from './types';

const ImageIcon = ({ defaultIcon, testId, url, onError, onLoad }: ImageIconProps) => (
	<ImageLoader
		src={url}
		loading={<LoadingSkeleton testId={`${testId}-loading`} />}
		// eslint-disable-next-line jsx-a11y/alt-text
		loaded={<img src={url} data-testid={`${testId}-image`} />}
		errored={defaultIcon}
		onError={onError}
		onLoad={onLoad}
	/>
);

export default ImageIcon;
