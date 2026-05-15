/**
 * Returns true if the current hostname matches the GCP tenant pattern.
 * GCP tenants follow the pattern: <name>-cdp-<cdp-id>.jira-dev.com
 *
 * CDN (CloudFront) is an AWS service and is not available on GCP tenants.
 * This function is used to gate CDN delivery, mirroring the isIsolatedCloud() pattern.
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
