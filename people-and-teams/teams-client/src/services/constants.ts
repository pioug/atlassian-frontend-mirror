import { type TeamsClientConfig } from '../types';

export const DEFAULT_CONFIG: TeamsClientConfig = {
	stargateRoot: '/gateway/api',
	permsServiceUrl: '/gateway/api/permissions',
	publicApiRoot: '/gateway/api/public',
	invitationsServiceUrl: '/gateway/api/invitations',
	collaborationGraphUrl: '/gateway/api/collaboration',
};
