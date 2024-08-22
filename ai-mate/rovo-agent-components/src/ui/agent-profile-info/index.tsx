import React from 'react';

import { useIntl } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import StarIcon from '@atlaskit/icon/glyph/star';
import { AtlassianIcon, RovoIcon } from '@atlaskit/logo';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import Skeleton from '@atlaskit/skeleton';
import Tooltip from '@atlaskit/tooltip';

import { HiddenIcon } from '../../common/ui/hidden-icon';
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
				type: 'CUSTOMER';
				name: string;
				profileLink: string;
		  }
		| {
				type: 'SYSTEM';
		  }
		| {
				type: 'THIRD_PARTY';
				name: string;
		  };
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

		if (creator.type === 'SYSTEM') {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: (
					<Inline alignBlock="center" testId="atlassian-icon">
						<AtlassianIcon size="small" appearance="brand" />
						<Box>Atlassian</Box>
					</Inline>
				),
			});
		}

		if (creator.type === 'CUSTOMER') {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: (
					<a href={creator.profileLink} onClick={() => onCreatorLinkClick()} target="_blank">
						{creator.name}
					</a>
				),
			});
		}

		if (creator.type === 'THIRD_PARTY') {
			return formatMessage(messages.agentCreatedBy, {
				creatorNameWithLink: creator.name,
			});
		}

		return null;
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

const tooltipWrapperStyles = xcss({
	display: 'inline-flex',
	marginInline: 'space.100',
	position: 'relative',
	bottom: 'space.025',
});

const headingWrapperStyles = xcss({
	position: 'relative',
});

export const AgentProfileInfo = ({
	agentName,
	agentDescription,
	creatorRender,
	starCountRender,
	isStarred,
	isHidden,
	onStarToggle,
}: {
	agentName: string;
	agentDescription?: string | null;
	creatorRender: React.ReactNode;
	starCountRender: React.ReactNode;
	isStarred: boolean;
	isHidden: boolean;
	onStarToggle: () => void;
}) => {
	const { formatMessage } = useIntl();
	return (
		<Stack space="space.100" xcss={wrapperStyles}>
			<Inline xcss={nameStyles} space="space.100" alignBlock="center">
				<Box xcss={headingWrapperStyles}>
					<Heading as="span" size="xlarge">
						{agentName}
					</Heading>
					{isHidden && (
						<Box xcss={tooltipWrapperStyles}>
							<Tooltip content={formatMessage(messages.hiddenTooltip)} position="top">
								<HiddenIcon label={formatMessage(messages.hiddenIcon)} />
							</Tooltip>
						</Box>
					)}
				</Box>
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
