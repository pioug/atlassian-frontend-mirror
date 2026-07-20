/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent, type MouseEvent, useState } from 'react';

import { useIntl } from 'react-intl';

import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx, jsx } from '@atlaskit/css';
import StarIconMigration from '@atlaskit/icon/core/star-starred';
import StarUnstarredIconMigration from '@atlaskit/icon/core/star-unstarred';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
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
	agentName,
}: {
	isStarred: boolean;
	handleToggle: (e: MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>) => void;
	visible?: boolean;
	agentName: string;
}): JSX.Element => {
	const { formatMessage } = useIntl();
	const [isHovered, setIsHovered] = useState(false);

	if (fg('rovo_agent_star_icon_button')) {
		return (
			<Box xcss={cx(!visible && styles.hidden)}>
				<IconButton
					appearance="subtle"
					spacing="compact"
					icon={(iconProps) =>
						isStarred || isHovered ? (
							<StarIconMigration {...iconProps} color={token('color.icon.accent.orange')} />
						) : (
							<StarUnstarredIconMigration {...iconProps} color={token('color.icon')} />
						)
					}
					label={formatMessage(
						isStarred ? messages.removeFromFavouritesLabel : messages.clickToFavouriteLabel,
						{ agentName },
					)}
					onClick={handleToggle}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				/>
			</Box>
		);
	}

	return (
		<Pressable
			xcss={cx(styles.pressableStarIcon, !visible && styles.hidden)}
			onClick={handleToggle}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{isStarred || isHovered ? (
				<StarIconMigration
					spacing="spacious"
					label={formatMessage(messages.removeFromFavouritesLabel, { agentName })}
					color={token('color.icon.accent.orange')}
				/>
			) : (
				<StarUnstarredIconMigration
					spacing="spacious"
					label={formatMessage(messages.clickToFavouriteLabel, { agentName })}
					color={token('color.icon')}
				/>
			)}
		</Pressable>
	);
};
