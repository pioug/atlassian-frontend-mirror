/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { type SizeType } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { FallbackAvatar } from './fallback';

type AvatarImageProps = {
	size: SizeType;
	alt?: string;
	src?: string;
	testId?: string;
};

const boxShadowCssVar = '--avatar-box-shadow';
const bgColorCssVar = '--avatar-bg-color';

/**
 * We need to maintan the container styles manually until Avatar provides the correct border radius.
 * After that we can return to wrapping in <AvatarContent> rather than span
 */
const containerStyles = cssMap({
	root: {
		display: 'flex',
		position: 'static',
		alignItems: 'stretch',
		justifyContent: 'center',
		flexDirection: 'column',
		border: 'none',
		cursor: 'inherit',
		marginBlockEnd: token('space.025'),
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginInlineStart: token('space.025'),
		outline: 'none',
		overflow: 'hidden',
		paddingBlockEnd: token('space.0'),
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		transform: 'translateZ(0)',
		transition: 'transform 200ms, opacity 200ms',
		'&::after': {
			width: '100%',
			position: 'absolute',
			inset: token('space.0'),
			backgroundColor: 'transparent',
			content: "' '",
			opacity: 0,
			pointerEvents: 'none',
			transition: 'opacity 200ms',
		},
	},
	circle: {
		borderRadius: token('border.radius.circle', '50%'),
		'&::after': {
			borderRadius: token('border.radius.circle', '50%'),
		},
	},
	positionRelative: {
		position: 'relative',
	},
	disabled: {
		cursor: 'not-allowed',
		'&::after': {
			backgroundColor: token('elevation.surface', '#FFFFFF'),
			opacity: token('opacity.disabled', '0.7'),
		},
	},
});

const unboundStyles = cssMap({
	root: {
		boxSizing: 'content-box',
		backgroundColor: `var(${bgColorCssVar})`,
		boxShadow: `var(${boxShadowCssVar})`,
	},
	interactive: {
		cursor: 'pointer',
		'&:hover::after': {
			backgroundColor: token('color.interaction.hovered', 'rgba(9, 30, 66, 0.36)'),
			opacity: '1',
		},
		'&:active::after': {
			backgroundColor: token('color.interaction.pressed', 'rgba(9, 30, 66, 0.36)'),
			opacity: '1',
		},
		'@media screen and (forced-colors: active)': {
			'&:focus-visible': {
				outlineWidth: 1,
			},
		},
	},
});

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

const widthHeightMap = cssMap({
	xsmall: {
		width: '16px',
		height: '16px',
	},
	small: {
		width: '24px',
		height: '24px',
	},
	medium: {
		width: '32px',
		height: '32px',
	},
	large: {
		width: '40px',
		height: '40px',
	},
	xlarge: {
		width: '96px',
		height: '96px',
	},
	xxlarge: {
		width: '128px',
		height: '128px',
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
		<span
			css={[unboundStyles.root, containerStyles.root, borderRadiusMap[size], widthHeightMap[size]]}
			data-testid={testId}
			aria-label={alt}
		>
			<img
				src={src}
				alt={alt}
				data-testId={testId && `${testId}--image`}
				css={[avatarImageStyles.image]}
				onError={() => setHasImageErrored(true)}
			/>
		</span>
	);
};
