import Bowser from 'bowser-ultralight';

export default function getBrowserMetadata() {
	const data: {
		browser?: {
			name: string;
			version: string;
		};
		device?: {
			cpus?: number;
			memory?: number;
		};
		network?: {
			effectiveType: string;
			rtt: number;
			downlink: number;
		};
		time: {
			localHour: number;
			localDayOfWeek: number;
			localTimezoneOffset: number;
		};
	} = {
		time: {
			localHour: 0,
			localDayOfWeek: 0,
			localTimezoneOffset: 0,
		},
	};

	const now = new Date();
	data.time.localHour = now.getHours(); // returns the hours for this date according to local time
	data.time.localDayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
	data.time.localTimezoneOffset = now.getTimezoneOffset(); // A number representing the difference, in minutes, between the date as evaluated in the UTC time zone and as evaluated in the local time zone.

	if (typeof navigator !== 'undefined' && navigator.userAgent != null) {
		const browser = Bowser.getParser(navigator.userAgent);
		data.browser = {
			name: browser.getBrowserName(),
			version: browser.getBrowserVersion(),
		};
	}

	if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency != null) {
		if (!data.device) {
			data.device = {};
		}
		data.device.cpus = navigator.hardwareConcurrency;
	}

	if (typeof navigator !== 'undefined' && (navigator as any).deviceMemory != null) {
		if (!data.device) {
			data.device = {};
		}
		data.device.memory = (navigator as any).deviceMemory;
	}

	// eslint-disable-next-line compat/compat
	if (typeof navigator !== 'undefined' && (navigator as any).connection != null) {
		data.network = {
			effectiveType: (navigator as any).connection.effectiveType,
			rtt: (navigator as any).connection.rtt,
			downlink: (navigator as any).connection.downlink,
		};
	}

	return data;
}

// Helper function to get browser metadata in legacy colon format for backward compatibility
export function getBrowserMetadataToLegacyFormat() {
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
