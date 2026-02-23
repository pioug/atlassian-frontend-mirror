// @ts-nocheck
const allowedPlatformFeatureFlags = [];

export function getPlatformFeatureFlags() {
	const flags = {};
	if (window.connectHost && window.connectHost.getBooleanFeatureFlag) {
		allowedPlatformFeatureFlags.forEach(
			(key) => (flags[key] = window.connectHost.getBooleanFeatureFlag(key)),
		);
	}
	return flags;
}
