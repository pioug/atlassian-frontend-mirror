import chroma from 'chroma-js';
import prettier from 'prettier';
import type { Format, TransformedToken } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import { getTokenId } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';

type ContrastTokenMetadata = {
  name: string;
  value: any;
  type: string;
  role: string;
  emphasis: string;
};

// Manual overrides of auto-detection
// TODO: ensure that these are checked even if they're not in the groupings above
const includePairings = [
  ['color.text.inverse', 'color.text'],
  // These transparencies are in the existing contrast tests but can't be tested by this tool yet
  // ['color.text', 'color.background.inverse.subtle.hovered'],
  // ['color.text', 'color.background.inverse.subtle.pressed'],
  // ['color.text', 'color.background.inverse.subtle'],
  // ['color.text', 'color.background.neutral.hovered'],
  // ['color.text', 'color.background.neutral.pressed'],
  // ['color.text', 'color.background.neutral.subtle.hovered'],
  // ['color.text', 'color.background.neutral.subtle.pressed'],
  // ['color.text', 'color.background.neutral.subtle'],
  // ['color.text', 'color.background.neutral'],
];
const excludePairings = [['color.text.disabled', 'color.background.disabled']];

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
  // Other backgrounds (brand, accent.blue, etc...) are matched with foregrounds that have the same modifier
  const hasMatchingRole = !!(
    foregroundToken.role === backgroundToken.role ||
    // include 'items with no modifiers'
    foregroundToken.role === 'default' ||
    !foregroundToken.role
  );

  const hasStandardBackground =
    (backgroundToken.type === 'background' ||
      backgroundToken.type === 'surface') &&
    !['bold', 'bolder', 'subtle', 'inverse'].includes(backgroundToken.emphasis);

  const hasStandardForeground =
    ['text', 'icon', 'border', 'link'].includes(foregroundToken.type) &&
    foregroundToken.emphasis !== 'inverse';

  const isStandardHasMatchingModifier = !!(
    hasStandardBackground &&
    hasStandardForeground &&
    hasMatchingRole
  );

  // Bold backgrounds are matched with inverse foregrounds, ignoring warnings
  const isBoldPair = !!(
    backgroundToken.type === 'background' &&
    ['bold', 'bolder'].includes(backgroundToken.emphasis) &&
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
    ['text', 'icon'].includes(foregroundToken.type) &&
    foregroundToken.emphasis === 'bolder'
  );

  // All non-background elements, icons, text, except inverse, should work on surfaces
  // TODO what borders need contrast?
  const isSurfacePair = !!(
    backgroundToken.type === 'surface' && hasStandardForeground
  );

  // Subtle and bold backgrounds should work on surfaces
  const surfaceBackgroundPair = !!(
    backgroundToken.type === 'surface' &&
    foregroundToken.type === 'background' &&
    ['bold', 'bolder'].includes(foregroundToken.emphasis)
  );

  // Bold backgrounds need contrast against subtle backgrounds
  const backgroundBackgroundPair = !!(
    backgroundToken.type === 'background' &&
    foregroundToken.type === 'background' &&
    foregroundToken.role === backgroundToken.role &&
    ['bold', 'bolder'].includes(foregroundToken.emphasis) &&
    !['bold', 'bolder', 'subtle'].includes(backgroundToken.emphasis)
  );

  if (
    backgroundToken.type === 'background' &&
    foregroundToken.type === 'background' &&
    !backgroundBackgroundPair
  ) {
    return;
  }

  // skip disabled tokens
  const isDisabledPair =
    backgroundToken.name.includes('disabled') ||
    foregroundToken.name.includes('disabled');

  // TODO can we test opacities?
  // Skip tokens with opacity
  const isTransparent =
    typeof backgroundToken.value === 'string' &&
    typeof foregroundToken.value === 'string' &&
    (chroma(backgroundToken?.value).alpha() < 1 ||
      chroma(foregroundToken?.value).alpha() < 1);

  const isIncludedPairing = !!includePairings.find((value) => {
    return (
      value[0] === foregroundToken.name && value[1] === backgroundToken.name
    );
  });

  const isExcludedPairing = !!excludePairings.find((value) => {
    return (
      value[0] === foregroundToken.name && value[1] === backgroundToken.name
    );
  });

  return (
    isIncludedPairing ||
    (!isExcludedPairing &&
      !isDisabledPair &&
      !isTransparent &&
      (isBoldPair ||
        isBoldWarningPair ||
        isSubtlePair ||
        isStandardHasMatchingModifier ||
        surfaceBackgroundPair ||
        backgroundBackgroundPair ||
        isSurfacePair))
  );
}

export const typescriptTokenPairingsFormatter: Format['formatter'] = ({
  dictionary,
}) => {
  const groupedTokens: { [key: string]: typeof dictionary.allTokens } = {};

  const sortedAllTokens = sortTokens(dictionary.allTokens);

  ['text', 'link', 'icon', 'border', 'background', 'surface'].forEach(
    (type) => {
      groupedTokens[type] = sortedAllTokens.filter(
        (token) =>
          token &&
          token.attributes?.group !== 'palette' &&
          token.attributes?.state === 'active' &&
          token.path[1] === type,
      );
    },
  );

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
  ];

  const pairingsToCheck: { [index: string]: TransformedToken[] } = {};

  // Iterate over each pairing of token types
  groupPairings.forEach((pairing) => {
    // Iterate over the first type of token
    groupedTokens[pairing[0]].forEach((foreground) => {
      groupedTokens[pairing[1]].forEach((background) => {
        pairingsToCheck[
          `${getTokenId(foreground.name)}-${getTokenId(background.name)}`
        ] = [foreground, background];
      });
    });
  });

  // Add included pairings
  includePairings.forEach((pair) => {
    // Skip if the pairing already exists
    if (pairingsToCheck[`${pair[0]}-${pair[1]}`]) {
      return;
    }
    const foreground = sortedAllTokens.find(
      (token) => getTokenId(token.name) === pair[0],
    );
    const background = sortedAllTokens.find(
      (token) => getTokenId(token.name) === pair[1],
    );
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
  }[] = [];

  Object.values(pairingsToCheck).forEach(([foreground, background]) => {
    const [foregroundMetadata, backgroundMetadata] = [
      foreground,
      background,
    ].map((token) => {
      /**
       * This logic is a bit of a hack, required because we don't really store
       * metadata about a token's role, emphasis etc (even in raw format).
       * We have to make some educated guesses based on the token's path.
       */
      var role = token.path[2] === 'accent' ? token.path[3] : token.path[2];
      var emphasis = token.path[2] === 'accent' ? token.path[4] : token.path[3];
      if (
        [
          'subtlest',
          'subtler',
          'subtle',
          'bold',
          'bolder',
          'inverse',
          '[default]',
        ].includes(token.path[2])
      ) {
        role = 'default';
        emphasis = token.path[2];
      }
      return {
        name: getTokenId(token.name || ''),
        value: token.value,
        type: token.path[1],
        role,
        emphasis,
      };
    });

    const possiblePair = classifyTokenPair(
      foregroundMetadata,
      backgroundMetadata,
    );

    // Determine if the pairing passes the required contrast threshold
    // TODO this check is very broad - some text contrasts don't need 4.5:1
    const needsTextContrast =
      possiblePair && foregroundMetadata.type === 'text';

    if (possiblePair) {
      recommendedPairs.push({
        foreground: getTokenId(foregroundMetadata.name),
        background: getTokenId(backgroundMetadata.name),
        desiredContrast: needsTextContrast ? 4.5 : 3,
      });
    }
  });

  // Generate list of pairs
  return prettier.format(
    `export const generatedPairs = ${JSON.stringify(recommendedPairs)};
export default generatedPairs`,
    {
      parser: 'typescript',
      singleQuote: true,
    },
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
