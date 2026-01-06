/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import ImageLoader from 'react-render-image';

import { token } from '@atlaskit/tokens';

import { Image } from './styled';

const styles = cssMap({
	roundedImage: {
		borderRadius: token('radius.full'),
	},
});

export interface ImageIconProps {
	alt?: string;
	appearance?: 'square' | 'round';
	default?: React.ReactElement;
	hideLoadingSkeleton?: boolean;
	size?: number;
	src?: string;
	title?: string;
}

export const ImageIcon = ({
	alt = '',
	src,
	size = 16,
	title,
	default: defaultIcon,
	appearance = 'square',
	hideLoadingSkeleton,
}: ImageIconProps) => {
	const [hasImageErrored, setHasImageErrored] = useState(false);

	// If url changes, reset state
	useEffect(() => {
		setHasImageErrored(false);
	}, [src]);

	const handleError = useCallback(() => {
		setHasImageErrored(true);
	}, []);

	// TODO: do we need this?
	if (!src) {
		return defaultIcon || null;
	}

	if (hasImageErrored) {
		return defaultIcon;
	}

	const LoadedImageComponent = (
		<Image
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="smart-link-icon"
			src={src}
			alt={alt}
			size={size}
			title={title}
			css={appearance === 'round' && styles.roundedImage}
			{...(hideLoadingSkeleton ? { onError: handleError } : undefined)}
		/>
	);

	if (hideLoadingSkeleton) {
		return LoadedImageComponent;
	} else {
		return (
			<ImageLoader
				src={src}
				loading={defaultIcon}
				loaded={LoadedImageComponent}
				errored={defaultIcon}
			/>
		);
	}
};
