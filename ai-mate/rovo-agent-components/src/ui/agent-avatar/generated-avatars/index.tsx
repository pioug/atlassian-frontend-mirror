import React from 'react';

import { AVATAR_SIZES, type SizeType } from '@atlaskit/avatar';
import { Box, xcss } from '@atlaskit/primitives';

import { AutoDevAvatar } from './assets/auto-dev';
import { AutoFixAvatar } from './assets/auto-fix';
import { AutoReviewAvatar } from './assets/auto-review';
import { BacklogBuddyAvatar } from './assets/backlog-buddy';
import { CommsCrafterAvatar } from './assets/comms-crafter';
import { CultureAvatar } from './assets/culture';
import { CustomerInsightAvatar } from './assets/customer-insight';
import { DecisionDirectorAvatar } from './assets/decision-director';
import { FeatureFlagAvatar } from './assets/feature-flag-avatar';
import { HireWriterAvatar } from './assets/hire-writer';
import { MarketingMessageMaestroAvatar } from './assets/marketing-message-maestro';
import { MyUserManualAvatar } from './assets/my-user-manual';
import { OkrOracleAvatar } from './assets/okr-oracle';
import { OpsAgentAvatar } from './assets/ops-agent';
import { PitchPerfectorAvatar } from './assets/pitch-perfector';
import { ReleaseNotesAvatar } from './assets/release-notes';
import { ResearchScoutAvatar } from './assets/research-scout';
import { SocialMediaScribeAvatar } from './assets/social-media-scribe';
import { TeamConnectionAvatar } from './assets/team-connection';

const blueColor = { primary: '#357DE8', secondary: '#669DF1' };

const colorList = [
	{ primary: '#FCA700', secondary: '#FFC716' },
	{ primary: '#BF63F3', secondary: '#D8A0F7' },
	{ primary: '#82B536', secondary: '#B3DF72' },
	blueColor,
];

const avatarList = [
	CustomerInsightAvatar,
	BacklogBuddyAvatar,
	DecisionDirectorAvatar,
	CommsCrafterAvatar,
	AutoDevAvatar,
	OkrOracleAvatar,
	CultureAvatar,
	SocialMediaScribeAvatar,
	TeamConnectionAvatar,
	HireWriterAvatar,
	OpsAgentAvatar,
	ResearchScoutAvatar,
	ReleaseNotesAvatar,
	MyUserManualAvatar,
	PitchPerfectorAvatar,
	AutoDevAvatar,
	AutoFixAvatar,
	AutoReviewAvatar,
	MarketingMessageMaestroAvatar,
	FeatureFlagAvatar,
];

export const TOTAL_AVATAR_COMBINATIONS = avatarList.length * colorList.length;

type Props = {
	agentNamedId?: string;
	agentId?: string;
	size: SizeType;
};

const imageStyles = xcss({
	objectFit: 'cover',
	height: '100%',
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

export const GeneratedAvatar = ({ agentNamedId, agentId, size }: Props) => {
	const getAvatarBasedOnAgentId = () => {
		if (agentId) {
			const agentIdNumber = parseInt(agentId.replace(/-/g, ''), 16);
			/**
			 * this create all possible combinations of avatars and colors
			 * e.g. [[avatar1, color1], [avatar1, color2], [avatar2, color1], [avatar2, color2]]
			 * then choose 1 based on agentId
			 */
			const totalCombinations = avatarList.length * colorList.length;
			const combinationIndex = agentIdNumber % totalCombinations;

			const avatarIndex = Math.floor(combinationIndex / colorList.length);
			const colorIndex = combinationIndex % colorList.length;

			const Avatar = avatarList[avatarIndex];
			const color = colorList[colorIndex];
			return {
				render: (
					<Avatar
						size={AVATAR_SIZES[size]}
						primaryColor={color.primary}
						secondaryColor={color.secondary}
					/>
				),
				color,
			};
		}

		// TODO return default avatar
		return {
			render: null,
			color: blueColor,
		};
	};

	const { render, color } = getAvatarBasedOnAgentId();

	return (
		<Box
			xcss={imageStyles}
			style={{
				backgroundColor: color.primary,
			}}
		>
			{render}
		</Box>
	);
};
