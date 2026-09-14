import { formatInTimeZone } from 'date-fns-tz';

import { EXTENDED_PROFILE_PROPS_MAP } from './extended-profile-props-map';
import type { ExtendedProfileMapKey } from './ExtendedProfileMapKey';
import type { IdentityProfileData } from './IdentityProfileData';
import { PROFILE_PROPS_MAP } from './profile-props-map';
import type { ProfileMapKey } from './ProfileMapKey';
import type { UserDetails } from './utils';

interface IdentityProfileResponse {
	account: IdentityProfileData;
}

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
