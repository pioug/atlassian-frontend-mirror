import React from 'react';

import ImageLoader from 'react-render-image';

import { fg } from '@atlaskit/platform-feature-flags';

import { Image } from './styled';
import { Image as ImageOld } from './styledOld';

export interface ImageIconProps {
	alt?: string;
	size?: number;
	src?: string;
	title?: string;
	default?: React.ReactElement;
}

export const ImageIcon = ({
	alt = '',
	src,
	size = 16,
	title,
	default: defaultIcon,
}: ImageIconProps) => {
	// TODO: do we need this?
	if (!src) {
		return defaultIcon || null;
	}

	const LoadedImageComponent = fg('bandicoots-compiled-migration-smartcard') ? (
		<Image
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="smart-link-icon"
			src={src}
			alt={alt}
			size={size}
			title={title}
		/>
	) : (
		<ImageOld
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="smart-link-icon"
			src={src}
			alt={alt}
			size={size}
			title={title}
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
