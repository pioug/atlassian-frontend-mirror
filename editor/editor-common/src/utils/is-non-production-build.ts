type NonProductionBuildAnalyticsAttributes = {
	isNonProductionBuild?: boolean;
};

/**
 * Adds a product-owned build classification to analytics attributes.
 * A classifier callback is evaluated lazily, so the caller controls when browser reads happen.
 * An unknown classification is omitted; an explicit false is preserved.
 */
export const getNonProductionBuildAnalyticsAttributes = (
	classification?: boolean | (() => boolean | undefined),
): NonProductionBuildAnalyticsAttributes => {
	const isNonProductionBuild =
		typeof classification === 'function' ? classification() : classification;
	return isNonProductionBuild !== undefined ? { isNonProductionBuild } : {};
};
