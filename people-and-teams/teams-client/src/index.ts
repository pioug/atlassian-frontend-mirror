export { HttpError } from './common/utils/error';

export type { AllTeamsQuery, OriginQuery } from './services/legion-client';

export { isTeamMembershipWithUser } from './types/membership';

// /client
export { teamsClient, TeamsClient } from './services';
export {
	useTeamsClientSetup,
	useTeamsClientSetupNext,
} from './services/hooks/use-teams-client-setup';

// /permissions
export { AllTeamActions, hasPermission } from './common/utils/permissions';
export type { TeamAction } from './common/utils/permissions';

// /sentry
export { initialiseSentry } from './services/sentry/utils/initialise-sentry';
export { logException, logInfoMessage } from './services/sentry/main';
export type { SentryClient } from './services/sentry/types';

// /user-info-provider
export { userInfoProvider, UserInfoProvider } from './services/user-info-provider';

// /utils
export {
	sortMembersByType,
	isInvited,
	isMember,
	isNonMember,
	isRequestingJoin,
} from './common/utils';

export { toUserARI, toUserId, toTeamARI, toTeamId } from './common/utils/ari';

export {
	useLazyQueryLight,
	useQueryLight,
	UseQueryLightError,
	type ActualGraphQLError,
} from './services/use-query-light';
export type { FetchMoreArgs, QueryOptions } from './services/use-query-light';
