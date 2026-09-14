import { type SecondaryExposure } from '@statsig/js-client';

export const migrateSecondaryExposures = (
	secondaryExposures: SecondaryExposure[] | string[],
): Record<string, string>[] => {
	return secondaryExposures.map((exposure) => {
		if (typeof exposure === 'string') {
			// This should ideally have gateValue and ruleID fields too, but it's not possible for us
			// to determine the correct values for these.
			return {
				gate: exposure,
			};
		}

		return exposure;
	});
};
