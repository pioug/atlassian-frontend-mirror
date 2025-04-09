export type ContainerTypes = 'ConfluenceSpace' | 'JiraProject' | 'WebLink';

export enum JiraProjectTypes {
	PRODUCT_DISCOVERY = 'Product Discovery',
	SOFTWARE = 'Software',
	SERVICE_DESK = 'Service Desk',
	BUSINESS = 'Business',
	CUSTOMER_SERVICE = 'Customer Service',
}

export type ContainerSubTypes = keyof typeof JiraProjectTypes | string;

export type TeamContainer = {
	id: string;
	type: ContainerTypes;
	name: string;
	icon?: string | null;
	createdDate: Date;
	link?: string | null;
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	};
};

export const USER_ARI_PREFIX = 'ari:cloud:identity::user/' as const;
export type UserARI = `${typeof USER_ARI_PREFIX}${string}`;
export const TEAM_ARI_PREFIX = 'ari:cloud:identity::team/' as const;
export type TeamARI = `${typeof TEAM_ARI_PREFIX}${string}`;

export type UserStatus = 'active' | 'inactive' | 'closed';
export type TeamState = 'ACTIVE' | 'PURGED';
export type TeamMembershipSettings = 'OPEN' | 'MEMBER_INVITE' | 'EXTERNAL';
export type MembershipRole = 'REGULAR' | 'ADMIN';
export type MembershipState = 'FULL_MEMBER' | 'ALUMNI' | 'REQUESTING_TO_JOIN';
