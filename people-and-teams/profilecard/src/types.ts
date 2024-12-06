import type React from 'react';

import { type IntlShape } from 'react-intl-next';

import { type AnalyticsEventPayload, type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type ConversationStarter } from '@atlaskit/rovo-agent-components';

import { type TeamCentralScopes } from './client/ProfileCardClient';
import type RovoAgentCardClient from './client/RovoAgentCardClient';
import {
	type default as TeamCentralCardClient,
	type TeamCentralCardClientOptions,
} from './client/TeamCentralCardClient';
import type TeamProfileCardClient from './client/TeamProfileCardClient';
import type UserProfileCardClient from './client/UserProfileCardClient';

export interface ApiClientResponse {
	User: {
		id: string;
		accountType: string;
		isBot: boolean;
		isCurrentUser: boolean;
		avatarUrl: string | null;
		email: string | null;
		fullName: string | null;
		location: string | null;
		meta: string | null;
		nickname: string | null;
		companyName: string | null;
		remoteTimeString: string | null;
		remoteWeekdayIndex: string | null;
		remoteWeekdayString: string | null;
		status: StatusType;
		statusModifiedDate: number | null;
	};
}

type FlagAppearance = 'error' | 'info' | 'normal' | 'success' | 'warning';
export interface Flag {
	id: number | string;
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	type?: FlagAppearance;

	appearance?: FlagAppearance;
	actions?: {
		content: React.ReactNode;
		onClick?: () => void;
		href?: string;
		target?: string;
	}[];
	icon?: JSX.Element;
}

export interface Team {
	// Header image props
	largeAvatarImageUrl?: string;
	smallAvatarImageUrl?: string;
	largeHeaderImageUrl?: string;
	smallHeaderImageUrl?: string;
	// Regular team details
	id: string;
	displayName: string;
	description: string;
	organizationId?: string;
	members?: {
		id: string;
		fullName: string;
		avatarUrl: string;
	}[];
	isVerified?: boolean;
}

export interface RovoAgent {
	id: string;
	identity_account_id?: string | null;
	named_id: string;
	name: string;
	description: string | null;
	system_prompt_template?: string | null;
	creator_type: 'SYSTEM' | 'CUSTOMER' | 'THIRD_PARTY' | 'FORGE';
	creator?: string | null;
	visibility?: 'PUBLIC' | 'PRIVATE' | null;
	is_default: boolean;
	actor_type: 'AGENT';
	follow_up_prompt_template?: string | null;
	plugin_routing_type?: 'DEFAULT' | 'SKIP' | null;
	user_defined_conversation_starters: string[] | null;
	favourite: boolean;
	favourite_count: number;
	deactivated?: boolean;
	icon?: string | null;
	external_config_reference?: string;
}

export interface RovoAgentCreatorInfo {
	type: 'CUSTOMER' | 'SYSTEM' | 'THIRD_PARTY' | 'FORGE';
	name?: string;
	profileLink?: string;
	id?: string;
}

export interface RovoAgentProfileCardInfo extends RovoAgent {
	creatorInfo: RovoAgentCreatorInfo | undefined;
}
export interface ProfileCardClientData {
	isBot: boolean;
	/**
	 * Mark it as optional as part of the migration from cloud user to AGG user
	 * This field will be calculated based on the user id and the principal user id props
	 * This will be removed once the migration is complete
	 */
	isCurrentUser?: boolean;
	avatarUrl?: string;
	email?: string;
	fullName?: string;
	location?: string;
	meta?: string;
	nickname?: string;
	companyName?: string;
	timestring?: string;
	status: StatusType;
	statusModifiedDate?: number | null;
	customLozenges?: LozengeProps[];
	accountType?: string;
	isAgent?: boolean;
}

export interface ReportingLinesUserPII {
	name: string;
	picture?: string;
}

export interface ReportingLinesUser {
	accountIdentifier: string;
	identifierType: 'ATLASSIAN_ID' | 'BASE64_HASH' | 'UNKNOWN';
	pii?: ReportingLinesUserPII;
}

export interface TeamCentralReportingLinesData {
	managers?: ReportingLinesUser[];
	reports?: ReportingLinesUser[];
}

export interface ProfileCardResourcedProps {
	userId: string;
	cloudId: string;
	resourceClient: ProfileClient;
	actions?: ProfileCardAction[];
	reportingLinesProfileUrl?: string;
	onReportingLinesClick?: (user: ReportingLinesUser) => void;
	position?: ProfilecardTriggerPosition;
	trigger?: TriggerType;
	children?: React.ReactNode;
	addFlag?: (flag: any) => void;
}

export interface ProfileCardResourcedState {
	visible?: boolean;
	isLoading?: boolean;
	hasError: boolean;
	error?: ProfileCardErrorType;
	data: ProfileCardClientData | null;
	reportingLinesData?: TeamCentralReportingLinesData;
	isKudosEnabled?: boolean;
	kudosDrawerOpen: boolean;
	teamCentralBaseUrl?: string;
}

export interface ProfileCardTriggerProps {
	userId: string;
	/**
    A cloudId can be provided, and we'll verify that the target userId is an
    actual user in the specified site.

    Instead you can omit the cloudId and we won't do such a check.

    If you have a cloudId and only want to show users who are in that site
    then please provide it. If you're a site-less product or don't care about
    verifying that the shown user is in a particular site, don't provide a
    cloudId.
   */
	cloudId?: string;
	autoFocus?: boolean;
	resourceClient: ProfileClient;
	actions?: ProfileCardAction[];
	reportingLinesProfileUrl?: string;
	onReportingLinesClick?: (user: ReportingLinesUser) => void;
	position?: ProfilecardTriggerPosition;
	trigger?: TriggerType;
	children: React.ReactNode;
	testId?: string;
	addFlag?: (flag: any) => void;
	ariaLabel?: string;
	ariaLabelledBy?: string;
	prepopulatedData?: PrepopulatedData;
	disabledAriaAttributes?: boolean;
	onVisibilityChange?: (isVisible: boolean) => void;
	isVisible?: boolean;
	offset?: [number, number];
	product?: string;
	viewingUserId?: string;
	agentActions?: AgentActionsType;
	ariaHideProfileTrigger?: boolean;
}

export interface ProfileCardTriggerState {
	visible?: boolean;
	isLoading?: boolean;
	hasError: boolean;
	error?: ProfileCardErrorType;
	data: ProfileCardClientData | null;
	reportingLinesData?: TeamCentralReportingLinesData;
	shouldShowGiveKudos?: boolean;
	teamCentralBaseUrl?: string;
	kudosDrawerOpen: boolean;
}

export interface TeamProfileCardTriggerState {
	visible?: boolean;
	isLoading?: boolean;
	hasError: boolean;
	error?: any;
	data: Team | null;
	renderError?: boolean;
	shouldShowGiveKudos?: boolean;
	teamCentralBaseUrl?: string;
	kudosDrawerOpen: boolean;
}

export interface TeamProfilecardCoreProps {
	/**
    The id of the user viewing the profile card.

    This is used to determine whether to say that the member count is
    "including you" or not.
   */
	viewingUserId?: string;
	/**
    A list of extra buttons to be displayed at the bottom of the card.
    View Profile is always included by default.
   */
	actions?: ProfileCardAction[];
	/**
    A function allowing products to provide an href for the user avatars in the
    profilecard, e.g. so they can link to user's profile pages.
   */
	generateUserLink?: (userId: string) => string;
	/**
    A function allowing products to provide an onClick handler for when the
    user clicks on a user's avatar or avatar group item.
   */
	onUserClick?: (userId: string, event: React.MouseEvent<Element>) => void;
	/**
    This should be a link to the team's profile page. This will be used for:

    - Wrapping the trigger in a link to the team profile page (unless
      triggerLinkType is `none`).

    - Providing the link for the View Profile action button on the card.
   */
	viewProfileLink: string;
	/**
    An onClick action that navigates to the team's profile page. Something you
    may want, e.g. for an SPA site or tracking analytics of navigation. This
    is optional, just the viewProfileLink will suffice. Will be used for:

    - Adding an onClick to the trigger if the triggerLinkType is
      `clickable-link`.

    - Providing an onClick for the View Profile action button on the card.
   */
	viewProfileOnClick?: (event?: React.MouseEvent<Element>) => void;
}

export interface TeamProfileCardTriggerProps extends TeamProfilecardCoreProps {
	/** The id of the team. */
	teamId: string;
	/**
    The id of the organization that the team belongs to.
    Currently this is unused, but will become necessary in the future.
   */
	orgId: string;
	/** An instance of ProfileClient. */
	resourceClient: ProfileClient;
	/**
    The position relative to the trigger that the card should be displayed in.
   */
	position?: ProfilecardTriggerPosition;
	/**
    The interaction method used to trigger the team profile card to appear.

    - Click is generally recommended, but your needs may vary.

    - Hover works for mouse users, but does not support those who use a
      keyboard or screen reader, avoid using this if it's possible or makes
      sense.

    - Hover-click is usable for scenarios like inline-edits, where mouse users
      cannot click on the trigger without causing side effects, but keyboard
      users are still able to navigate into and trigger the profile card.

    Look at the "Team Profilecard Trigger" or "Trigger Link Types" examples to
    see how they behave, or ask in #help-people-and-teams-xpc on Slack for our
    recommendations.
   */
	trigger?: 'hover' | 'click' | 'hover-click';
	/**
    We generally prefer to wrap the trigger in a link to the team profile
    page. This prop determines how that link behaves.

    - Link is generally the recommended prop (especially in combination with
      click or hover-click for the trigger prop above). It wraps the trigger in
      an anchor tag with the team profile link (that users can interact with
      via middle-click, etc.), but left clicking on the link is suppressed.

    - None does not wrap the trigger in a link at all. This makes it difficult
      for keyboard or screen reader users to know how to trigger the profile
      card. Generally avoid this.

    - Clickable-link wraps the trigger in a link with no special behaviour.
      This is suitable for places where you want the trigger to serve primarily
      as a link, and optionally allow hovering to preview the team first.

    Look at the example on "Trigger Link Types" for more in-depth analysis, or
    ask in #help-people-and-teams-xpc on Slack for our recommendations.
   */
	triggerLinkType?: 'none' | 'link' | 'clickable-link';
	/**
    This is the component that will cause a team profile card to appear when
    interacted with according to the method specified by the trigger prop.
   */
	children?: React.ReactNode;
	/**
	 * Used by the card to show Flags.
	 */
	addFlag?: (flag: any) => void;
	/**
	 * Optional cloudId. Pass this if rendering card within a sited context.
	 */
	cloudId?: string;
}

export interface AgentActionsType {
	onChatClick?: () => void;
	onConversationStartersClick?: (starter: ConversationStarter) => void;
}
export interface AgentProfileCardTriggerProps extends AgentActionsType {
	agentId: string;
	cloudId?: string;
	autoFocus?: boolean;
	resourceClient: ProfileClient;
	actions?: ProfileCardAction[];
	position?: ProfilecardTriggerPosition;
	trigger?: TriggerType;
	children: React.ReactNode;
	testId?: string;
	addFlag?: (flag: Flag) => void;
	ariaLabel?: string;
	ariaLabelledBy?: string;
	prepopulatedData?: PrepopulatedData;
	disabledAriaAttributes?: boolean;
	isVisible?: boolean;
	offset?: [number, number];
	product?: string;
	viewingUserId?: string;
}

export type AgentProfileCardProps = {
	resourceClient: ProfileClient;
	agent?: RovoAgentProfileCardInfo;
	isLoading?: boolean;
	hasError?: boolean;
	isCreatedByViewingUser?: boolean;
	cloudId?: string;
	product?: string;
	errorType?: ProfileCardErrorType;
	addFlag?: (flag: Flag) => void;
} & AgentActionsType;

export type StatusType = 'active' | 'inactive' | 'closed';

export type TriggerType = 'hover' | 'click';

export type ProfileType = 'user' | 'team' | 'agent';

export type StatusModifiedDateType =
	| 'noDate'
	| 'thisWeek'
	| 'thisMonth'
	| 'lastMonth'
	| 'aFewMonths'
	| 'severalMonths'
	| 'moreThanAYear';

export interface ProfileCardAction {
	callback?: (...args: any[]) => any;
	shouldRender?: (data: any) => boolean;
	id?: string;
	label: React.ReactNode;
	// Link to provide general link behaviour to the button. If both link and callback are provided link behaviour will be suppressed on click.
	link?: string;
}

export type LozengeColor = 'default' | 'success' | 'removed' | 'inprogress' | 'new' | 'moved';

export interface LozengeProps {
	text: React.ReactNode;
	appearance?: LozengeColor; // defaults to 'default'
	isBold?: boolean; // defaults to false
}

export interface ProfilecardProps {
	isLoading?: boolean;
	hasError?: boolean;
	errorType?: ProfileCardErrorType;
	accountType?: string;
	status?: StatusType;
	isBot?: boolean;
	avatarUrl?: string;
	fullName?: string;
	meta?: string;
	userId?: string;
	isCurrentUser?: boolean;
	// Nick name is also known as public name
	nickname?: string;
	email?: string;
	location?: string;
	companyName?: string;
	timestring?: string;
	actions?: ProfileCardAction[];
	clientFetchProfile?: () => void;
	statusModifiedDate?: number | null;
	withoutElevation?: boolean;
	/** Show manager and direct reports section on profile hover card, if available */
	reportingLines?: TeamCentralReportingLinesData;
	/** Base URL to populate href value for manager's and direct reports' user avatar  */
	reportingLinesProfileUrl?: string;
	/** Click handler when user clicks on manager's and direct reports' user avatar, un-clickable otherwise */
	onReportingLinesClick?: (user: ReportingLinesUser) => void;
	isKudosEnabled?: boolean;
	teamCentralBaseUrl?: string;
	addFlag?: (flag: any) => void;
	cloudId?: string;

	// Allow to pass custom message for disabled account which `status` prop is `inactive` or `closed`.
	// `disabledAccountMessage` should not contain react-intl-next components, ex: `FormattedMessage`,
	// because ProfileCard component is wrapped in its own `IntlProvider` and `FormattedMessage` will loads messages of `@atlaskit/profilecard`,
	// not from the consumer of `@atlaskit/profilecard`.
	disabledAccountMessage?: React.ReactNode;
	// Allow to show a status lozenge for disabled account which `status` prop is `inactive` or `closed`
	hasDisabledAccountLozenge?: boolean;
	// Allow consumers to pass in custom lozenges that will be displayed under the heading
	customLozenges?: LozengeProps[];
	openKudosDrawer?: () => void;
	isTriggeredUsingKeyboard?: boolean;
	disabledAriaAttributes?: boolean;
	//overriding agent actions
	agentActions?: AgentActionsType;
}

export type AnalyticsFromDuration = (duration: number) => AnalyticsEventPayload;

export type AnalyticsFunction = (generator: AnalyticsFromDuration) => void;

export interface AnalyticsProps {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
}

export interface AnalyticsWithDurationProps {
	fireAnalyticsWithDuration: AnalyticsFunction;
}

export interface TeamProfilecardProps extends TeamProfilecardCoreProps {
	/** Indicates whether the team's details are still loading. */
	isLoading?: boolean;
	/** Indicates whether an error occurred whilst fetching team details. */
	hasError?: boolean;
	/** Describes the type of error that occurred, if any. */
	errorType?: TeamProfileCardErrorType;
	/** The details of the team to be shown. */
	team?: Team;
	/** A callback that will try to re-fetch data in case an error occurred. */
	clientFetchProfile?: () => void;
	/** Details relevant to passing around analytics. */
	analytics: AnalyticsFunction;
}

export interface MessageIntlProviderProps {
	children: React.ReactNode;
	intl: IntlShape;
}

export type RelativeDateKeyType =
	| 'ThisWeek'
	| 'ThisMonth'
	| 'LastMonth'
	| 'AFewMonths'
	| 'SeveralMonths'
	| 'MoreThanAYear'
	| null;

export type AgentIdType = { type: 'agent' | 'identity'; value: string };

type AgentPermissionName = 'AGENT_UPDATE' | 'AGENT_DEACTIVATE';
export type AgentPermissions = {
	permissions: Record<
		AgentPermissionName,
		{
			permitted: boolean;
		}
	>;
};

export interface ProfileClient {
	flushCache: () => void;
	getProfile: (
		cloudId: string,
		userId: string,
		analytics?: (event: AnalyticsEventPayload) => void,
	) => Promise<ProfileCardClientData>;
	getTeamProfile: (
		teamId: string,
		orgId?: string,
		fireAnalytics?: (event: AnalyticsEventPayload) => void,
	) => Promise<Team>;
	getReportingLines: (userId: string) => Promise<TeamCentralReportingLinesData>;
	shouldShowGiveKudos: () => Promise<boolean>;
	getTeamCentralBaseUrl: (teamCentralScopes?: TeamCentralScopes) => Promise<string | undefined>;
	getRovoAgentProfile: (
		id: AgentIdType,
		fireAnalytics?: (event: AnalyticsEventPayload) => void,
	) => Promise<RovoAgent>;
	getRovoAgentPermissions: (
		id: string,
		fireAnalytics?: (event: AnalyticsEventPayload) => void,
	) => Promise<AgentPermissions>;
	deleteAgent: (
		id: string,
		fireAnalytics?: (event: AnalyticsEventPayload) => void,
	) => Promise<void>;
	setFavouriteAgent: (
		id: string,
		isFavourite: boolean,
		fireAnalytics?: (event: AnalyticsEventPayload) => void,
	) => Promise<void>;
}

export type ProfilecardTriggerPosition =
	| 'bottom-start'
	| 'bottom'
	| 'bottom-end'
	| 'left-start'
	| 'left'
	| 'left-end'
	| 'top-end'
	| 'top'
	| 'top-start'
	| 'right-end'
	| 'right'
	| 'right-start';

export type ProfileCardErrorType = {
	reason: 'default' | 'NotFound';
} | null;

export type TeamProfileCardErrorType = {
	reason: 'default' | 'NotFound' | 'TEAMS_FORBIDDEN';
} | null;

export interface ProfileClientOptions
	extends Omit<TeamCentralCardClientOptions, 'gatewayGraphqlUrl'> {
	gatewayGraphqlUrl?: string;
	url?: string;
	cacheSize?: number;
	cacheMaxAge?: number;
	/** Name of integrating product e.g. jira, atlas, confluence **/
	productIdentifier?: string;
	cloudId?: string;
}

export interface ClientOverrides {
	userClient?: UserProfileCardClient;
	teamClient?: TeamProfileCardClient;
	teamCentralClient?: TeamCentralCardClient;
	rovoAgentClient?: RovoAgentCardClient;
}

/** This interface represents the data that is prepopulated in the profile card. **/
export interface PrepopulatedData {
	fullName?: string;
}

export type TeamsUserQueryResponse = {
	id: string;
	name: string;
	picture: string;
	accountStatus: StatusType;
	__typename: 'AppUser' | string;
	email?: string;
	nickname?: string;
	zoneinfo?: string;
	extendedProfile?: {
		jobTitle?: string;
		organization?: string;
		location?: string;
		closedDate?: number;
		inactiveDate?: number;
	};
	appType?: string;
};
