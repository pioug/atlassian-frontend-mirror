import getBrowserMetadata from './get-browser-metadata';

// Helper function to get browser metadata in legacy colon format for backward compatibility
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getBrowserMetadataToLegacyFormat(): Record<string, any> {
	const metadata = getBrowserMetadata();
	const legacyFormat: Record<string, any> = {};

	// Time data
	legacyFormat['event:localHour'] = metadata.time.localHour;
	legacyFormat['event:localDayOfWeek'] = metadata.time.localDayOfWeek;
	legacyFormat['event:localTimezoneOffset'] = metadata.time.localTimezoneOffset;

	// Browser data
	if (metadata.browser) {
		legacyFormat['event:browser:name'] = metadata.browser.name;
		legacyFormat['event:browser:version'] = metadata.browser.version;
	}

	// Webdriver data
	if (metadata.webdriver !== undefined) {
		legacyFormat['event:browser:webdriver'] = metadata.webdriver;
	}

	// Device data
	if (metadata.device) {
		if (metadata.device.cpus !== undefined) {
			legacyFormat['event:cpus'] = metadata.device.cpus;
		}
		if (metadata.device.memory !== undefined) {
			legacyFormat['event:memory'] = metadata.device.memory;
		}
	}

	// Network data
	if (metadata.network) {
		legacyFormat['event:network:effectiveType'] = metadata.network.effectiveType;
		legacyFormat['event:network:rtt'] = metadata.network.rtt;
		legacyFormat['event:network:downlink'] = metadata.network.downlink;
	}

	return legacyFormat;
}
