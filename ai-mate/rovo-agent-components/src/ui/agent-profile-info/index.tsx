import React from 'react';

import { useIntl } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import StarIcon from '@atlaskit/icon/glyph/star';
import { AtlassianIcon, RovoIcon } from '@atlaskit/logo';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import Skeleton from '@atlaskit/skeleton';

import { StarIconButton } from '../../common/ui/star-icon-button';

import { messages } from './messages';

const clickableItemStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	gap: 'space.050',
});

const countStyles = xcss({
	fontSize: '11px',
	display: 'flex',
	alignItems: 'center',
	gap: 'space.025',
});

const nameStyles = xcss({
	justifyContent: 'space-between',
	alignItems: 'flex-start',
});

const descriptionStyles = xcss({
	marginTop: 'space.0',
	marginBottom: 'space.100',
});

export const AgentProfileCreator = ({
	creator,
	onCreatorLinkClick,
	isLoading: isLoading,
}: {
	creator?:
		| {
				name: string;
				profileLink: string;
		  }
		| 'SYSTEM';
	isLoading: boolean;
	onCreatorLinkClick: () => void;
}) => {
	const { formatMessage } = useIntl();

	const getCreatorRender = () => {
		if (isLoading) {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: (
					<Skeleton
						testId="agent-profile-creator-skeleton"
						isShimmering
						height={18}
						width={100}
						borderRadius={3}
					/>
				),
			});
		}

		if (!creator) {
			return null;
		}

		if (creator === 'SYSTEM') {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: (
					<Inline alignBlock="center" testId="atlassian-icon">
						<AtlassianIcon size="small" appearance="brand" />
						<Box>Atlassian</Box>
					</Inline>
				),
			});
		}

		return formatMessage(messages.agentCreatedBy, {
			creatorNameWithLink: (
				<a href={creator.profileLink} onClick={() => onCreatorLinkClick()} target="_blank">
					{creator.name}
				</a>
			),
		});
	};

	const creatorRender = getCreatorRender();

	return creatorRender ? (
		<Box xcss={clickableItemStyles}>
			<RovoIcon appearance="brand" size="small" />
			{creatorRender}
		</Box>
	) : null;
};

export const AgentStarCount = ({
	starCount,
	isLoading,
}: {
	starCount: number | null | undefined;
	isLoading: boolean;
}) => {
	const { formatMessage } = useIntl();

	if ((starCount === null || starCount === undefined) && !isLoading) {
		return null;
	}

	return (
		<Box xcss={countStyles}>
			<StarIcon label="" size="small" />
			{isLoading ? (
				<Skeleton
					testId="agent-profile-info-star-count-skeleton"
					isShimmering
					height={16}
					width={75}
					borderRadius={3}
				/>
			) : (
				formatMessage(messages.starredCount, { count: starCount })
			)}
		</Box>
	);
};

const wrapperStyles = xcss({
	marginBottom: 'space.100',
});

export const AgentProfileInfo = ({
	agentName,
	agentDescription,
	creatorRender,
	starCountRender,
	isStarred,
	onStarToggle,
}: {
	agentName: string;
	agentDescription?: string | null;
	creatorRender: React.ReactNode;
	starCountRender: React.ReactNode;
	isStarred: boolean;
	onStarToggle: () => void;
}) => {
	return (
		<Stack space="space.100" xcss={wrapperStyles}>
			<Inline xcss={nameStyles} space="space.100" alignBlock="center">
				<Heading size="xlarge">{agentName}</Heading>
				<StarIconButton isStarred={isStarred} handleToggle={onStarToggle} />
			</Inline>
			{creatorRender}
			{!!agentDescription && (
				<Box xcss={descriptionStyles} as="p">
					{agentDescription}
				</Box>
			)}
			{starCountRender}
		</Stack>
	);
};
