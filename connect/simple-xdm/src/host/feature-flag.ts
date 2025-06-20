// @ts-nocheck
const allowedPlatformFeatureFlags = ['platform-visual-refresh-icons'];

export function getPlatformFeatureFlags() {
	const flags = {};
	if (window.connectHost && window.connectHost.getBooleanFeatureFlag) {
		allowedPlatformFeatureFlags.forEach(
			(key) => (flags[key] = window.connectHost.getBooleanFeatureFlag(key)),
		);
	}
	return flags;
}
