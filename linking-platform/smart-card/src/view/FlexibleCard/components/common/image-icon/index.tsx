/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import ImageLoader from 'react-render-image';

import LoadingSkeleton from '../loading-skeleton';

import { type ImageIconProps } from './types';

const ImageIcon = ({ defaultIcon, testId, url, onError, onLoad }: ImageIconProps) => (
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
