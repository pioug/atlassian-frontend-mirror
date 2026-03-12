import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';

// Constants
const FRONTEND_LAYER = 'fe' as const;
const ABSENT_FEATURE_TYPE = 'feature-type-absent' as const;
const ABSENT_FEATURE_NAME = 'feature-name-absent' as const;

/**
 * Header name for valid experience keys (when active interaction exists)
 */
export const EXPERIENCE_KEY_HEADER_NAME = 'atl-paas-cnsmr-ctx-experience-key' as const;

/**
 * Header name for missing experience keys (when no active interaction)
 */
export const MISSING_EXPERIENCE_KEY_HEADER_NAME =
	'atl-paas-missing-experience-key-product' as const;

/**
 * Feature flag name for controlling which products should inject UFO experience key headers.
 * This is a dynamic/experiment flag with a list parameter of allowed products.
 *
 * To be used in product-specific code (e.g., Jira's observability-headers.tsx):
 * ```tsx
 * const allowedProducts = FeatureGates.getExperimentValue(
 *   ALLOWED_PRODUCTS_EXPERIMENT_NAME,
 *   'allowed_products',
 *   [] // default: no products allowed
 * );
 * if (allowedProducts.includes(PRODUCT_NAMES.JIRA)) {
 *   // Inject headers
 * }
 * ```
 *
 * Note: Platform packages cannot directly use experiments due to architectural constraints.
 * Products should handle the feature flag check themselves before using this function.
 */
export const ALLOWED_PRODUCTS_EXPERIMENT_NAME =
	'platform_ufo_experience_key_allowed_products' as const;

/**
 * Derives the load type from UFO interaction type.
 * Maps UFO interaction types to standardized load type strings.
 *
 * @param ufoInteractionType - The type from getActiveInteraction()?.type
 * @returns The load type string: "page-load", "page-segment-load", or "inline-result"
 */
function deriveLoadType(ufoInteractionType: string | undefined): string {
	if (ufoInteractionType === 'page_load' || ufoInteractionType === 'transition') {
		return 'page-load';
	}

	if (ufoInteractionType === 'segment') {
		return 'page-segment-load';
	}

	return 'inline-result';
}

/**
 * Builds the absent experience key when no active interaction exists.
 * Format: "product.fe.feature-type-absent.feature-name-absent"
 *
 * @param product - The product name
 * @returns The absent experience key string
 */
function buildAbsentExperienceKey(product: string): string {
	return `${product}.${FRONTEND_LAYER}.${ABSENT_FEATURE_TYPE}.${ABSENT_FEATURE_NAME}`;
}

/**
 * Builds the UFO experience key when an active interaction exists.
 * Format: "product.fe.loadType.featureName"
 *
 * @param product - The product name
 * @param featureName - The ufoName from active interaction
 * @param loadType - The derived load type
 * @returns The experience key string
 */
function buildActiveExperienceKey(product: string, featureName: string, loadType: string): string {
	return `${product}.${FRONTEND_LAYER}.${loadType}.${featureName}`;
}

/**
 * Builds the UFO experience key representing which frontend feature initiated a request.
 *
 * Returns in the format:
 * - When active: "product.fe.loadType.featureName"
 * - When absent: "product.fe.feature-type-absent.feature-name-absent"
 *
 * **Note:** This function always returns a value, never undefined or null.
 *
 * @param product - The product name - use PRODUCT_NAMES constants for type safety
 * @returns The complete experience key string
 *
 * @example
 * import { getUfoExperienceKey, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';
 *
 * const key = getUfoExperienceKey(PRODUCT_NAMES.JIRA);
 * // With active interaction: "jira.fe.page-load.issueView"
 * // Without interaction: "jira.fe.feature-type-absent.feature-name-absent"
 */
export function getUfoExperienceKey(product: string): string {
	const activeInteraction = getActiveInteraction();

	// No interaction exists
	if (!activeInteraction?.ufoName) {
		return buildAbsentExperienceKey(product);
	}

	const loadType = deriveLoadType(activeInteraction.type);
	return buildActiveExperienceKey(product, activeInteraction.ufoName, loadType);
}

/**
 * Returns the experience key header to be inserted in GraphQL/HTTP requests.
 * This header tracks which frontend feature/experience initiated the request.
 *
 * Returns one of two header formats:
 * - **Active interaction exists:**
 *   `{ 'atl-paas-cnsmr-ctx-experience-key': 'product.fe.loadType.featureName' }`
 *
 * - **No active interaction:**
 *   `{ 'atl-paas-missing-experience-key-product': 'product' }`
 *
 * **Note:** This function always returns a header object, never undefined or null.
 *
 * The feature flag `platform_ufo_experience_key_allowed_products` should be checked by
 * each product before calling this function. See ALLOWED_PRODUCTS_EXPERIMENT_NAME for details.
 *
 * @param product - The product name - use PRODUCT_NAMES constants for type safety
 * @returns Header object with experience key or missing product indicator
 *
 * @example
 * import { getUfoExperienceKeyHeader, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';
 *
 * const headers = {
 *   'Content-Type': 'application/json',
 *   ...getUfoExperienceKeyHeader(PRODUCT_NAMES.JIRA),
 * };
 * // With interaction: { 'atl-paas-cnsmr-ctx-experience-key': 'jira.fe.page-load.issueView' }
 * // Without: { 'atl-paas-missing-experience-key-product': 'jira' }
 */
export const getUfoExperienceKeyHeader = (
	product: string,
): { [EXPERIENCE_KEY_HEADER_NAME]: string } | { [MISSING_EXPERIENCE_KEY_HEADER_NAME]: string } => {
	const activeInteraction = getActiveInteraction();

	// No interaction exists - return simplified missing header with just product name
	if (!activeInteraction?.ufoName) {
		return {
			[MISSING_EXPERIENCE_KEY_HEADER_NAME]: product,
		};
	}

	// Active interaction exists - build and return full experience key
	const loadType = deriveLoadType(activeInteraction.type);
	const experienceKey = buildActiveExperienceKey(product, activeInteraction.ufoName, loadType);

	return {
		[EXPERIENCE_KEY_HEADER_NAME]: experienceKey,
	};
};

/**
 * Merges UFO experience key headers into an existing headers object.
 * This is a convenience utility for code that constructs headers manually.
 *
 * @param product - The product name - use PRODUCT_NAMES constants for type safety
 * @param existingHeaders - Optional existing headers to merge with
 * @returns Headers object with UFO experience key headers merged in
 *
 * @example
 * ```typescript
 * import { mergeUfoExperienceKeyHeaders, PRODUCT_NAMES } from '@atlaskit/ufo-experience-key';
 *
 * const headers = mergeUfoExperienceKeyHeaders(PRODUCT_NAMES.JIRA, {
 *   'Content-Type': 'application/json',
 *   'Authorization': 'Bearer token'
 * });
 *
 * fetch('/gateway/api/graphql', {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify(...)
 * });
 * ```
 */
export const mergeUfoExperienceKeyHeaders = (
	product: string,
	existingHeaders?: Record<string, string>,
): Record<string, string> => {
	const ufoExperienceKeyHeaders = getUfoExperienceKeyHeader(product);

	return {
		...existingHeaders,
		...ufoExperienceKeyHeaders,
	};
};
