/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import type { TeamAvatarImage, TeamWithImageUrls, Team, TeamPermission, TeamsPermissionFromApi, TeamsPermissionApi, TeamRestriction, TeamDiscoverability, TeamMembershipSettings, ScopeMode, OrgScope, LinkedTeam, Scope, AssignedTeam, AssignedTeamsResponse, UnassignedTeam, UnassignedTeamsResponse, TeamEnabledSitesResponse, AlignmentPermission, TeamSiteAssignmentOrgDetailsResponse, TeamsToBeClonedToJsmSitesResponse, TeamState } from '@atlaskit/teams-client/types/team'` instead.
 */
export type {
	TeamAvatarImage,
	TeamWithImageUrls,
	Team,
	TeamPermission,
	TeamsPermissionFromApi,
	TeamsPermissionApi,
	TeamRestriction,
	TeamDiscoverability,
	TeamMembershipSettings,
	ScopeMode,
	OrgScope,
	LinkedTeam,
	Scope,
	AssignedTeam,
	AssignedTeamsResponse,
	UnassignedTeam,
	UnassignedTeamsResponse,
	TeamEnabledSitesResponse,
	AlignmentPermission,
	TeamSiteAssignmentOrgDetailsResponse,
	TeamsToBeClonedToJsmSitesResponse,
	TeamState,
} from './team';

/**
 * @deprecated Use `import type { TeamsClientUser as User, EditableUserFields, UserStatus } from '@atlaskit/teams-client/user'` instead.
 */
export type { TeamsClientUser as User, EditableUserFields, UserStatus } from './user';
/**
 * @deprecated Use `import { isEditableUserField } from '@atlaskit/teams-client/user'` instead.
 */
export { isEditableUserField } from './user';

/**
 * @deprecated Use `import type { UnlinkContainerMutationError } from '@atlaskit/teams-client/unlink-container-mutation'` instead.
 */
export type { UnlinkContainerMutationError } from '../services/agg-client/utils/mutations/unlink-container-mutation';
/**
 * @deprecated Use `import type { InvitedUser, TeamMember, TeamMembership, TeamAgentMembership, TeamWithMemberships, MembershipState, MembershipRole } from '@atlaskit/teams-client/membership'` instead.
 */
export type {
	InvitedUser,
	TeamMember,
	TeamMembership,
	TeamAgentMembership,
	TeamWithMemberships,
	MembershipState,
	MembershipRole,
} from './membership';

/**
 * @deprecated Use `import type { LinkOrder, NewTeamLink, TeamLink } from '@atlaskit/teams-client/links'` instead.
 */
export type { LinkOrder, NewTeamLink, TeamLink } from './links';

/**
 * @deprecated Use `import type { TeamsClientConfig } from '@atlaskit/teams-client/config'` instead.
 */
export type { TeamsClientConfig } from './config';

/**
 * @deprecated Use `import { isResultWithPageInfo } from '@atlaskit/teams-client/agg-client/types'` instead.
 */
export { isResultWithPageInfo } from '../services/agg-client/types';
/**
 * @deprecated Use `import type { AGGPageInfo, ResultWithPageInfo, AGGPageInfoVariables } from '@atlaskit/teams-client/agg-client/types'` instead.
 */
export type {
	AGGPageInfo,
	ResultWithPageInfo,
	AGGPageInfoVariables,
} from '../services/agg-client/types';

/**
 * @deprecated Use `import type { TeamContainers } from '@atlaskit/teams-client/team-containers'` instead.
 */
export type { TeamContainers } from '../services/agg-client/TeamContainers';
/**
 * @deprecated Use `import type { ReadMediaTokenResponse } from '@atlaskit/teams-client/media'` instead.
 */
export type { ReadMediaTokenResponse } from './media';

/**
 * @deprecated Use `import type { TeamInSlack } from '@atlaskit/teams-client/slack'` instead.
 */
export type { TeamInSlack } from './slack';

/**
 * @deprecated Use `import type { UserTenure } from '@atlaskit/teams-client/tenure'` instead.
 */
export type { UserTenure } from './tenure';

/**
 * @deprecated Use `import type { TeamAgentAssociation } from '@atlaskit/teams-client/association'` instead.
 */
export type { TeamAgentAssociation } from './association';

/**
 * @deprecated Use `import { ApiTeamContainerCreationPayload, Container, ContainerType } from '@atlaskit/teams-client/team-container'` instead.
 */
export {
	type ApiTeamContainerCreationPayload,
	type Container,
	ContainerType,
} from './team-container';

/**
 * @deprecated Use `import type { ReportingLines, ReportingLinesUser } from '@atlaskit/teams-client/reporting-lines-client/utils/types'` instead.
 */
export type {
	ReportingLines,
	ReportingLinesUser,
} from '../services/reporting-lines-client/utils/types';
