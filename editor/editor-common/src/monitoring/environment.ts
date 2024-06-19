const FEDRAMP_MODERATE = 'fedramp-moderate';

// To determine whether an instance is a FedRAMP instance
// Copied from platform/packages/uip/atl-context/src/services/is-fedramp/index.tsx
// We cannot import the same-named function from @atlassian/atl-context due to editor-common being a public package (and atl-context being private)
// TODO: Seek alternatives
export function isFedRamp(): boolean {
	const global: any = globalThis;
	// MICROS_PERIMETER is already used by few products, so we need to keep it for backward compatibility
	const env = global.MICROS_PERIMETER || global.UNSAFE_ATL_CONTEXT_BOUNDARY;

	if (env) {
		return env === FEDRAMP_MODERATE;
	}

	const matches = global.location?.hostname?.match(
		/atlassian-us-gov-mod\.(com|net)|atlassian-us-gov\.(com|net)|atlassian-fex\.(com|net)|atlassian-stg-fedm\.(com|net)/,
	);

	return matches ? matches.length > 0 : false;
}
