/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent, type MouseEvent, useState } from 'react';

import { useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import StarIconMigration from '@atlaskit/icon/core/star-starred';
import StarUnstarredIconMigration from '@atlaskit/icon/core/star-unstarred';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import messages from './messages';

const styles = cssMap({
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
};
