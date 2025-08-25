/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';
import ImageLoader from 'react-render-image';

import { token } from '@atlaskit/tokens';

import { Image } from './styled';

const styles = cssMap({
	roundedImage: {
		borderRadius: token('border.radius.circle'),
	},
});

export interface ImageIconProps {
	alt?: string;
	appearance?: 'square' | 'round';
	default?: React.ReactElement;
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
}: ImageIconProps) => {
	// TODO: do we need this?
	if (!src) {
		return defaultIcon || null;
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
		/>
	);

	return (
		<ImageLoader
			src={src}
			loading={defaultIcon}
			loaded={LoadedImageComponent}
			errored={defaultIcon}
		/>
	);
};
