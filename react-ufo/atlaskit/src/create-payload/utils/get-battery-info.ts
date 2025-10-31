import { fg } from '@atlaskit/platform-feature-flags';

// Type definitions for battery info
export interface BatteryInfo {
	level?: number;
	charging?: boolean;
}

export interface LegacyBatteryInfo {
	'event:battery:level'?: number;
	'event:battery:charging'?: boolean;
}

// Main function returns compact nested format
export default async function getBatteryInfo(): Promise<BatteryInfo> {
	if (!fg('react_ufo_battery_info')) {
		return {};
	}

	if (typeof navigator === 'undefined') {
		return {};
	}

	try {
		// Try modern getBattery() API first
		if ('getBattery' in navigator) {
			const battery = await (navigator as any).getBattery();
			if (battery && typeof battery.level === 'number' && typeof battery.charging === 'boolean') {
				return {
					level: Math.round(battery.level * 100) / 100, // Round to 0.01
					charging: battery.charging,
				};
			}
		}
	} catch (error) {
		// Silently ignore errors - battery info is optional
	}

	return {};
}

// Helper function to get battery info in legacy colon format for backward compatibility
export async function getBatteryInfoToLegacyFormat(): Promise<LegacyBatteryInfo> {
	const battery = await getBatteryInfo();
	const legacyFormat: LegacyBatteryInfo = {};

	if (battery.level !== undefined) {
		legacyFormat['event:battery:level'] = battery.level;
	}
	if (battery.charging !== undefined) {
		legacyFormat['event:battery:charging'] = battery.charging;
	}

	return legacyFormat;
}
