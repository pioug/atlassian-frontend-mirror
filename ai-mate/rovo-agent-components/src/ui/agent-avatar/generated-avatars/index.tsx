/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { lazy, Suspense, useEffect } from 'react';

import { AVATAR_SIZES } from '@atlaskit/avatar/avatar-sizes';
import type { SizeType } from '@atlaskit/avatar/types';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { AgentCreatorType } from '../../../common/types';

const RefreshedCustomerInsightAvatar = lazy(() => import('./refreshed-assets/customer-insight'));
const RefreshedBacklogBuddyAvatar = lazy(() => import('./refreshed-assets/backlog-buddy'));
const RefreshedDecisionDirectorAvatar = lazy(() => import('./refreshed-assets/decision-director'));
const RefreshedCommsCrafterAvatar = lazy(() => import('./refreshed-assets/comms-crafter'));
const RefreshedAutoDevAvatar = lazy(() => import('./refreshed-assets/auto-dev'));
const RefreshedOkrOracleAvatar = lazy(() => import('./refreshed-assets/okr-oracle'));
const RefreshedCultureAvatar = lazy(() => import('./refreshed-assets/culture'));
const RefreshedSocialMediaScribeAvatar = lazy(
	() => import('./refreshed-assets/social-media-scribe'),
);
const RefreshedTeamConnectionAvatar = lazy(() => import('./refreshed-assets/team-connection'));
const RefreshedHireWriterAvatar = lazy(() => import('./refreshed-assets/hire-writer'));
const RefreshedOpsAgentAvatar = lazy(() => import('./refreshed-assets/ops-agent'));
const RefreshedResearchScoutAvatar = lazy(() => import('./refreshed-assets/research-scout'));
const RefreshedReleaseNotesAvatar = lazy(() => import('./refreshed-assets/release-notes'));
const RefreshedMyUserManualAvatar = lazy(() => import('./refreshed-assets/my-user-manual'));
const RefreshedPitchPerfectorAvatar = lazy(() => import('./refreshed-assets/pitch-perfector'));
const RefreshedAutoFixAvatar = lazy(() => import('./refreshed-assets/auto-fix'));
const RefreshedAutoReviewAvatar = lazy(() => import('./refreshed-assets/auto-review'));
const RefreshedMarketingMessageMaestroAvatar = lazy(
	() => import('./refreshed-assets/marketing-message-maestro'),
);
const RefreshedFeatureFlagAvatar = lazy(() => import('./refreshed-assets/feature-flag'));
const RefreshedProductRequirementAvatar = lazy(
	() => import('./refreshed-assets/product-requirement'),
);
const RefreshedJiraCodingAgentAvatar = lazy(() => import('./refreshed-assets/jira-coding-agent'));
const RefreshedJiraIntelligentTriageAgentAvatar = lazy(
	() => import('./refreshed-assets/jira-intelligent-triage-agent'),
);
const RefreshedJiraDeliveryAgentAvatar = lazy(
	() => import('./refreshed-assets/jira-delivery-agent'),
);
const RefreshedJiraAdminAgentAvatar = lazy(() => import('./refreshed-assets/jira-admin-agent'));
const RefreshedRequestResolverAvatar = lazy(() => import('./refreshed-assets/request-resolver'));
const RefreshedOpsExpertAvatar = lazy(() => import('./refreshed-assets/ops-expert'));

const styles = cssMap({
	image: {
		objectFit: 'cover',
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	banner: {
		width: '100%',
	},

	bannerFillSpace: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},

	bannerRemoteA2A: {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
});

const Observer = ({ onLoad }: { onLoad: () => void }) => {
	useEffect(() => {
		onLoad();
	}, [onLoad]);
	return null;
};

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
const DocumentWriterAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-DocumentWriterAvatar"*/ './assets/document-writer'
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
const RovoChatAvatar = lazy(
	() => import(/* webpackChunkName: "@atlaskit-rovo-avatar-RovoChatAvatar"*/ './assets/rovo-chat'),
);
const RovoDevAvatar = lazy(
	() => import(/* webpackChunkName: "@atlaskit-rovo-avatar-RovoDevAvatar"*/ './assets/rovo-dev'),
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
const WorkflowBuilderAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-WorkflowBuilderAvatar"*/ './assets/workflow-builder'
		),
);
const TrialGuideAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-TrialGuideAvatar"*/ './assets/trial-guide'),
);

const JsmRovoServiceAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JsmRovoServiceAgentAvatar"*/ './assets/jsm-rovo-service-agent'
		),
);

const JsmRequestResolverAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JsmRequestResolverAgentAvatar"*/ './assets/jsm-request-resolver-agent'
		),
);

/**
 * OOTB Agents avatars - start
 */
const AmplitudeAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-AmplitudeAgentAvatar"*/ './assets/amplitude-agent'
		),
);

const AmplitudeAgentAvatarV2 = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-AmplitudeAgentAvatarV2" */ './assets/amplitude-agent-v2'
		),
);

const BoxAgentAvatar = lazy(
	() => import(/* webpackChunkName: "@atlaskit-rovo-avatar-BoxAgentAvatar"*/ './assets/box-agent'),
);

const CanvaAgentAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-CanvaAgentAvatar"*/ './assets/canva-agent'),
);

const FigmaAgentAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-FigmaAgentAvatar"*/ './assets/figma-agent'),
);

const HubSpotAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-HubSpotAgentAvatar"*/ './assets/hubspot-agent'
		),
);

const IntercomAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-IntercomAgentAvatar"*/ './assets/intercom-agent'
		),
);

const GammaAgentAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-GammaAgentAvatar"*/ './assets/gamma-agent'),
);

const LovableAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-LovableAgentAvatar"*/ './assets/lovable-agent'
		),
);

const ReplitAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-ReplitAgentAvatar"*/ './assets/replit-agent'
		),
);

const RovoAgentAvatar = lazy(
	() =>
		import(/* webpackChunkName: "@atlaskit-rovo-avatar-RovoAgentAvatar"*/ './assets/rovo-agent'),
);
const JiraWorkAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JiraWorkAgentAvatar"*/ './assets/jira-work-agent'
		),
);
const JiraTaskPlannerAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JiraTaskPlannerAgentAvatar"*/ './assets/jira-task-planner-agent'
		),
);

const ContentReviewerAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-ContentReviewerAvatar"*/ './assets/content-reviewer'
		),
);

const JiraCodingAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JiraCodingAgentAvatar"*/ './assets/jira-coding-agent'
		),
);

const JiraIntelligentTriageAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JiraIntelligentTriageAgentAvatar"*/ './assets/jira-intelligent-triage-agent'
		),
);

const JiraDeliveryAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JiraDeliveryAgentAvatar"*/ './assets/jira-delivery-agent'
		),
);

const JsmServiceTriageAgentAvatar = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-rovo-avatar-JsmServiceTriageAgentAvatar"*/ './assets/jsm-service-triage-agent'
		),
);
/**
 * OOTB Agents avatars - end
 */

export type AgentAvatarColor = {
	primary: string;
	cover: string;
	secondary?: string;
};

export const yellowColor = {
	v1: { primary: '#FCA700', secondary: '#FFC716', cover: '#FEF7C8' },
	v2: { primary: '#FFC716', iconColor: '#101214', cover: '#FEF7C8' },
};
export const purpleColor = {
	v1: { primary: '#BF63F3', secondary: '#D8A0F7', cover: '#F8EEFE' },
	v2: { primary: '#C97CF4', iconColor: '#101214', cover: '#F8EEFE' },
};
export const greenColor = {
	v1: { primary: '#82B536', secondary: '#B3DF72', cover: '#EFFFD6' },
	v2: { primary: '#94C748', iconColor: '#101214', cover: '#EFFFD6' },
};
export const blueColor = {
	v1: { primary: '#357DE8', secondary: '#669DF1', cover: '#E9F2FE' },
	v2: { primary: '#1868DB', iconColor: '#FFFFFF', cover: '#E9F2FE' },
};

const colorList = [yellowColor, purpleColor, greenColor, blueColor];

/**
 * NOTE: DO NOT ADD OOTB AGENTAVATARS TO THIS LIST
 */
const avatarList = [
	{ v1: CustomerInsightAvatar, v2: RefreshedCustomerInsightAvatar },
	{ v1: BacklogBuddyAvatar, v2: RefreshedBacklogBuddyAvatar },
	{ v1: DecisionDirectorAvatar, v2: RefreshedDecisionDirectorAvatar },
	{ v1: CommsCrafterAvatar, v2: RefreshedCommsCrafterAvatar },
	{ v1: AutoDevAvatar, v2: RefreshedAutoDevAvatar },
	{ v1: OkrOracleAvatar, v2: RefreshedOkrOracleAvatar },
	{ v1: CultureAvatar, v2: RefreshedCultureAvatar },
	{ v1: SocialMediaScribeAvatar, v2: RefreshedSocialMediaScribeAvatar },
	{ v1: TeamConnectionAvatar, v2: RefreshedTeamConnectionAvatar },
	{ v1: HireWriterAvatar, v2: RefreshedHireWriterAvatar },
	{ v1: OpsAgentAvatar, v2: RefreshedOpsAgentAvatar },
	{ v1: ResearchScoutAvatar, v2: RefreshedResearchScoutAvatar },
	{ v1: ReleaseNotesAvatar, v2: RefreshedReleaseNotesAvatar },
	{ v1: MyUserManualAvatar, v2: RefreshedMyUserManualAvatar },
	{ v1: PitchPerfectorAvatar, v2: RefreshedPitchPerfectorAvatar },
	{ v1: AutoDevAvatar, v2: RefreshedAutoDevAvatar },
	{ v1: AutoFixAvatar, v2: RefreshedAutoFixAvatar },
	{ v1: AutoReviewAvatar, v2: RefreshedAutoReviewAvatar },
	{ v1: MarketingMessageMaestroAvatar, v2: RefreshedMarketingMessageMaestroAvatar },
	{ v1: FeatureFlagAvatar, v2: RefreshedFeatureFlagAvatar },
	{ v1: ProductRequirementAvatar, v2: RefreshedProductRequirementAvatar },
] as const;

export const TOTAL_AVATAR_COMBINATIONS: number = avatarList.length * colorList.length;

type GeneratedAvatarProps = {
	agentNamedId?: string;
	agentId?: string;
	agentIdentityAccountId?: string | null | undefined;
	isRovoDev?: boolean;
	size: SizeType;
	onLoad?: () => void;
};

const outOfTheBoxAgentAvatar: Record<
	string,
	{ getRender: (size: SizeType) => React.ReactNode; getColor: () => AgentAvatarColor }
> = {
	ai_mate_agent: {
		getRender: (size: SizeType) => (
			<RovoChatAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={blueColor.v1.primary}
				secondaryColor={blueColor.v1.secondary}
			/>
		),
		getColor: () => blueColor.v1,
	},
	autodev_template_unit_test_creator: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedAutoFixAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<AutoFixAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	autodev_template_migration_config_changer_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedOpsAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<OpsAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	autodev_template_vulnerable_dependency_updater_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedMarketingMessageMaestroAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<MarketingMessageMaestroAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	autodev_template_code_standardizer_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedMyUserManualAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<MyUserManualAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	autodev_template_code_observer_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedResearchScoutAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<ResearchScoutAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	autodev_template_code_accessibility_checker_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedHireWriterAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<HireWriterAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	autodev_code_documentation_writer_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedSocialMediaScribeAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<SocialMediaScribeAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	autodev_feature_flag_cleaner_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedFeatureFlagAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<FeatureFlagAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	decision_director_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedDecisionDirectorAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<DecisionDirectorAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	planner_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedOpsAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={purpleColor.v2.primary}
					iconColor={purpleColor.v2.iconColor}
				/>
			) : (
				<OpsAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={purpleColor.v1.primary}
					secondaryColor={purpleColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? purpleColor.v2 : purpleColor.v1),
	},
	tech_writer_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedSocialMediaScribeAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={blueColor.v2.primary}
					iconColor={blueColor.v2.iconColor}
				/>
			) : (
				<SocialMediaScribeAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={blueColor.v1.primary}
					secondaryColor={blueColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? blueColor.v2 : blueColor.v1),
	},
	content_reviewer_agent: {
		getRender: (size: SizeType) => (
			<ContentReviewerAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	user_manual_writer_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedMyUserManualAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v2.primary}
					iconColor={yellowColor.v2.iconColor}
				/>
			) : (
				<MyUserManualAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v1.primary}
					secondaryColor={yellowColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? yellowColor.v2 : yellowColor.v1),
	},
	product_requirements_expert_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedProductRequirementAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v2.primary}
					iconColor={yellowColor.v2.iconColor}
				/>
			) : (
				<ProductRequirementAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v1.primary}
					secondaryColor={yellowColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? yellowColor.v2 : yellowColor.v1),
	},
	document_writer: {
		getRender: (size: SizeType) => (
			<DocumentWriterAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={blueColor.v1.primary}
				secondaryColor={blueColor.v1.secondary}
			/>
		),
		getColor: () => blueColor.v1,
	},
	issue_organizer_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedBacklogBuddyAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<BacklogBuddyAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	ops_guide_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedOpsExpertAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v2.primary}
					iconColor={yellowColor.v2.iconColor}
				/>
			) : (
				<OpsAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v1.primary}
					secondaryColor={yellowColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? yellowColor.v2 : yellowColor.v1),
	},
	discovery_and_feedback_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedCommsCrafterAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<CommsCrafterAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v1.primary}
					secondaryColor={greenColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : greenColor.v1),
	},
	jira_workflow_builder_agent: {
		getRender: (size: SizeType) => (
			<WorkflowBuilderAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={blueColor.v1.primary}
				secondaryColor={blueColor.v1.secondary}
			/>
		),
		getColor: () => blueColor.v1,
	},
	itops_rca_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedAutoReviewAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v2.primary}
					iconColor={yellowColor.v2.iconColor}
				/>
			) : (
				<AutoReviewAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={yellowColor.v1.primary}
					secondaryColor={yellowColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? yellowColor.v2 : yellowColor.v1),
	},
	jira_trial_guide_agent: {
		getRender: (size: SizeType) => (
			<TrialGuideAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={blueColor.v1.primary}
				secondaryColor={blueColor.v1.secondary}
			/>
		),
		getColor: () => blueColor.v1,
	},
	daily_brief_agent: {
		getRender: (size: SizeType) => (
			<TrialGuideAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={yellowColor.v1.primary}
				secondaryColor={yellowColor.v1.secondary}
			/>
		),
		getColor: () => yellowColor.v1,
	},
	jira_admin_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedJiraAdminAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={blueColor.v2.primary}
					iconColor={blueColor.v2.iconColor}
				/>
			) : (
				<JiraCodingAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={blueColor.v1.primary}
					secondaryColor={blueColor.v1.secondary}
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? blueColor.v2 : blueColor.v1),
	},
	jsm_rovo_service_agent: {
		getRender: (size: SizeType) => {
			if (fg('platform-dst-avatar-updated-geometry')) {
				return (
					<RefreshedRequestResolverAvatar
						size={AVATAR_SIZES[size]}
						primaryColor={yellowColor.v2.primary}
						iconColor={yellowColor.v2.iconColor}
					/>
				);
			}

			if (fg('rename-rovo-service-to-request-resolver')) {
				return (
					<JsmRequestResolverAgentAvatar
						size={AVATAR_SIZES[size]}
						primaryColor=""
						secondaryColor=""
					/>
				);
			}

			return (
				<JsmRovoServiceAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
			);
		},
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? yellowColor.v2 : yellowColor.v1),
	},
	mcp_amplitude_agent: {
		getRender: (size: SizeType) =>
			fg('rovo_agent_amplitude_avatar_v2') ? (
				<AmplitudeAgentAvatarV2 size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
			) : (
				<AmplitudeAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
			),
		getColor: () => blueColor.v1,
	},
	mcp_box_agent: {
		getRender: (size: SizeType) => (
			<BoxAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	mcp_canva_agent: {
		getRender: (size: SizeType) => (
			<CanvaAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	mcp_figma_agent: {
		getRender: (size: SizeType) => (
			<FigmaAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	mcp_hubspot_agent: {
		getRender: (size: SizeType) => (
			<HubSpotAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	mcp_intercom_agent: {
		getRender: (size: SizeType) => (
			<IntercomAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	mcp_gamma_agent: {
		getRender: (size: SizeType) => (
			<GammaAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	mcp_lovable_agent: {
		getRender: (size: SizeType) => (
			<LovableAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	mcp_replit_agent: {
		getRender: (size: SizeType) => (
			<ReplitAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	rovo_agent: {
		getRender: (size: SizeType) => (
			<RovoAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	jira_work_agent: {
		getRender: (size: SizeType) => (
			<JiraWorkAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	jira_task_planner_agent: {
		getRender: (size: SizeType) => (
			<JiraTaskPlannerAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => blueColor.v1,
	},
	jira_intelligent_triage_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedJiraIntelligentTriageAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={blueColor.v2.primary}
					iconColor={blueColor.v2.iconColor}
				/>
			) : (
				<JiraIntelligentTriageAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor=""
					secondaryColor=""
				/>
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? blueColor.v2 : blueColor.v1),
	},
	jira_delivery_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedJiraDeliveryAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={blueColor.v2.primary}
					iconColor={blueColor.v2.iconColor}
				/>
			) : (
				<JiraDeliveryAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? blueColor.v2 : blueColor.v1),
	},
	jsm_service_triage_agent: {
		getRender: (size: SizeType) => (
			<JsmServiceTriageAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
		),
		getColor: () => yellowColor.v1,
	},
	jira_coding_agent: {
		getRender: (size: SizeType) =>
			fg('platform-dst-avatar-updated-geometry') ? (
				<RefreshedJiraCodingAgentAvatar
					size={AVATAR_SIZES[size]}
					primaryColor={greenColor.v2.primary}
					iconColor={greenColor.v2.iconColor}
				/>
			) : (
				<JiraCodingAgentAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />
			),
		getColor: () => (fg('platform-dst-avatar-updated-geometry') ? greenColor.v2 : blueColor.v1),
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

const ROVO_DEV_AGENT_ID = '027f0676-e8e9-4939-8962-3850987d78bb';
const getAvatarRender = ({
	agentNamedId,
	agentId,
	agentIdentityAccountId,
	isRovoDev,
	size,
}: GeneratedAvatarProps) => {
	if (isRovoDev) {
		return {
			render: <RovoDevAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />,
			color: greenColor.v1,
		};
	}

	//@TODO CRCS-3129: Remove Rovo Dev hardcoded icon after TeamEU demos
	// Handle Rovo Dev agent avatar for TeamEU Demo
	if (agentId === ROVO_DEV_AGENT_ID && fg('jira_ai_force_rovo_dev_avatar')) {
		return {
			render: <RovoDevAvatar size={AVATAR_SIZES[size]} primaryColor="" secondaryColor="" />,
			color: greenColor.v1,
		};
	}

	if (typeof agentNamedId === 'string' && outOfTheBoxAgentAvatar[agentNamedId]) {
		const avatar = outOfTheBoxAgentAvatar[agentNamedId];
		return { render: avatar.getRender(size), color: avatar.getColor() };
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

		const avatar = avatarList[avatarIndex];
		const color = colorList[colorIndex];

		if (fg('platform-dst-avatar-updated-geometry')) {
			const Avatar = avatar.v2;
			return {
				render: (
					<Avatar
						size={AVATAR_SIZES[size]}
						primaryColor={color.v2.primary}
						iconColor={color.v2.iconColor}
					/>
				),
				color: color.v2,
			};
		}

		const Avatar = avatar.v1;
		return {
			render: (
				<Avatar
					size={AVATAR_SIZES[size]}
					primaryColor={color.v1.primary}
					secondaryColor={color.v1.secondary}
				/>
			),
			color: color.v1,
		};
	}

	const fallbackColor = fg('platform-dst-avatar-updated-geometry') ? blueColor.v2 : blueColor.v1;
	return {
		render: (
			<GenericAvatar
				size={AVATAR_SIZES[size]}
				primaryColor={fallbackColor.primary}
				secondaryColor={
					'iconColor' in fallbackColor ? fallbackColor.iconColor : fallbackColor.secondary
				}
			/>
		),
		color: fallbackColor,
	};
};

export const getAgentAvatarColor = (
	props: Pick<
		GeneratedAvatarProps,
		'agentNamedId' | 'agentId' | 'agentIdentityAccountId' | 'isRovoDev'
	>,
): AgentAvatarColor => getAvatarRender({ ...props, size: 'medium' }).color;

type AgentBannerCreatorType = AgentCreatorType | 'ROVO_DEV';

type AgentBannerProps = Pick<
	GeneratedAvatarProps,
	'agentId' | 'agentNamedId' | 'agentIdentityAccountId' | 'isRovoDev'
> & {
	creatorType?: AgentBannerCreatorType | null;
	height?: number;
	fillSpace?: boolean;
};

export const AgentBanner = ({
	agentNamedId,
	agentId,
	agentIdentityAccountId,
	isRovoDev,
	creatorType,
	height,
	fillSpace,
}: AgentBannerProps): JSX.Element => {
	const color = getAgentAvatarColor({
		agentNamedId,
		agentId,
		agentIdentityAccountId,
		isRovoDev,
	});

	const isRemoteA2A = fg('jira_improve_agent_profile_for_a2a') && creatorType === 'REMOTE_A2A';

	return (
		<Box
			xcss={cx(
				styles.banner,
				fillSpace ? styles.bannerFillSpace : undefined,
				isRemoteA2A ? styles.bannerRemoteA2A : undefined,
			)}
			style={{
				backgroundColor: isRemoteA2A ? undefined : color.primary,
				height: height ? `${height}px` : undefined,
			}}
		/>
	);
};

export const GeneratedAvatar = (props: GeneratedAvatarProps): JSX.Element => {
	const { render, color } = getAvatarRender(props);
	const { onLoad } = props;

	return (
		<Box
			xcss={styles.image}
			style={{
				backgroundColor: color.primary,
			}}
		>
			<Suspense fallback={null}>
				{onLoad && <Observer onLoad={onLoad} />}
				{render}
			</Suspense>
		</Box>
	);
};
