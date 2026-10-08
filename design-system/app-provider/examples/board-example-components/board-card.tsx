/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar/avatar';
import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import PriorityMediumIcon from '@atlaskit/icon/core/priority-medium';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import StoryIcon from '@atlaskit/icon/core/story';
import Image from '@atlaskit/image/image';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import avatar1Url from '../assets/avatars/avatar-1.jpg';
import { Badge } from './badge';
import type { BoardCard } from './types';

const cardStyles = cssMap({
	card: {
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.large'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		position: 'relative',
		boxShadow: token('elevation.shadow.raised'),
		color: token('color.text'),
	},
	cardImageContainer: {
		width: '100%',
		height: '100px',
		flexShrink: 0,
		overflow: 'hidden',
	},
	cardSummary: {
		paddingBlockStart: token('space.150'),
		paddingInline: token('space.150'),
		paddingBlockEnd: token('space.0'),
	},
	cardDetails: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
		paddingBlockStart: token('space.100'),
		paddingInline: token('space.150'),
		paddingBlockEnd: token('space.150'),
	},
	cardTags: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.050'),
	},
	cardData: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.150'),
		paddingBlockStart: token('space.0'),
		paddingInline: token('space.150'),
		paddingBlockEnd: token('space.100'),
	},
	cardFooter: {
		display: 'flex',
		justifyContent: 'space-between',
		gap: token('space.200'),
	},
	cardFooterLeft: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
	},
	cardFooterRight: {
		marginInlineStart: 'auto',
	},
});

export interface BoardCardProps {
	card: BoardCard;
}

export const BoardCardComponent = ({ card }: BoardCardProps): JSX.Element => (
	<Box xcss={cardStyles.card}>
		{card.imageUrl && (
			<Box xcss={cardStyles.cardImageContainer}>
				<Image
					src={card.imageUrl}
					alt=""
					width="100%"
					height="100px"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{ objectFit: 'cover' }}
				/>
			</Box>
		)}
		<Box xcss={cardStyles.cardSummary}>
			<Text as="p" size="medium">
				{card.title}
			</Text>
		</Box>
		<Box xcss={cardStyles.cardDetails}>
			{card.label && <Badge variant="label">{card.label.text}</Badge>}
			{card.tags.length > 0 && (
				<Box xcss={cardStyles.cardTags}>
					{card.tags.map((tag) => (
						<Badge key={tag} variant="tag">
							{tag}
						</Badge>
					))}
				</Box>
			)}
			{card.dueDate && (
				<Badge variant="date" icon={<CalendarIcon label="Due date" size="small" />}>
					{card.dueDate}
				</Badge>
			)}
		</Box>
		<Box xcss={cardStyles.cardData}>
			<Box xcss={cardStyles.cardFooter}>
				<Box xcss={cardStyles.cardFooterLeft}>
					{card.assignee && <Avatar size="small" name={card.assignee} src={avatar1Url} />}
					<Inline space="space.075" alignBlock="center">
						<StoryIcon label="Story" />
						<Text size="small" color="color.text.subtle">
							{card.issueKey}
						</Text>
					</Inline>
					{card.priority && <PriorityMediumIcon label="Priority" />}
					{card.storyPoints && <Badge variant="metric">{card.storyPoints}</Badge>}
				</Box>
				<Box xcss={cardStyles.cardFooterRight}>
					<IconButton icon={ShowMoreHorizontalIcon} label="More" appearance="subtle" />
				</Box>
			</Box>
		</Box>
	</Box>
);
