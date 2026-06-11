import { fg } from '@atlaskit/platform-feature-flags';

export const MAX_TIMING_NAME_LENGTH = 255;

const GQL_OPERATION_PARAMS = ['operation', 'operationName', 'q'];

function isGqlUrl(name: string): boolean {
	try {
		const url = new URL(name);
		const searchParams = url.search ? new URLSearchParams(url.search) : null;

		return GQL_OPERATION_PARAMS.some((param) => Boolean(searchParams?.get(param)));
	} catch {
		return false;
	}
}

export function sanitizeTimingName(name: string): string {
	if (name.length <= MAX_TIMING_NAME_LENGTH) {
		return name;
	}

	if (isGqlUrl(name) && fg('platform_ufo_exclude_gql_timings_from_length_trim')) {
		return name;
	}

	return name.slice(0, MAX_TIMING_NAME_LENGTH);
}
