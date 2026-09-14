export { HttpError } from './common/utils/error/HttpError';

export type { AllTeamsQuery, OriginQuery } from './services/legion-client';

export { isTeamMembershipWithUser } from './types/membership';

// /client
export { teamsClient, TeamsClient } from './services/main';
export { useTeamsClientSetupNext } from './services/hooks/use-teams-client-setup-next';
export { useTeamsClientSetup } from './services/hooks/use-teams-client-setup';

// /permissions
export { AllTeamActions } from './common/utils/permissions/types';
export { hasPermission } from './common/utils/permissions/has-permission';
export type { TeamAction } from './common/utils/permissions/types';

// /sentry
export { initialiseSentry } from './services/sentry/utils/initialise-sentry';
export { logException } from './services/sentry/logException';
export { logInfoMessage } from './services/sentry/logInfoMessage';
export type { SentryClient } from './services/sentry/types';

// /user-info-provider
export { userInfoProvider, UserInfoProvider } from './services/user-info-provider/main';

// /utils
export { sortMembersByType } from './common/utils/sort-teams';
export { isInvited } from './common/utils/is-invited';
export { isMember } from './common/utils/is-member';
export { isNonMember } from './common/utils/is-non-member';
export { isRequestingJoin } from './common/utils/is-requesting-join';

export { toTeamARI } from './common/utils/to-team-ari';
export { toTeamId } from './common/utils/to-team-id';
export { toUserARI } from './common/utils/to-user-ari';
export { toUserId } from './common/utils/to-user-id';

export { useLazyQueryLight } from './services/use-query-light/useLazyQueryLight';
export { useQueryLight } from './services/use-query-light/useQueryLight';
export { UseQueryLightError } from './services/use-query-light/UseQueryLightError';
export { type ActualGraphQLError } from './services/use-query-light/ActualGraphQLError';
export type { FetchMoreArgs, QueryOptions } from './services/use-query-light/types';
