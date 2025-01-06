/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useEffect, useState } from 'react';

import { css, jsx, type SerializedStyles } from '@emotion/react';

import PersonIconLegacy from '@atlaskit/icon/core/migration/person';
import ReleaseIconMigration from '@atlaskit/icon/core/migration/release--ship';
import PersonIcon from '@atlaskit/icon/core/person';
import ReleaseIcon from '@atlaskit/icon/core/release';
import { fg } from '@atlaskit/platform-feature-flags';
import { N0, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { AVATAR_RADIUS, AVATAR_SIZES } from './constants';
import { type AppearanceType, type SizeType } from './types';

interface AvatarImageProps {
	appearance: AppearanceType;
	size: SizeType;
	alt?: string;
	src?: string;
	testId?: string;
}

const avatarDefaultIconStyles = css({
	display: 'block',
	width: '100%',
	height: '100%',
	backgroundColor: token('color.icon.subtle', N90),
});

const avatarDefaultIconVisualRefreshStyles = css({
	display: 'block',
	width: '100%',
	height: '100%',
	backgroundColor: token('color.background.accent.gray.subtler'),
});

const nestedAvatarStyles = Object.entries(AVATAR_SIZES).reduce(
	(styles, [key, size]) => {
		return {
			...styles,
			[key]: css({
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 0,
				// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'& svg': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					width: `${size}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					height: `${size}px`,
				},
			}),
		};
	},
	{} as Record<SizeType, SerializedStyles>,
);

const avatarImageStyles = css({
	display: 'flex',
	width: '100%',
	height: '100%',
	flex: '1 1 100%',
});

/**
 * __Avatar image__
 *
 * An avatar image is an internal component used to control the rendering phases of an image.
 */
const AvatarImage: FC<AvatarImageProps> = ({ alt = '', src, appearance, size, testId }) => {
	const [hasImageErrored, setHasImageErrored] = useState(false);
	const borderRadius = appearance === 'circle' ? '50%' : `${AVATAR_RADIUS[size]}px`;
	const isHidden = !alt ? true : undefined;

	// If src changes, reset state
	useEffect(() => {
		setHasImageErrored(false);
	}, [src]);

	if (!src || hasImageErrored) {
		return (
			<span
				css={[
					fg('platform-component-visual-refresh')
						? avatarDefaultIconVisualRefreshStyles
						: avatarDefaultIconStyles,
					nestedAvatarStyles[size],
				]}
			>
				{appearance === 'circle' ? (
					fg('platform-component-visual-refresh') ? (
						<PersonIcon
							label={alt}
							color={token('color.icon.subtle')}
							testId={testId && `${testId}--person`}
							spacing="spacious"
						/>
					) : (
						<PersonIconLegacy
							label={alt}
							color={token('color.icon.inverse', N0)}
							LEGACY_secondaryColor={token('color.icon.subtle', N90)}
							testId={testId && `${testId}--person`}
							spacing="spacious"
						/>
					)
				) : fg('platform-component-visual-refresh') ? (
					<ReleaseIcon
						label={alt}
						color={token('color.icon.subtle')}
						testId={testId && `${testId}--ship`}
						spacing="spacious"
					/>
				) : (
					<ReleaseIconMigration
						label={alt}
						color={token('color.icon.inverse', N0)}
						LEGACY_secondaryColor={token('color.icon.subtle', N90)}
						testId={testId && `${testId}--ship`}
						spacing="spacious"
					/>
				)}
			</span>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			data-testid={testId && `${testId}--image`}
			css={avatarImageStyles}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				borderRadius: borderRadius,
			}}
			onError={() => setHasImageErrored(true)}
			aria-hidden={isHidden}
			data-vc={testId ? `${testId}--image` : 'avatar-image'}
			data-ssr-placeholder-ignored
		/>
	);
};

export default AvatarImage;
