/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { ButtonGroup } from '@atlaskit/button';
import { cssMap, jsx } from '@atlaskit/css';
import EmojiAddIcon from '@atlaskit/icon/core/migration/emoji-add';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { ReactionsList } from '../../utils/reactions';

const styles = cssMap({
	pressable: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: '8px',
		paddingInline: token('space.100'),
		height: '27px',
		display: 'flex',
		alignItems: 'center',

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
});

type ReactionButtonProps = {
	emoji?: string;
	name?: string;
	reactions?: number;
};

const ReactionButton = ({ emoji, name, reactions }: ReactionButtonProps) => {
	return (
		<Tooltip
			content={
				name && reactions ? (
					<p>
						<strong>{name}</strong>
						<ReactionsList reactions={reactions} />
					</p>
				) : (
					'Add a reaction'
				)
			}
		>
			<Pressable xcss={styles.pressable}>
				{emoji ? (
					<Text size="small" color="color.text.subtle">
						{emoji} {reactions}
					</Text>
				) : (
					<EmojiAddIcon
						LEGACY_size="small"
						LEGACY_primaryColor={token('color.icon')}
						color={token('color.icon')}
						label=""
					/>
				)}
				<VisuallyHidden>Add a {name && `${name} `}reaction</VisuallyHidden>
			</Pressable>
		</Tooltip>
	);
};

export default function IconButtons() {
	return (
		<ButtonGroup label="Reactions">
			<ReactionButton emoji="👏" name="Clap" reactions={26} />
			<ReactionButton emoji="❤️" name="Heart" reactions={4} />
			<ReactionButton emoji="👍" name="Thumbs up" reactions={17} />
			<ReactionButton />
		</ButtonGroup>
	);
}
