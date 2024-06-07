const FEDRAMP_MODERATE = 'fedramp-moderate';

// Context: https://atlassian.slack.com/archives/C01CQRN5NLT/p1708564986013489?thread_ts=1708302544.655739&cid=C01CQRN5NLT
// This is a temporary function to support SHA256 usage in FedRAMP
// We cannot import the same-named function from @atlassian/atl-context due to emoji being a public package (and atl-context being private)
// TODO: Remove this method and its usage once SHA256 is available in commercial envs for Media uploads
export function isFedRamp(): boolean {
	// MICROS_PERIMETER is already used by few products, so we need to keep it for backward compatibility
	const env = globalThis.MICROS_PERIMETER || globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY;

	if (env) {
		return env === FEDRAMP_MODERATE;
	}

	const matches = globalThis.location?.hostname?.match(
		/atlassian-us-gov-mod\.(com|net)|atlassian-us-gov\.(com|net)|atlassian-fex\.(com|net)|atlassian-stg-fedm\.(com|net)/,
	);

	return matches ? matches.length > 0 : false;
}
