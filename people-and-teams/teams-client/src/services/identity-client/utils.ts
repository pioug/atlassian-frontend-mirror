import { formatInTimeZone } from 'date-fns-tz';

type ProfileMapKeys = Pick<
	UserDetails,
	'id' | 'fullName' | 'nickname' | 'timezone' | 'locale' | 'avatarUrl' | 'email'
>;
type ProfileMapKey = keyof ProfileMapKeys;

type ExtendedProfileMapKeys = Pick<
	UserDetails,
	'title' | 'department' | 'companyName' | 'location' | 'phoneNumber'
>;
type ExtendedProfileMapKey = keyof ExtendedProfileMapKeys;

// Key (left-side) is field name which is used in our app.
// Value (right-side) is field name which is used by data in services
const PROFILE_PROPS_MAP: Map<ProfileMapKey, keyof Omit<IdentityProfileData, 'extended_profile'>> =
	new Map([
		['id', 'account_id'],
		['fullName', 'name'],
		['nickname', 'nickname'],
		['timezone', 'zoneinfo'],
		['locale', 'locale'],
		['avatarUrl', 'picture'],
		['email', 'email'],
	]);

// Key (left-side) is field name which is used in our app.
// Value (right-side) is field name which is used by data in services
const EXTENDED_PROFILE_PROPS_MAP: Map<
	ExtendedProfileMapKey,
	keyof IdentityProfileData['extended_profile']
> = new Map([
	['title', 'job_title'],
	['department', 'department'],
	['companyName', 'organization'],
	['location', 'location'],
	['phoneNumber', 'phone_number'],
]);

interface IdentityProfileData {
	account_id: string;
	name: string;
	nickname: string;
	locale: string;
	picture: string;
	email: string;
	zoneinfo: string;

	extended_profile: {
		job_title: string;
		organization: string;
		department: string;
		location: string;
		phone_number: string;
	};
}

interface IdentityProfileResponse {
	account: IdentityProfileData;
}

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

	localTime: ({ format }: { format: string }) => string | null;
}

export type UserDetailKey = keyof UserDetails;

export const fromManageAPIResponse = (res: IdentityProfileResponse): UserDetails | null => {
	const data = res.account;
	const extendedData = (data && data.extended_profile) || {};

	if (!data) {
		return null;
	}

	const timeZone = data.zoneinfo;

	const localTime = ({ format }: { format: string }) => {
		if (!timeZone) {
			return null;
		}

		try {
			return formatInTimeZone(new Date(), timeZone, format);
		} catch (error) {
			// TODO: PTC-4908 send error to sentry for reporting
			return null;
		}
	};

	const profileProps = Array.from(PROFILE_PROPS_MAP.keys()).reduce<
		Partial<Record<ProfileMapKey, string>>
	>((acc, key) => {
		if (PROFILE_PROPS_MAP.has(key)) {
			acc[key] = data[PROFILE_PROPS_MAP.get(key)!];
		}
		return acc;
	}, {});

	const extendedProfileProps = Array.from(EXTENDED_PROFILE_PROPS_MAP.keys()).reduce<
		Partial<Record<ExtendedProfileMapKey, string>>
	>((acc, key) => {
		if (EXTENDED_PROFILE_PROPS_MAP.has(key)) {
			acc[key] = extendedData[EXTENDED_PROFILE_PROPS_MAP.get(key)!];
		}
		return acc;
	}, {});

	return {
		...profileProps,
		...extendedProfileProps,
		localTime,
	} as UserDetails;
};

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

type FieldKey =
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

const getFieldConfig = (
	data: MutabilityContraints,
	field: AllFieldKeys,
): SimpleConstraint | undefined => {
	if ((field === 'email' || field === 'picture') && CUSTOM_FIELD_PLACE[field]) {
		return data[CUSTOM_FIELD_PLACE[field]] as SimpleConstraint | undefined;
	}
	const mappedFieldKey =
		field in MUTABILITY_DETAILS_MAP ? MUTABILITY_DETAILS_MAP[field as FieldKey] : undefined;

	if (!mappedFieldKey) {
		return undefined;
	}

	const profileWrite = data['profile.write'] as MutabilityContraints;
	return profileWrite[mappedFieldKey] as SimpleConstraint | undefined;
};

const convertFieldKeyToFieldType = (key: AllFieldKeys): FieldType | undefined => {
	// Check if the key can be mapped to a FieldType value
	if (Object.values<string>(FieldType).includes(key)) {
		return key as FieldType;
	}
	return undefined;
};

const getMutabilityConstraintFor = (
	data: MutabilityContraints,
	field: AllFieldKeys,
): { field: FieldType; reason: string | null } | undefined => {
	const fieldConfig = getFieldConfig(data, field);
	if (!fieldConfig || fieldConfig.allowed) {
		return undefined;
	}

	const convertedField = convertFieldKeyToFieldType(field);
	if (!convertedField) {
		return undefined;
	}

	const reason = fieldConfig.reason;
	return {
		field: convertedField,
		reason: (reason && reason.key) || null,
	};
};

export const transformUserManageConfig = (data: MutabilityContraints) => ({
	mutabilityConstraints: Object.keys(MUTABILITY_DETAILS_MAP)
		.map((field) => getMutabilityConstraintFor(data, field as FieldKey))
		.filter(
			(constraint): constraint is { field: FieldType; reason: string | null } =>
				constraint !== undefined,
		),
});

export const toManageAPIInput = (input: Partial<UserDetails>) => {
	const output: any = {
		extended_profile: {},
	};

	Object.keys(input).forEach((key) => {
		if (PROFILE_PROPS_MAP.has(key as any)) {
			output[PROFILE_PROPS_MAP.get(key as ProfileMapKey)!] = input[key as keyof UserDetails];
		}

		if (EXTENDED_PROFILE_PROPS_MAP.has(key as any)) {
			output.extended_profile[EXTENDED_PROFILE_PROPS_MAP.get(key as ExtendedProfileMapKey)!] =
				input[key as keyof UserDetails];
		}
	});

	return output;
};

export function dataURItoFile(dataURI: string, filename = 'untitled'): Blob | File {
	if (dataURI.length === 0) {
		throw new Error('dataURI not found');
	}

	// convert base64/URLEncoded data component to raw binary data held in a string
	const byteString = dataURI.split(',')[0].includes('base64')
		? atob(dataURI.split(',')[1])
		: decodeURIComponent(dataURI.split(',')[1]);

	// separate out the mime component
	let mimeString: string;
	try {
		mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	} catch (e) {
		mimeString = 'unknown';
	}

	// write the bytes of the string to a typed array
	const intArray = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		intArray[i] = byteString.charCodeAt(i);
	}

	const blob = new Blob([intArray], { type: mimeString });
	try {
		return new File([blob], filename, { type: mimeString });
	} catch (e) {
		// IE11 and Safari does not support the File constructor.
		return blob;
	}
}
