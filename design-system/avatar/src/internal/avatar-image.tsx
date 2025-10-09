/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import AiAgentIcon from '@atlaskit/icon/core/ai-agent';
import PersonIcon from '@atlaskit/icon/core/migration/person';
import ReleaseIcon from '@atlaskit/icon/core/migration/release--ship';
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
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	circle: {
		borderRadius: token('radius.full'),
	},
	hexagon: {
		// NOTE: This is reused from `avatar-content.tsx`
		clipPath: `polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 92.64102% 21.33975%, 94.06889% 22.33956%, 95.30146% 23.57212%, 96.30127% 25%, 97.03794% 26.5798%, 97.48909% 28.26352%, 97.64102% 30%, 97.64102% 70%, 97.48909% 71.73648%, 97.03794% 73.4202%, 96.30127% 75%, 95.30146% 76.42788%, 94.06889% 77.66044%, 92.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 7.35898% 78.66025%, 5.93111% 77.66044%, 4.69854% 76.42788%, 3.69873% 75%, 2.96206% 73.4202%, 2.51091% 71.73648%, 2.35898% 70%, 2.35898% 30%, 2.51091% 28.26352%, 2.96206% 26.5798%, 3.69873% 25%, 4.69854% 23.57212%, 5.93111% 22.33956%, 7.35898% 21.33975%)`,
	},
});

const borderRadiusMap = cssMap({
	xsmall: { borderRadius: token('radius.xsmall') },
	small: { borderRadius: token('radius.xsmall') },
	medium: { borderRadius: token('radius.small') },
	large: { borderRadius: token('radius.small') },
	xlarge: { borderRadius: token('radius.medium') },
	xxlarge: { borderRadius: token('radius.xlarge') },
});

const nestedSvgStylesMap = cssMap({
	xsmall: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': { width: '16px', height: '16px' },
	},
	small: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': { width: '24px', height: '24px' },
	},
	medium: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': { width: '32px', height: '32px' },
	},
	large: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': { width: '40px', height: '40px' },
	},
	xlarge: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': { width: '96px', height: '96px' },
	},
	xxlarge: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& svg': { width: '128px', height: '128px' },
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
		let renderedIcon: React.JSX.Element;
		switch (appearance) {
			case 'circle':
				renderedIcon = (
					<PersonIcon
						label={alt}
						color={token('color.icon.subtle')}
						testId={testId && `${testId}--person`}
						spacing="spacious"
						LEGACY_secondaryColor={token('color.icon.subtle')}
					/>
				);
				break;
			case 'hexagon':
				renderedIcon = (
					<AiAgentIcon
						label={alt}
						color={token('color.icon.subtle')}
						testId={testId && `${testId}--agent`}
						spacing="spacious"
					/>
				);
				break;
			default: // historical default for safety
			case 'square':
				renderedIcon = (
					<ReleaseIcon
						label={alt}
						color={token('color.icon.subtle')}
						testId={testId && `${testId}--ship`}
						spacing="spacious"
						LEGACY_secondaryColor={token('color.icon.subtle')}
					/>
				);
				break;
		}

		return <span css={[styles.icon, nestedSvgStylesMap[size]]}>{renderedIcon}</span>;
	}

	return (
		<img
			loading={imgLoading}
			src={src}
			alt={alt}
			data-testid={testId && `${testId}--image`}
			css={[
				styles.image,
				borderRadiusMap[size],
				appearance === 'circle' && styles.circle,
				appearance === 'hexagon' && styles.hexagon,
			]}
			onError={() => setHasImageErrored(true)}
			aria-hidden={!alt ? true : undefined}
			data-vc={testId ? `${testId}--image` : 'avatar-image'}
			data-ssr-placeholder-ignored
		/>
	);
};

export default AvatarImage;
