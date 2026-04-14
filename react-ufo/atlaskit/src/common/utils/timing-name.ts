import { fg } from '@atlaskit/platform-feature-flags';

export const MAX_TIMING_NAME_LENGTH = 255;

export function sanitizeTimingName(name: string): string {
	if (name.length <= MAX_TIMING_NAME_LENGTH) {
		return name;
	}

	if (fg('platform_ufo_validate_timing_name_length')) {
		return name.slice(0, MAX_TIMING_NAME_LENGTH);
	}

	return name;
}
