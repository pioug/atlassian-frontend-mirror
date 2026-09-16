import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

type NonProductionBuildAnalyticsAttributes = {
	isNonProductionBuild?: boolean;
};

/**
 * Adds a product-owned build classification when the analytics experiment is enabled.
 * A classifier callback is only evaluated in treatment, keeping browser reads out of control.
 * An unknown classification is omitted; an explicit false is preserved.
 */
export const getNonProductionBuildAnalyticsAttributes = (
	classification?: boolean | (() => boolean | undefined),
): NonProductionBuildAnalyticsAttributes => {
	if (!isExperimentEnabled('platform_editor_non_production_build_analytics')) {
		return {};
	}

	const isNonProductionBuild =
		typeof classification === 'function' ? classification() : classification;
	return isNonProductionBuild !== undefined ? { isNonProductionBuild } : {};
};
