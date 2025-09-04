/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import PersonIcon from '@atlaskit/icon/core/migration/person';
import ReleaseIcon from '@atlaskit/icon/core/migration/release--ship';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type AppearanceType, type SizeType } from '../types';

interface AvatarImageProps {
	appearance: AppearanceType;
	size: SizeType;
	alt?: string;
	src?: string;
	testId?: string;
	imgLoading?: 'lazy' | 'eager';
}

const styles = cssMap({
	image: {
		display: 'flex',
		width: '100%',
		height: '100%',
		flex: '1 1 100%',
	},
	icon: {
		display: 'flex',
		width: '100%',
		height: '100%',
	},
	iconBg: {
		backgroundColor: token('color.icon.subtle', '#8993A4'),
	},
	iconBGVisualRefresh: {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	circle: {
		borderRadius: token('radius.full'),
	},
});

const borderRadiusMap = cssMap({
	xsmall: {
		borderRadius: token('radius.xsmall'),
	},
	small: {
		borderRadius: token('radius.xsmall'),
	},
	medium: {
		borderRadius: token('radius.small', '3px'),
	},
	large: {
		borderRadius: token('radius.small', '3px'),
	},
	xlarge: {
		borderRadius: token('radius.medium'),
	},
	xxlarge: {
		borderRadius: token('radius.xlarge'),
	},
});

const nestedSvgStylesMap = cssMap({
	xsmall: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': {
			width: '16px',
			height: '16px',
		},
	},
	small: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': {
			width: '24px',
			height: '24px',
		},
	},
	medium: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': {
			width: '32px',
			height: '32px',
		},
	},
	large: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': {
			width: '40px',
			height: '40px',
		},
	},
	xlarge: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': {
			width: '96px',
			height: '96px',
		},
	},
	xxlarge: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': {
			width: '128px',
			height: '128px',
		},
	},
});

/**
 * __Avatar image__
 *
 * An avatar image is an internal component used to control the rendering phases of an image.
 */
const AvatarImage: FC<AvatarImageProps> = ({
	alt = '',
	src,
	appearance,
	size,
	testId,
	imgLoading,
}) => {
	const [hasImageErrored, setHasImageErrored] = useState(false);

	// If src changes, reset state
	useEffect(() => {
		setHasImageErrored(false);
	}, [src]);

	if (!src || hasImageErrored) {
		return (
			<span
				css={[
					styles.icon,
					fg('platform-component-visual-refresh') ? styles.iconBGVisualRefresh : styles.iconBg,
					nestedSvgStylesMap[size],
				]}
			>
				{appearance === 'circle' ? (
					<PersonIcon
						label={alt}
						color={
							fg('platform-component-visual-refresh')
								? token('color.icon.subtle')
								: token('color.icon.inverse')
						}
						testId={testId && `${testId}--person`}
						spacing="spacious"
						LEGACY_secondaryColor={token('color.icon.subtle')}
					/>
				) : (
					<ReleaseIcon
						label={alt}
						color={
							fg('platform-component-visual-refresh')
								? token('color.icon.subtle')
								: token('color.icon.inverse')
						}
						testId={testId && `${testId}--ship`}
						spacing="spacious"
						LEGACY_secondaryColor={token('color.icon.subtle')}
					/>
				)}
			</span>
		);
	}

	return (
		<img
			loading={imgLoading}
			src={src}
			alt={alt}
			data-testid={testId && `${testId}--image`}
			css={[styles.image, borderRadiusMap[size], appearance === 'circle' && styles.circle]}
			onError={() => setHasImageErrored(true)}
			aria-hidden={!alt ? true : undefined}
			data-vc={testId ? `${testId}--image` : 'avatar-image'}
			data-ssr-placeholder-ignored
		/>
	);
};

export default AvatarImage;
