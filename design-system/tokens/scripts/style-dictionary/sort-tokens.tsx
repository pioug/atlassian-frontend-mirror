/**
 * This file handles sorting design token output from style-dictionary
 * formatters so we can ensure consistent experiences wherever tokens are consumed.
 */

import type { TransformedToken } from 'style-dictionary';

/**
 * Create specific rules for ordering tokens based on their root path and subpath.
 */
export const tokenOrder = [
  {
    path: 'color',
    subpaths: [
      'text',
      'link',
      'icon',
      'border',
      'background',
      'blanket',
      'interaction',
      'skeleton',
      'chart',
      // deleted ↓
      'accent',
      'iconBorder',
      'overlay',
    ],
  },
  {
    path: 'elevation',
    subpaths: ['surface', 'shadow'],
  },
  {
    path: 'opacity',
    subpaths: [],
  },
  { path: 'shadow', subpaths: ['card', 'overlay'] }, // Deleted
  {
    path: 'utility',
    subpaths: [],
  },
  {
    path: 'space',
    subpaths: [],
  },
  {
    path: 'font',
    subpaths: ['family', 'size', 'weight', 'lineHeight'],
  },
  {
    path: 'typography',
    subpaths: [],
  },
  {
    path: 'value', // Legacy palette
    subpaths: [],
  },
];

const removeDefaultPaths = (token: TransformedToken) =>
  token.path.filter((p) => p !== '[default]');

const getRootPathIndex = (token: TransformedToken) =>
  tokenOrder.findIndex(({ path }) => path === token.path[0]);

const getSubpathIndex = (token: TransformedToken) => {
  const rootPathIndex = getRootPathIndex(token);

  return rootPathIndex !== -1
    ? tokenOrder[rootPathIndex].subpaths.findIndex(
        (path) => path === token.path[1],
      )
    : -1;
};

/**
 * Determines if the target token is the parent of the reference token.
 */
const isTokenParent = (
  target: TransformedToken,
  reference: TransformedToken,
  pathIndex: number,
) => {
  const targetPath = removeDefaultPaths(target);

  return targetPath[targetPath.length - 1] === reference.path[pathIndex - 1];
};

/**
 * Semantic tokens
 */
const semanticTokens = [
  'brand',
  'danger',
  'warning',
  'success',
  'discovery',
  'information',
];

const isSemanticToken = (path: string) => {
  return semanticTokens.includes(path);
};

const getSemanticIndex = (token: TransformedToken, pathIndex: number) =>
  semanticTokens.findIndex((value) => value === token.path[pathIndex]);

/**
 * Emphasis tokens
 * @example color.background.accent.red.subtle
 *
 * In order from subtlest to boldest
 */
const emphasisTokens = [
  'subtlest',
  'subtler',
  'subtle',
  'bold',
  'bolder',
  'boldest',
];

const isEmphasisToken = (token: TransformedToken, path: string) => {
  return (
    token.original.attributes?.group !== 'fontWeight' &&
    emphasisTokens.includes(path)
  );
};

const getEmphasisIndex = (token: TransformedToken, pathIndex: number) =>
  emphasisTokens.findIndex((value) => value === token.path[pathIndex]);

/**
 * Color tokens are defined using the names of colors.
 * @example color.text.accent.blue
 *
 * In rainbow color order 🌈
 */
const colorTokens = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'magenta',
  'gray',
];

const isColorToken = (token: TransformedToken, path: string) => {
  return (
    // Only 'paint' tokens are colors
    token.original.attributes?.group === 'paint' && colorTokens.includes(path)
  );
};

const getColorIndex = (token: TransformedToken, pathIndex: number) =>
  colorTokens.findIndex((value) => value === token.path[pathIndex]);

/**
 * Palette tokens
 *
 * In rainbow color order 🌈
 */
const paletteTokens = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'magenta',
  'gray',
  'light mode neutral',
  'dark mode neutral',
  'opacity',
];

const isPaletteToken = (token: TransformedToken) => {
  return token.attributes?.group === 'palette' && token.attributes?.category;
};

const getPaletteIndex = (token: TransformedToken) =>
  paletteTokens.findIndex((value) => value === token.attributes?.category);

const getPaletteValue = (token: TransformedToken) => {
  const numberStr = token.path[token.path.length - 1].match(/-*\d+/g)?.[0];
  return numberStr ? parseInt(numberStr) : null;
};

const isAlphaPaletteToken = (token: TransformedToken) => {
  return token.path[token.path.length - 1].search(/A$/g) >= 0;
};

/**
 * Sort tokens by root path name according to the predefined order of `tokenOrder`.
 *
 * @example
 * 1. color.text
 * 2. color.link
 * 2. elevation.surface
 */
const sortByPathName = (a: TransformedToken, b: TransformedToken) => {
  /**
   * Separate rules for palette tokens
   */
  if (isPaletteToken(a) && isPaletteToken(b)) {
    /**
     * First, check and order by the palette group
     */
    const aPaletteGroupIndex = getPaletteIndex(a);
    const bPaletteGroupIndex = getPaletteIndex(b);

    if (aPaletteGroupIndex > bPaletteGroupIndex) {
      return 1;
    } else if (aPaletteGroupIndex < bPaletteGroupIndex) {
      return -1;
    }

    /**
     * Sort alpha tokens after their solid equivalents
     */
    const aIsAlpha = isAlphaPaletteToken(a);
    const bIsAlpha = isAlphaPaletteToken(b);
    if (aIsAlpha && !bIsAlpha) {
      return 1;
    } else if (!aIsAlpha && bIsAlpha) {
      return -1;
    }

    /**
     * Parse numerical value from palette token paths
     * and sort by lowest to highest.
     */
    const aPaletteValue = getPaletteValue(a);
    const bPaletteValue = getPaletteValue(b);

    if (aPaletteValue && bPaletteValue) {
      if (aPaletteValue > bPaletteValue) {
        return 1;
      } else if (aPaletteValue < bPaletteValue) {
        return -1;
      }
    }
  }

  const aStrippedPath = removeDefaultPaths(a);
  const bStrippedPath = removeDefaultPaths(b);

  /**
   * For first path, attempt to match against predefined root path order
   * in `tokenOrder`.
   */
  const aRootPathIndex = getRootPathIndex(a);
  const bRootPathIndex = getRootPathIndex(b);

  if (aRootPathIndex > bRootPathIndex) {
    return 1;
  } else if (aRootPathIndex < bRootPathIndex) {
    return -1;
  }

  /**
   * For second path, attempt to match against predefined subpath order
   * in `tokenOrder`.
   *
   * This allows more specific control over ordering when preferred.
   */
  const aSubpathIndex = getSubpathIndex(a);
  const bSubpathIndex = getSubpathIndex(b);

  if (aSubpathIndex > bSubpathIndex) {
    return 1;
  } else if (aSubpathIndex < bSubpathIndex) {
    return -1;
  }

  /**
   * Begin looping over remaining paths
   */
  for (let pathIndex = 0; pathIndex < 10; pathIndex++) {
    const aPath = a.path[pathIndex];
    const bPath = b.path[pathIndex];
    const aIsParent = isTokenParent(a, b, pathIndex);
    const bIsParent = isTokenParent(b, a, pathIndex);

    /**
     * Check if it's an emphasis token.
     *
     * This ensures emphasis tokens are grouped together and in the
     * predefined order of `emphasisTokens`.
     *
     * @example
     * 1. color.background.accent.red.subtlest
     * 2. color.background.accent.red.subtle
     * 3. color.background.accent.red.bold
     * 4. color.background.accent.red.bolder
     */
    const aIsEmphasis = isEmphasisToken(a, aPath);
    const bIsEmphasis = isEmphasisToken(b, bPath);

    if (aIsEmphasis && !bIsEmphasis && !bIsParent) {
      return 1;
    } else if (!aIsEmphasis && bIsEmphasis && !aIsParent) {
      return -1;
    } else if (aIsEmphasis && bIsEmphasis) {
      const aIndex = getEmphasisIndex(a, pathIndex);
      const bIndex = getEmphasisIndex(b, pathIndex);

      if (aIndex > bIndex) {
        return 1;
      } else if (aIndex < bIndex) {
        return -1;
      }
    }

    /**
     * Check if it's a semantic token.
     *
     * This ensures semantic tokens are ordered first,
     * grouped together and in the predefined order of `semanticTokens`.
     *
     * @example
     * 1. color.chart.brand
     * 2. color.chart.brand-hovered
     * 3. color.chart.danger
     * 4. color.chart.danger-hovered
     */
    const aIsSemantic = isSemanticToken(aPath);
    const bIsSemantic = isSemanticToken(bPath);

    if (aIsSemantic && !bIsSemantic && !bIsParent) {
      return 1;
    } else if (!aIsSemantic && bIsSemantic && !aIsParent) {
      return -1;
    } else if (aIsSemantic && bIsSemantic) {
      const aIndex = getSemanticIndex(a, pathIndex);
      const bIndex = getSemanticIndex(b, pathIndex);

      if (aIndex > bIndex) {
        return 1;
      } else if (aIndex < bIndex) {
        return -1;
      }
    }

    /**
     * Check if it's a color token.
     *
     * This ensures color tokens are grouped together and in the
     * predefined order of `colorTokens`.
     *
     * @example
     * 1. color.text.accent.red
     * 2. color.text.accent.orange
     * 3. color.text.accent.yellow
     */
    const aIsColor = isColorToken(a, aPath);
    const bIsColor = isColorToken(b, bPath);

    if (aIsColor && !bIsColor && !bIsParent) {
      return 1;
    } else if (!aIsColor && bIsColor && !aIsParent) {
      return -1;
    } else if (aIsColor && bIsColor) {
      const aIndex = getColorIndex(a, pathIndex);
      const bIndex = getColorIndex(b, pathIndex);

      if (aIndex > bIndex) {
        return 1;
      } else if (aIndex < bIndex) {
        return -1;
      }
    }

    /**
     * Try sorting by numerical value if that path is an integer.
     *
     * This works well for spacing tokens.
     * @example
     * 1. space.0
     * 2. space.150
     * 3. space.1000
     */
    const aInt = parseInt(aPath);
    const bInt = parseInt(bPath);
    if (Number.isInteger(aInt) && Number.isInteger(bInt)) {
      if (aInt > bInt) {
        return 1;
      } else if (aInt < bInt) {
        return -1;
      }
    }

    /**
     * Try sorting by alphabetical order.
     */
    if (aPath > bPath) {
      return 1;
    } else if (aPath < bPath) {
      return -1;
    }

    /**
     * If no other rules match, sort by path length.
     *
     * @example
     * 1. color.icon
     * 2. color.icon.subtle
     * 2. color.icon.accent.blue
     */
    if (aStrippedPath.length - 1 === pathIndex) {
      if (aStrippedPath.length > bStrippedPath.length) {
        return 1;
      } else if (aStrippedPath.length < bStrippedPath.length) {
        return -1;
      }
    }
  }

  return 0;
};

const sortTokens = (tokens: TransformedToken[]) => tokens.sort(sortByPathName);

export default sortTokens;
