/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { AvatarContent, type SizeType } from '@atlaskit/avatar';

import { FallbackAvatar } from './fallback';

type AvatarImageProps = {
	size: SizeType;
	alt?: string;
	src?: string;
	testId?: string;
};

const avatarImageStyles = cssMap({
	image: {
		display: 'flex',
		flex: '1 1 100%',
		width: '100%',
		height: '100%',
	},
});

const SIZES: Record<SizeType, number> = {
	xsmall: 16,
	small: 24,
	medium: 32,
	large: 40,
	xlarge: 96,
	xxlarge: 128,
};

const borderRadiusMap = cssMap({
	xsmall: {
		borderRadius: '4px',
	},
	small: {
		borderRadius: '6px',
	},
	medium: {
		borderRadius: '8px',
	},
	large: {
		borderRadius: '10px',
	},
	xlarge: {
		borderRadius: '24px',
	},
	xxlarge: {
		borderRadius: '32px',
	},
});

/**
 * __Avatar image__
 *
 * An avatar image is an internal component used to control the rendering phases of an image.
 */
export const TeamAvatarImage = ({ alt = '', src, size, testId }: AvatarImageProps) => {
	const [hasImageErrored, setHasImageErrored] = useState(false);

	// If src changes, reset state
	useEffect(() => {
		setHasImageErrored(false);
	}, [src]);

	if (!src || hasImageErrored) {
		return (
			<FallbackAvatar
				aria-label={alt}
				width={SIZES[size]}
				height={SIZES[size]}
				data-testid={testId}
			/>
		);
	}

	return (
		<AvatarContent>
			<img
				src={src}
				alt={alt}
				data-testId={testId && `${testId}--image`}
				css={[avatarImageStyles.image, borderRadiusMap[size]]}
				onError={() => setHasImageErrored(true)}
			/>
		</AvatarContent>
	);
};
