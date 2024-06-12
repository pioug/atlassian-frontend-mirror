import type { Format, TransformedToken } from 'style-dictionary';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { getAlpha } from '../../../src/utils/color-utils';
import { getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

type ContrastTokenMetadata = {
	name: string;
	value: any;
	type: string;
	role: string;
	emphasis: string;
};

const isInteractiveOverlay = (token: ContrastTokenMetadata) =>
	['elevation.surface.overlay.pressed', 'elevation.surface.overlay.hovered'].includes(token.name);

// Manual overrides of auto-detection
const includePairings: [string, string][] = [];
const excludePairings: [string, string][] = [];

/**
 * Classify whether a pair of tokens are a valid pairing that needs to meet some WCAG contrast requirement
 * Does not discriminate between 3:1 or 4.5:1 pairings currently
 *
 * @param foreground Foreground token for comparison
 * @param background Background token for comparison
 * @returns boolean representing whether the token is a valid pairing or not
 */
function classifyTokenPair(
	foregroundToken: ContrastTokenMetadata,
	backgroundToken: ContrastTokenMetadata,
) {
	// Special case: background.brand.subtlest should be paired with text.brand
	if (
		foregroundToken.name === 'color.text.brand' &&
		backgroundToken.name === 'color.background.brand.subtlest'
	) {
		return true;
	}

	// Other backgrounds (brand, accent.blue, etc...) are matched with foregrounds that have the same modifier
	const hasMatchingRole = !!(
		foregroundToken.role === backgroundToken.role ||
		// include 'items with no modifiers'
		foregroundToken.role === 'default' ||
		!foregroundToken.role
	);

	// Other backgrounds (brand, accent.blue, etc...) are matched with foregrounds that have the same modifier
	const hasStandardBackground =
		backgroundToken.type === 'background' &&
		(!['bold', 'bolder', 'boldest', 'subtle', 'inverse'].includes(backgroundToken.emphasis) ||
			(['subtle', 'inverse'].includes(backgroundToken.emphasis) &&
				['neutral', 'default'].includes(backgroundToken.role)));

	const hasStandardForeground =
		['text', 'icon', 'border', 'link', 'chart'].includes(foregroundToken.type) &&
		foregroundToken.emphasis !== 'inverse';

	const isStandardHasMatchingModifier = !!(
		hasStandardBackground &&
		hasStandardForeground &&
		hasMatchingRole &&
		// Special case for subtlest text
		!(
			foregroundToken.name === 'color.text.subtlest' &&
			['subtler'].includes(backgroundToken.emphasis)
		)
	);

	// Bold backgrounds are matched with inverse foregrounds, ignoring warnings
	const isBoldPair = !!(
		backgroundToken.type === 'background' &&
		['bold', 'bolder', 'boldest'].includes(backgroundToken.emphasis) &&
		['text', 'icon', 'border'].includes(foregroundToken.type) &&
		foregroundToken.emphasis === 'inverse' &&
		hasMatchingRole &&
		// Exclude warning
		backgroundToken.role !== 'warning' &&
		foregroundToken.role !== 'warning'
	);

	// Warnings need to be matched with inverse warnings
	const isBoldWarningPair = !!(
		backgroundToken.type === 'background' &&
		backgroundToken.role === 'warning' &&
		backgroundToken.emphasis === 'bold' &&
		['text', 'icon', 'border'].includes(foregroundToken.type) &&
		foregroundToken.role === 'warning' &&
		foregroundToken.emphasis === 'inverse'
	);

	// Subtle backgrounds are matched with bold foregrounds
	const isSubtlePair = !!(
		backgroundToken.type === 'background' &&
		backgroundToken.emphasis === 'subtle' &&
		hasMatchingRole &&
		backgroundToken.role !== 'neutral' &&
		['text', 'icon'].includes(foregroundToken.type) &&
		foregroundToken.emphasis === 'bolder'
	);

	// All non-background elements, icons, text, except inverse, should work on surfaces
	const isSurfacePair = !!(
		backgroundToken.type === 'surface' &&
		!isInteractiveOverlay(backgroundToken) &&
		hasStandardForeground
	);

	// Only basic text/icons go on hovered/pressed overlay surfaces (as they're just for buttons)
	const isInteractiveOverlaySurfacePair = !!(
		isInteractiveOverlay(backgroundToken) &&
		['icon', 'text'].includes(foregroundToken.type) &&
		foregroundToken.emphasis === 'default' &&
		foregroundToken.role === 'default'
	);

	// Subtle and bold backgrounds should work on surfaces
	const surfaceBackgroundPair = !!(
		backgroundToken.type === 'surface' &&
		!isInteractiveOverlay(backgroundToken) &&
		foregroundToken.type === 'background' &&
		['bold', 'bolder', 'boldest'].includes(foregroundToken.emphasis)
	);

	// Bold backgrounds need contrast against subtle backgrounds
	const backgroundBackgroundPair = !!(
		backgroundToken.type === 'background' &&
		foregroundToken.type === 'background' &&
		foregroundToken.role === backgroundToken.role &&
		['bold', 'bolder', 'boldest'].includes(foregroundToken.emphasis) &&
		!['bold', 'bolder', 'boldest', 'subtle'].includes(backgroundToken.emphasis)
	);

	if (
		backgroundToken.type === 'background' &&
		foregroundToken.type === 'background' &&
		!backgroundBackgroundPair
	) {
		return;
	}

	// skip default border
	const isDefaultBorder = foregroundToken.name === 'color.border';

	// skip disabled tokens
	const isDisabledPair =
		backgroundToken.name.includes('disabled') || foregroundToken.name.includes('disabled');

	const isTransparent =
		typeof backgroundToken.value === 'string' &&
		typeof foregroundToken.value === 'string' &&
		(getAlpha(backgroundToken?.value) < 1 || getAlpha(foregroundToken?.value) < 1);

	const isIncludedPairing = !!includePairings.find((value) => {
		return value[0] === foregroundToken.name && value[1] === backgroundToken.name;
	});

	const isExcludedPairing = !!excludePairings.find((value) => {
		return value[0] === foregroundToken.name && value[1] === backgroundToken.name;
	});

	return (
		isIncludedPairing ||
		(!isExcludedPairing &&
			!isDisabledPair &&
			!isDefaultBorder &&
			!isTransparent &&
			(isBoldPair ||
				isBoldWarningPair ||
				isSubtlePair ||
				isStandardHasMatchingModifier ||
				surfaceBackgroundPair ||
				backgroundBackgroundPair ||
				isSurfacePair ||
				isInteractiveOverlaySurfacePair))
	);
}

export const typescriptTokenPairingsFormatter: Format['formatter'] = ({ dictionary }) => {
	const groupedTokens: { [key: string]: typeof dictionary.allTokens } = {};

	const sortedAllTokens = sortTokens(dictionary.allTokens);

	// Filter out inactive non-color tokens
	['text', 'link', 'icon', 'border', 'chart', 'background', 'surface'].forEach((type) => {
		groupedTokens[type] = sortedAllTokens.filter(
			(token) =>
				token &&
				token.attributes?.group !== 'palette' &&
				token.attributes?.state === 'active' &&
				token.path[1] === type,
		);
	});

	const groupPairings = [
		['text', 'background'],
		['link', 'background'],
		['icon', 'background'],
		['border', 'background'],
		['background', 'background'],
		['background', 'surface'],
		['text', 'surface'],
		['link', 'surface'],
		['icon', 'surface'],
		['border', 'surface'],
		['chart', 'surface'],
	];

	// Create all pairings of the above types of tokens
	const pairingsToCheck: { [index: string]: TransformedToken[] } = {};
	// Iterate over each pairing of token types
	groupPairings.forEach((pairing) => {
		// Iterate over the first type of token
		groupedTokens[pairing[0]].forEach((foreground) => {
			groupedTokens[pairing[1]].forEach((background) => {
				pairingsToCheck[`${getTokenId(foreground.name)}-${getTokenId(background.name)}`] = [
					foreground,
					background,
				];
			});
		});
	});

	// Add included pairings
	includePairings.forEach((pair) => {
		// Skip if the pairing already exists
		if (pairingsToCheck[`${pair[0]}-${pair[1]}`]) {
			return;
		}
		const foreground = sortedAllTokens.find((token) => getTokenId(token.name) === pair[0]);
		const background = sortedAllTokens.find((token) => getTokenId(token.name) === pair[1]);
		if (foreground && background) {
			pairingsToCheck[`${pair[0]}-${pair[1]}`] = [foreground, background];
		}
	});

	// Remove excluded pairings
	excludePairings.forEach((pair) => {
		// Skip if the pairing already exists
		if (pairingsToCheck[`${pair[0]}-${pair[1]}`]) {
			delete pairingsToCheck[`${pair[0]}-${pair[1]}`];
		}
	});

	const recommendedPairs: {
		foreground: string;
		background: string;
		desiredContrast: number;
		layeredTokens?: string[];
	}[] = [];

	// Iterate over each pairing and determine if it is recommended
	Object.values(pairingsToCheck).forEach(([foreground, background]) => {
		const [foregroundMetadata, backgroundMetadata] = [foreground, background].map((token) => {
			/**
			 * This logic is a bit of a hack, required because we don't really store
			 * metadata about a token's role, emphasis etc (even in raw format).
			 * We have to make some educated guesses based on the token's path.
			 */
			const validInteractions = ['hovered', 'pressed', 'visited'];
			const validEmphasis = [
				'subtlest',
				'subtler',
				'subtle',
				'bold',
				'bolder',
				'inverse',
				'[default]',
			];
			var role = token.path[2] !== 'accent' ? token.path[2] : token.path[3];
			var emphasis = token.path[2] !== 'accent' ? token.path[3] : token.path[4];
			if (validEmphasis.includes(role)) {
				// role skipped
				role = 'default';
				emphasis = token.path[2];
			}
			if (validInteractions.includes(role)) {
				// role and emphasis skipped
				role = 'default';
				emphasis = 'default';
			}
			if (!emphasis || emphasis === '[default]' || validInteractions.includes(emphasis)) {
				emphasis = 'default';
			}
			return {
				name: getTokenId(token.name || ''),
				value: token.value,
				type: token.path[1],
				role,
				emphasis,
			};
		});

		const possiblePair = classifyTokenPair(foregroundMetadata, backgroundMetadata);

		// Determine if any transparent tokens are layered in between the pairing
		const layeredTokens: string[] = [];
		if (
			// @ts-expect-error - This condition will always return true since this function is always defined. Did you mean to call it instead?
			// This error was introduced after upgrading to TypeScript 5
			(backgroundMetadata.type === 'surface' && isInteractiveOverlay) ||
			(backgroundMetadata.type === 'background' &&
				['default', 'subtlest'].includes(backgroundMetadata.emphasis))
		) {
			layeredTokens.push('color.background.neutral.subtle', 'color.background.neutral');
		}

		if (
			backgroundMetadata.type === 'background' &&
			['bold', 'bolder', 'boldest'].includes(backgroundMetadata.emphasis)
		) {
			layeredTokens.push('color.background.inverse.subtle');
		}

		// Determine if the pairing passes the required contrast threshold
		// TODO this check is very broad - some text contrasts don't need 4.5:1
		const needsTextContrast = possiblePair && ['text', 'link'].includes(foregroundMetadata.type);

		if (possiblePair) {
			recommendedPairs.push({
				foreground: getTokenId(foregroundMetadata.name),
				background: getTokenId(backgroundMetadata.name),
				desiredContrast: needsTextContrast ? 4.5 : 3,
				...(layeredTokens.length > 0 && { layeredTokens }),
			});
		}
	});

	// Generate list of pairs
	return format(
		`export const generatedPairs = ${JSON.stringify(recommendedPairs)};
export default generatedPairs`,
		'typescript',
	);
};

const fileFormatter: Format['formatter'] = (args) =>
	createSignedArtifact(
		typescriptTokenPairingsFormatter(args),
		`yarn build tokens`,
		`Auto-generated list of token pairings that may need to have sufficient contrast.
  Not currently used by tests, but is used by the custom theme contrast checker example`,
	);

export default fileFormatter;
