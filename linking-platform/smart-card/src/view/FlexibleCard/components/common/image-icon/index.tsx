import React from 'react';

import ImageLoader from 'react-render-image';

import { fg } from '@atlaskit/platform-feature-flags';

import { LoadingSkeletonNew, LoadingSkeletonOld } from '../loading-skeleton';

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
		{...(fg('platform-smart-card-icon-migration')
			? {
					loading: (
						<LoadingSkeletonNew testId={`${testId}-loading`} width={width} height={height} />
					),
					loaded: (
						<img
							src={url}
							data-testid={`${testId}-image`}
							alt=""
							style={{
								width,
								height,
							}}
						/>
					),
				}
			: {
					loading: <LoadingSkeletonOld testId={`${testId}-loading`} />,
					// eslint-disable-next-line jsx-a11y/alt-text
					loaded: <img src={url} data-testid={`${testId}-image`} />,
				})}
		errored={defaultIcon}
		onError={onError}
		onLoad={onLoad}
	/>
);

export default ImageIcon;
