export interface UserDetails {
	id: string;
	fullName: string;
	nickname: string;
	timezone: string;
	locale: string;
	avatarUrl: string;
	email: string;
	// extended profile
	title: string;
	companyName: string;
	department: string;
	location: string;
	phoneNumber: string;
	aboutMe: string;
	pronouns: string;

	localTime: ({ format }: { format: string }) => string | null;
}

export type UserDetailKey = keyof UserDetails;

// Copied from ptc-common/user type to not messing up dependency
export enum FieldType {
	FullName = 'fullName',
	Nickname = 'nickname', // aka `Public name`
	Title = 'title',
	Department = 'department',
	CompanyName = 'companyName',
	Location = 'location',
	Timezone = 'timezone',
	Email = 'email',
	PhoneNumber = 'phoneNumber',
	Avatar = 'picture',
	Language = 'language',
	LocalTime = 'localTime',
	RemoteWeekdayIndex = 'remoteWeekdayIndex',
	RemoteWeekdayString = 'remoteWeekdayString',
	RemoteTimeString = 'remoteTimeString',
}

export type FieldKey =
	| 'fullName'
	| 'nickname'
	| 'timezone'
	| 'locale'
	| 'title'
	| 'phoneNumber'
	| 'companyName'
	| 'department'
	| 'location'
	| 'email';

export interface SimpleConstraint {
	allowed: boolean;
	reason?: { key: string };
}

export type MutabilityContraints = {
	[key: string]: SimpleConstraint | MutabilityContraints;
};

export const MUTABILITY_DETAILS_MAP: Record<FieldKey, string> = {
	fullName: 'name',
	nickname: 'nickname',
	timezone: 'zoneinfo',
	locale: 'locale',
	email: 'email',
	// extended profile
	title: 'extended_profile.job_title',
	phoneNumber: 'extended_profile.phone_number',
	companyName: 'extended_profile.organization',
	department: 'extended_profile.department',
	location: 'extended_profile.location',
};

export const CUSTOM_FIELD_PLACE = {
	email: 'email.initiateChange',
	picture: 'avatar',
} as const;

export type CustomFieldKey = keyof typeof CUSTOM_FIELD_PLACE;

export type AllFieldKeys = FieldKey | CustomFieldKey;
