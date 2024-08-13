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
import { GenericAvatar } from './assets/generic-avatar';
import { HireWriterAvatar } from './assets/hire-writer';
import { MarketingMessageMaestroAvatar } from './assets/marketing-message-maestro';
import { MyUserManualAvatar } from './assets/my-user-manual';
import { OkrOracleAvatar } from './assets/okr-oracle';
import { OpsAgentAvatar } from './assets/ops-agent';
import { PitchPerfectorAvatar } from './assets/pitch-perfector';
import { ProductRequirementAvatar } from './assets/product-requirement';
import { ReleaseNotesAvatar } from './assets/release-notes';
import { ResearchScoutAvatar } from './assets/research-scout';
import { SocialMediaScribeAvatar } from './assets/social-media-scribe';
import { TeamConnectionAvatar } from './assets/team-connection';

type Color = {
	primary: string;
	secondary: string;
};

const yellowColor = { primary: '#FCA700', secondary: '#FFC716' };
const purpleColor = { primary: '#BF63F3', secondary: '#D8A0F7' };
const greenColor = { primary: '#82B536', secondary: '#B3DF72' };
const blueColor = { primary: '#357DE8', secondary: '#669DF1' };

const colorList: Color[] = [yellowColor, purpleColor, greenColor, blueColor];

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
	ProductRequirementAvatar,
];

export const TOTAL_AVATAR_COMBINATIONS = avatarList.length * colorList.length;

type GeneratedAvatarProps = {
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

const outOfTheBoxAgentAvatar: {
	[key: string]: { getRender: (size: SizeType) => React.ReactNode; color: Color };
} = {
	decision_director_agent: {
		getRender: (size: SizeType) => (
			<DecisionDirectorAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={greenColor.primary}
				secondaryColor={greenColor.secondary}
			/>
		),
		color: greenColor,
	},
	user_manual_writer_agent: {
		getRender: (size: SizeType) => (
			<MyUserManualAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={yellowColor.primary}
				secondaryColor={yellowColor.secondary}
			/>
		),
		color: yellowColor,
	},
	product_requirements_expert_agent: {
		getRender: (size: SizeType) => (
			<ProductRequirementAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={yellowColor.primary}
				secondaryColor={yellowColor.secondary}
			/>
		),
		color: yellowColor,
	},
};

const getAvatarRender = ({ agentNamedId, agentId, size }: GeneratedAvatarProps) => {
	if (typeof agentNamedId === 'string' && outOfTheBoxAgentAvatar[agentNamedId]) {
		const ootbAvatarResult = outOfTheBoxAgentAvatar[agentNamedId];

		return {
			render: ootbAvatarResult.getRender(size),
			color: ootbAvatarResult.color,
		};
	}

	if (agentId) {
		// Take the last 8 characters of the agentId because JS can't handle 16 digit numbers
		const agentIdSubset = agentId.slice(-8).replace(/-/g, '');

		let agentIdNumber = parseInt(agentIdSubset, 16);
		if (isNaN(agentIdNumber)) {
			agentIdNumber = 0;
		}

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

	return {
		render: (
			<GenericAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={blueColor.primary}
				secondaryColor={blueColor.secondary}
			/>
		),
		color: blueColor,
	};
};

const bannerStyles = xcss({
	width: '100%',
});

export const AgentBanner = ({
	agentNamedId,
	agentId,
	height,
}: Pick<GeneratedAvatarProps, 'agentId' | 'agentNamedId'> & { height: number }) => {
	const { color } = getAvatarRender({ agentNamedId, agentId, size: 'medium' });

	return (
		<Box xcss={bannerStyles} style={{ backgroundColor: color.primary, height: `${height}px` }} />
	);
};

export const GeneratedAvatar = ({ agentNamedId, agentId, size }: GeneratedAvatarProps) => {
	const { render, color } = getAvatarRender({ agentNamedId, agentId, size });

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
