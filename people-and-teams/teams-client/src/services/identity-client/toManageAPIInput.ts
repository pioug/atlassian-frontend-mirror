import { EXTENDED_PROFILE_PROPS_MAP } from './extended-profile-props-map';
import type { ExtendedProfileMapKey } from './ExtendedProfileMapKey';
import { PROFILE_PROPS_MAP } from './profile-props-map';
import type { ProfileMapKey } from './ProfileMapKey';
import type { UserDetails } from './utils';

export const toManageAPIInput = (input: Partial<UserDetails>): any => {
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
