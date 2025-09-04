/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useState } from 'react';

import ImageLoader from 'react-render-image';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { LoadingSkeleton } from '../loading-skeleton';

import { type ImageIconProps } from './types';

const styles = cssMap({
	roundImg: {
		borderRadius: token('radius.full'),
	},
});

const ImageIcon = ({
	defaultIcon,
	testId,
	url,
	width,
	height,
	appearance = 'square',
	onError,
	onLoad,
	hideLoadingSkeleton = false,
}: ImageIconProps) => {
	const [hasImageErrored, setHasImageErrored] = useState(false);

	// If url changes, reset state
	useEffect(() => {
		setHasImageErrored(false);
	}, [url]);

	if (hasImageErrored) {
		return defaultIcon;
	}

	if (hideLoadingSkeleton) {
		return (
			<img
				src={url}
				data-testid={`${testId}-image`}
				alt=""
				style={{
					width,
					height,
				}}
				css={appearance === 'round' && styles.roundImg}
				onError={() => setHasImageErrored(true)}
			/>
		);
	} else {
		return (
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
						css={appearance === 'round' && styles.roundImg}
					/>
				}
				errored={defaultIcon}
				onError={onError}
				onLoad={onLoad}
			/>
		);
	}
};

export default ImageIcon;
