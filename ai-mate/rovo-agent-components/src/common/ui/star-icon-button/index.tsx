import React, { type KeyboardEvent, type MouseEvent, useState } from 'react';

import { useIntl } from 'react-intl-next';

import StarIcon from '@atlaskit/icon/core/migration/star-unstarred--star';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import { Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import messages from './messages';

const pressableStarIconStyles = xcss({
	background: 'transparent',
	padding: 'space.0',
	height: '24px',
	width: '24px',
});

const hiddenStyles = xcss({
	opacity: 0,
});

export const StarIconButton = ({
	isStarred,
	handleToggle,
	visible = true,
}: {
	isStarred: boolean;
	handleToggle: (e: MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>) => void;
	visible?: boolean;
}) => {
	const { formatMessage } = useIntl();
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Pressable
			xcss={[pressableStarIconStyles, !visible && hiddenStyles]}
			onClick={handleToggle}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{isStarred || isHovered ? (
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO: color mapping not available in new icon (https://product-fabric.atlassian.net/browse/DSP-20918)
				<StarFilledIcon
					size="medium"
					label={formatMessage(messages.removeFromFavouritesLabel)}
					primaryColor={token('color.background.accent.yellow.subtler.pressed')}
				/>
			) : (
				<StarIcon
					LEGACY_size="medium"
					spacing="spacious"
					label={formatMessage(messages.clickToFavouriteLabel)}
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- suppressed after fixing the eslint rule, as this wasn't reported before
					color={'var(--ds-text-accent-gray)'}
				/>
			)}
		</Pressable>
	);
};
