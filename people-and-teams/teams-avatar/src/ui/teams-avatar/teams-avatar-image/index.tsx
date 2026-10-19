/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled/box';

import { TEAM_FALLBACK_AVATAR_DATA_URI } from './fallback/constants';
import { getTeamAvatarSrc } from './utils';

type AvatarImageProps = {
	alt?: string;
	src?: string;
	testId?: string;
	teamId?: string;
};

const avatarImageStyles = cssMap({
	image: {
		display: 'flex',
		flex: '1 1 100%',
		width: '100%',
		height: '100%',
	},
});

/**
 * __Avatar image__
 *
 * An avatar image is an internal component used to control the rendering phases of an image.
 */
export const TeamAvatarImage = ({
	alt = '',
	src,
	testId,
	teamId,
}: AvatarImageProps): JSX.Element => {
	const [hasImageErrored, setHasImageErrored] = useState(false);

	const avatarSrc = getTeamAvatarSrc(src, teamId);

	const resolvedSrc = hasImageErrored ? TEAM_FALLBACK_AVATAR_DATA_URI : avatarSrc;
	return (
		<Box
			as="img"
			src={resolvedSrc}
			alt={alt}
			testId={testId && `${testId}--image`}
			xcss={avatarImageStyles.image}
			onError={() => setHasImageErrored(true)}
		/>
	);
};
