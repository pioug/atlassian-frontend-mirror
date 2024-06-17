/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import ImageLoader from 'react-render-image';

import { type ImageIconProps } from './types';
import LoadingSkeleton from '../loading-skeleton';

const ImageIcon: React.FC<ImageIconProps> = ({ defaultIcon, testId, url, onError, onLoad }) => (
	<ImageLoader
		src={url}
		loading={<LoadingSkeleton testId={`${testId}-loading`} />}
		loaded={<img src={url} data-testid={`${testId}-image`} />}
		errored={defaultIcon}
		onError={onError}
		onLoad={onLoad}
	/>
);

export default ImageIcon;
