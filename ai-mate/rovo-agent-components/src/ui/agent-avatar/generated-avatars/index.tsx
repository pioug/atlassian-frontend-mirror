import React, { lazy, Suspense } from 'react';

import { AVATAR_SIZES, type SizeType } from '@atlaskit/avatar';
import { Box, xcss } from '@atlaskit/primitives';

const AutoDevAvatar = lazy(
	() => import(/* webpackChunkName: "@atlaskit-rovo-avatar-AutoDevAvatar"*/ './assets/auto-dev'),
);

const AutoFixAvatar = lazy(
	() => import(/* webpackChunkName: "@atlaskit-rovo-avatar-AutoFixAvatar"*/ './assets/auto-fix'),
);
const AutoReviewAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-AutoReviewAvatar"*/ './assets/auto-review'),
);
const BacklogBuddyAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-BacklogBuddyAvatar"*/ './assets/backlog-buddy'
		),
);
const CommsCrafterAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-CommsCrafterAvatar"*/ './assets/comms-crafter'
		),
);
const CultureAvatar = lazy(
	() => import(/* webpackChunkName: "@atlaskit-rovo-avatar-CultureAvatar"*/ './assets/culture'),
);
const CustomerInsightAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-CustomerInsightAvatar"*/ './assets/customer-insight'
		),
);
const DecisionDirectorAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-DecisionDirectorAvatar"*/ './assets/decision-director'
		),
);
const FeatureFlagAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-FeatureFlagAvatar"*/ './assets/feature-flag-avatar'
		),
);
const GenericAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-GenericAvatar"*/ './assets/generic-avatar'),
);
const HireWriterAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-HireWriterAvatar"*/ './assets/hire-writer'),
);
const MarketingMessageMaestroAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-MarketingMessageMaestroAvatar"*/ './assets/marketing-message-maestro'
		),
);
const MyUserManualAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-MyUserManualAvatar"*/ './assets/my-user-manual'
		),
);
const OkrOracleAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-OkrOracleAvatar"*/ './assets/okr-oracle'),
);
const OpsAgentAvatar = lazy(
	() => import(/* webpackChunkName: "@atlaskit-rovo-avatar-OpsAgentAvatar"*/ './assets/ops-agent'),
);
const PitchPerfectorAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-PitchPerfectorAvatar"*/ './assets/pitch-perfector'
		),
);
const ProductRequirementAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-ProductRequirementAvatar"*/ './assets/product-requirement'
		),
);
const ReleaseNotesAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-ReleaseNotesAvatar"*/ './assets/release-notes'
		),
);
const ResearchScoutAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-ResearchScoutAvatar"*/ './assets/research-scout'
		),
);
const SocialMediaScribeAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-SocialMediaScribeAvatar"*/ './assets/social-media-scribe'
		),
);
const TeamConnectionAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-TeamConnectionAvatar"*/ './assets/team-connection'
		),
);

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
	agentIdentityAccountId?: string | null | undefined;
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

/**
 * agentIdentityAccountId examples:
 * 5b985e7c96cb052b5f65c830
 * 712020:19e57f67-c132-462b-8503-0c19953122cd
 *
 * agentId examples:
 * cd002f25-46e4-4023-80ff-32e4d90849b4
 */
export const getNumberIdForAvatar = ({
	agentIdentityAccountId,
	agentId,
}: Pick<GeneratedAvatarProps, 'agentIdentityAccountId' | 'agentId'>): number | null => {
	// we prioritise agentIdentityAccountId first if it is available
	// this is because agentIdentityAccountId is more widely available (e.g. in ProfilePage)
	const idForAgentAvatar = agentIdentityAccountId || agentId;

	if (idForAgentAvatar) {
		// Take the last 8 characters of the id because JS can't handle 16 digit numbers
		const trimmedId = idForAgentAvatar.slice(-8).replace(/[-:]/g, '');

		const parsedId = parseInt(trimmedId, 16);
		if (isNaN(parsedId)) {
			return 0;
		} else {
			return parsedId;
		}
	}

	return null;
};

const getAvatarRender = ({
	agentNamedId,
	agentId,
	agentIdentityAccountId,
	size,
}: GeneratedAvatarProps) => {
	if (typeof agentNamedId === 'string' && outOfTheBoxAgentAvatar[agentNamedId]) {
		const ootbAvatarResult = outOfTheBoxAgentAvatar[agentNamedId];

		return {
			render: ootbAvatarResult.getRender(size),
			color: ootbAvatarResult.color,
		};
	}

	const numberId = getNumberIdForAvatar({ agentIdentityAccountId, agentId });

	if (numberId !== null) {
		/**
		 * this create all possible combinations of avatars and colors
		 * e.g. [[avatar1, color1], [avatar1, color2], [avatar2, color1], [avatar2, color2]]
		 * then choose 1 based on agentId
		 */
		const totalCombinations = avatarList.length * colorList.length;
		const combinationIndex = numberId % totalCombinations;

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
	agentIdentityAccountId,
	height,
}: Pick<GeneratedAvatarProps, 'agentId' | 'agentNamedId' | 'agentIdentityAccountId'> & {
	height: number;
}) => {
	const { color } = getAvatarRender({
		agentNamedId,
		agentId,
		agentIdentityAccountId,
		size: 'medium',
	});

	return (
		<Box xcss={bannerStyles} style={{ backgroundColor: color.primary, height: `${height}px` }} />
	);
};

export const GeneratedAvatar = (props: GeneratedAvatarProps) => {
	const { render, color } = getAvatarRender(props);

	return (
		<Box
			xcss={imageStyles}
			style={{
				backgroundColor: color.primary,
			}}
		>
			<Suspense fallback={null}>{render}</Suspense>
		</Box>
	);
};
