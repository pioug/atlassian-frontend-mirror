/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent, type MouseEvent, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap, cx, jsx } from '@atlaskit/css';
import StarIconMigration from '@atlaskit/icon/core/migration/star-starred--star-filled';
import StarUnstarredIconMigration from '@atlaskit/icon/core/migration/star-unstarred--star';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import messages from './messages';

const styles = cssMap({
	pressableStarIcon: {
		backgroundColor: 'transparent',
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		height: '24px',
		width: '24px',
	},

	hidden: {
		opacity: 0,
	},
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
			xcss={cx(styles.pressableStarIcon, !visible && styles.hidden)}
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
