import React, { type KeyboardEvent, type MouseEvent, useState } from 'react';

import { useIntl } from 'react-intl-next';

import StarIconMigration from '@atlaskit/icon/core/migration/star-starred--star-filled';
import StarUnstarredIconMigration from '@atlaskit/icon/core/migration/star-unstarred--star';
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
				<StarIconMigration
					LEGACY_size="medium"
					spacing="spacious"
					label={formatMessage(messages.removeFromFavouritesLabel)}
					color={token('color.icon.accent.orange')}
				/>
			) : (
				<StarUnstarredIconMigration
					LEGACY_size="medium"
					spacing="spacious"
					label={formatMessage(messages.clickToFavouriteLabel)}
					color={token('color.icon')}
				/>
			)}
		</Pressable>
	);
};
