import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import {
	isEmail,
	isExternalUser,
	isGroup,
	isTeam,
	isUser,
	type OptionData,
	type Team,
} from '@atlaskit/smart-user-picker';

import { type DialogContentState, type OriginTracing } from '../../types';

const buildAttributes = (attributes = {}) => ({
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
	...attributes,
});

const createEvent = (
	eventType: 'ui' | 'operational' | 'track',
	source: string,
	action: string,
	actionSubject: string,
	actionSubjectId?: string,
	attributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	actionSubjectId,
	source,
	attributes: buildAttributes(attributes),
});

const createScreenEvent = (name: string, attributes = {}): AnalyticsEventPayload => ({
	eventType: 'screen',
	name,
	attributes: buildAttributes(attributes),
});

export const CHANNEL_ID = 'fabric-elements';
export const ANALYTICS_SOURCE = 'shareModal';
export const INTEGRATION_MODAL_SOURCE = 'integrationShareDialog';

export const screenEvent = ({ isPublicLink = false }) =>
	createScreenEvent(ANALYTICS_SOURCE, {
		isPublicLink,
	});

export const shareSplitButtonEvent = () =>
	createEvent('ui', INTEGRATION_MODAL_SOURCE, 'clicked', 'button', 'shareSplitButton');

export const shareIntegrationButtonEvent = (type: string = '') =>
	createEvent('ui', INTEGRATION_MODAL_SOURCE, 'clicked', 'button', 'shareToIntegration', {
		integrationType: type.toLowerCase(),
	});

export const errorEncountered = (actionSubjectId: string | undefined, attributes: any = {}) =>
	createEvent('operational', ANALYTICS_SOURCE, 'encountered', 'error', actionSubjectId, {
		...attributes,
		source: ANALYTICS_SOURCE,
	});

// = share dialog invoked. Not to be confused with "share submitted"
export const shareTriggerButtonClicked = () =>
	createEvent('ui', ANALYTICS_SOURCE, 'clicked', 'button', 'share');

export type TabSubjectIdType = 'shareTab' | 'shareToSlackTab';

export type MenuItemSubjectIdType = 'shareMenuItem' | 'shareToSlackMenuItem';

export const shareTabClicked = (subjectId: TabSubjectIdType, shareContentType?: string) =>
	createEvent('ui', ANALYTICS_SOURCE, 'clicked', 'tab', subjectId || 'shareTab', {
		shareContentType,
	});

export const shareMenuItemClicked = (subjectId: MenuItemSubjectIdType, shareContentType?: string) =>
	createEvent('ui', ANALYTICS_SOURCE, 'clicked', 'menuItem', subjectId || 'shareMenuItem', {
		shareContentType,
	});

export const cancelShare = (start: number) =>
	createEvent('ui', ANALYTICS_SOURCE, 'pressed', 'keyboardShortcut', 'cancelShare', {
		source: ANALYTICS_SOURCE,
		duration: duration(start),
	});

export const shortUrlRequested = () =>
	createEvent('operational', ANALYTICS_SOURCE, 'requested', 'shortUrl', undefined, {
		source: ANALYTICS_SOURCE,
	});

export const shortUrlGenerated = (start: number, tooSlow: boolean) =>
	createEvent('operational', ANALYTICS_SOURCE, 'generated', 'shortUrl', undefined, {
		source: ANALYTICS_SOURCE,
		duration: duration(start),
		tooSlow,
	});

export const copyLinkButtonClicked = ({
	start,
	shareContentType,
	shareContentSubType,
	shareContentId,
	shareOrigin,
	isPublicLink = false,
	ari,
}: {
	start: number;
	shareContentType?: string;
	shareContentSubType?: string;
	shareContentId?: string;
	shareOrigin?: OriginTracing;
	isPublicLink?: boolean;
	ari?: string;
}) =>
	createEvent('ui', ANALYTICS_SOURCE, 'clicked', 'button', 'copyShareLink', {
		source: ANALYTICS_SOURCE,
		duration: duration(start),
		shortUrl: undefined, // unknown at creation, will be filled later
		contentType: shareContentType,
		contentSubType: shareContentSubType,
		contentId: shareContentId,
		isPublicLink,
		ari,
		// this specific string is needed for marking a successful navigation session
		navdexPointType: 'navigationSessionEnd',
		...getOriginTracingAttributes(shareOrigin),
	});

export const formShareSubmitted = ({
	start,
	data,
	shareContentType,
	shareContentSubType,
	shareContentId,
	shareOrigin,
	isPublicLink = false,
}: {
	start: number;
	data: DialogContentState;
	shareContentType?: string;
	shareContentSubType?: string;
	shareContentId?: string;
	shareOrigin?: OriginTracing;
	isPublicLink?: boolean;
}) => {
	const users = extractIdsByType(data, isUser);
	const externalUsers = extractIdsByType(data, isExternalUser);
	const groups = extractIdsByType(data, isGroup);
	const teams = extractIdsByType(data, isTeam);
	const teamUserCounts = extractMemberCountsFromTeams(data, isTeam);
	const emails = extractIdsByType(data, isEmail);
	return createEvent('ui', ANALYTICS_SOURCE, 'clicked', 'button', 'submitShare', {
		...getOriginTracingAttributes(shareOrigin),
		contentType: shareContentType,
		contentSubType: shareContentSubType,
		contentId: shareContentId,
		duration: duration(start),
		emailCount: emails.length,
		teamCount: teams.length,
		userCount: users.length,
		groupCount: groups.length,
		externalUserCount: externalUsers.length,
		users,
		teams,
		teamUserCounts,
		groups,
		messageLength:
			data.comment && data.comment.format === 'plain_text' ? data.comment.value.length : 0,
		isMessageEnabled: true,
		isPublicLink,
	});
};

const duration = (start: number) => Date.now() - start;

const getOriginTracingAttributes = (origin?: OriginTracing) =>
	origin ? origin.toAnalyticsAttributes({ hasGeneratedId: true }) : {};

const extractIdsByType = <T extends OptionData>(
	data: DialogContentState,
	checker: (option: OptionData) => option is T,
): string[] => data.users.filter(checker).map((option) => option.id);

const extractMemberCountsFromTeams = (
	data: DialogContentState,
	checker: (option: OptionData) => option is Team,
): number[] =>
	// teams with zero memberships cannot exist in share, so we use that
	// as the default value for undefined team member counts
	data.users.filter(checker).map((option) => option.memberCount || 0);

export const jiraPageSharedEvent = ({
	start,
	data,
	shareContentType,
	shareContentSubType,
	shareContentId,
	shareOrigin,
	isPublicLink = false,
	productAttributes,
	loggedInAccountId,
	source = ANALYTICS_SOURCE,
	actionSubjectId = 'submitShare',
}: {
	start: number;
	data: DialogContentState;
	shareContentType?: string;
	shareContentSubType?: string;
	shareContentId?: string;
	shareOrigin?: OriginTracing;
	isPublicLink?: boolean;
	productAttributes?: any;
	loggedInAccountId?: string;
	source?: string;
	actionSubjectId?: string;
}): AnalyticsEventPayload => {
	const users = extractIdsByType(data, isUser);
	const externalUsers = extractIdsByType(data, isExternalUser);
	const groups = extractIdsByType(data, isGroup);
	const teams = extractIdsByType(data, isTeam);
	const teamUserCounts = extractMemberCountsFromTeams(data, isTeam);
	const emails = extractIdsByType(data, isEmail);

	const baseAttributes = {
		duration: duration(start),
		source,
		contentType: shareContentType,
		projectType: productAttributes?.projectType, // software, business
		projectStyle: productAttributes?.projectStyle, // TEAM_MANAGED_PROJECT, COMPANY_MANAGED_PROJECT
		userLocation: productAttributes?.userLocation, // issue:issue, classic-software:rapidboard-board etc.
		isAdmin: productAttributes?.isAdmin,
		isProjectAdmin: productAttributes?.isProjectAdmin,
		...getOriginTracingAttributes(shareOrigin),
		contentId: shareContentId,
		isPublicLink,
		loggedInAccountId,
		shareContentSubType,
		externalUsers,
	};

	// User/team/group data (only for non-copy-link shares)
	const shareSpecificAttributes =
		data.users.length > 0
			? {
					users,
					userCount: users.length,
					teams,
					teamCount: teams.length,
					teamCounts: teamUserCounts,
					groups,
					groupCount: groups.length,
					emailCount: emails.length,
				}
			: {};

	return createEvent('track', source, 'shared', 'page', actionSubjectId, {
		...baseAttributes,
		...shareSpecificAttributes,
	});
};
