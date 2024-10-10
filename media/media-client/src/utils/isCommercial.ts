export function isCommercial(): boolean {
	const global: any = globalThis;

	const perimeter = global.MICROS_PERIMETER || global.UNSAFE_ATL_CONTEXT_BOUNDARY;

	if (perimeter) {
		// Note: reference to MICROS_PERIMETER can be found in: https://hello.atlassian.net/wiki/spaces/MICROS/pages/167212650/Runtime+configuration+environment+variables+and+adding+secrets#Micros-provided-variables
		return perimeter === 'commercial';
	}

	// Return true if the current hostname does NOT match any of the forbidden patterns.
	return !global.location?.hostname?.match(
		/(atlassian-us-gov-mod\.(com|net)|atlassian-us-gov\.(com|net)|atlassian-fex\.(com|net)|atlassian-stg-fedm\.(com|net))/,
	);
}
