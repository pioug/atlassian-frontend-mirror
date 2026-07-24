/**
 * Returns true if the current hostname matches the GCP tenant pattern.
 * GCP tenants follow the pattern: <name>-cdp-<cdp-id>.jira-dev.com
 *
 * CDN (CloudFront) is an AWS service and is not available on GCP tenants.
 * This function is used to gate CDN delivery, mirroring the isIsolatedCloud() pattern.
 *
 * @deprecated This is a staging-only hostname heuristic and should not be used for
 * new code. Prefer `isGoogleCloudPlatform()` from `@atlaskit/atlassian-context/cloud-provider`
 * (cookie/SSR-based) to detect GCP tenants. This helper is retained only as a fallback for
 * staging tenants, which do not reliably have a proper value for the
 * `Bifrost-Atl-Ctx-Cloud-Service-Provider` cookie.
 *
 * @param hostname - Optional hostname override (defaults to globalThis.location?.hostname). Used for testing.
 */
export function isGCPtenant(hostname?: string): boolean {
	const host =
		hostname ??
		(typeof globalThis !== 'undefined' ? (globalThis as any).location?.hostname : undefined);
	if (!host) {
		return false;
	}
	const gcpTenantPattern = /^.*-cdp-\w+\.jira-dev\.com$/;
	return gcpTenantPattern.test(host);
}
