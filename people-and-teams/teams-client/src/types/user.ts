type UserPrivacyLevel = 'private' | 'domain' | 'public';

export type UserStatus = 'active' | 'inactive' | 'closed';

export type UserType = 'bot' | 'user' | 'agent';

interface UserPrivacy {
	level: UserPrivacyLevel;
	domain: string;
	isBlacklistedDomain: boolean;
}

export interface TeamsClientUser {
	id: string;
	isCurrentUser?: boolean;
	fullName: string;
	nickname?: string;
	email?: string;
	title?: string;
	timezone?: string;
	localTime?: string;
	locale?: string;
	preferredLanguage?: string;
	location?: string;
	companyName?: string;
	department?: string;
	position?: string;
	avatarUrl?: string;
	headerImageUrl?: string;
	privacy?: UserPrivacy;
	status?: UserStatus;
	statusModifiedDate?: number;
	isBot?: boolean;
	isNotMentionable?: boolean;
	phoneNumber?: string;
	userType?: UserType;
	isAgent?: boolean;
}

export interface UserInSiteUserbase {
	isPresent: boolean;
}

const EditableUserFieldList = [
	'title',
	'department',
	'companyName',
	'location',
	'phoneNumber',
	'fullName',
	'nickname',
	'locale',
	'email',
] as const;

export type EditableUserFields = Pick<TeamsClientUser, (typeof EditableUserFieldList)[number]>;

export const isEditableUserField = (key: string): key is keyof EditableUserFields => {
	return EditableUserFieldList.includes(key as unknown as (typeof EditableUserFieldList)[number]);
};
