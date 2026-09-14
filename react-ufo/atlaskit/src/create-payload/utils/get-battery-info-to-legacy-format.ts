import getBatteryInfo, { type LegacyBatteryInfo } from './get-battery-info';

// Helper function to get battery info in legacy colon format for backward compatibility
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
