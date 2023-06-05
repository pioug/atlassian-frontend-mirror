import chroma from 'chroma-js';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';

import generatedPairs from '../../src/artifacts/generated-pairs';
import rawTokensDark from '../../src/artifacts/tokens-raw/atlassian-dark';
import rawTokensDarkIteration from '../../src/artifacts/tokens-raw/atlassian-dark-iteration';
import rawTokensLight from '../../src/artifacts/tokens-raw/atlassian-light';

const groupedTokens: { [key: string]: typeof rawTokensDark } = {};
['text', 'link', 'icon', 'border', 'background', 'surface'].forEach((type) => {
  groupedTokens[type] = rawTokensDark.filter(
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
  ['background', 'surface'],
  ['text', 'surface'],
  ['link', 'surface'],
  ['icon', 'surface'],
  ['border', 'surface'],
];

const invalidPairs: {
  foreground: string;
  background: string;
  desiredContrast: undefined;
}[] = [];

// Iterate over each pairing of token types
groupPairings.forEach((pairing) => {
  // Iterate over the first type of token
  groupedTokens[pairing[0]].forEach((foreground) => {
    groupedTokens[pairing[1]].forEach((background) => {
      if (
        generatedPairs.find(
          (pairing) =>
            pairing.foreground === foreground.name &&
            pairing.background === background.name,
        )
      ) {
        return;
      }
      invalidPairs.push({
        foreground: foreground.cleanName,
        background: background.cleanName,
        desiredContrast: undefined,
      });
    });
  });
});

export default function checkThemePairContrasts(
  rawTokenSet: typeof rawTokensDark,
  theme: string,
  checkAll = false,
) {
  const fullResults: {
    [index: string]: {
      theme: string;
      pairing: string;
      token1: string;
      token2: string;
      meetsRequiredContrast: string;
      isInteraction: boolean;
      contrast: number;
      isTextContrast: string;
      isGraphicContrast: string;
    };
  } = {};

  const pairsToCheck: {
    foreground: string;
    background: string;
    desiredContrast: number | undefined;
  }[] = generatedPairs;
  if (checkAll) {
    pairsToCheck.push(...invalidPairs);
  }

  // Iterate over each pairing of token types
  generatedPairs.forEach(({ foreground, background, desiredContrast }) => {
    const [foregroundMetadata, backgroundMetadata] = [
      foreground,
      background,
    ].map((tokenName: string) =>
      rawTokenSet.find((rawToken) => rawToken.cleanName === tokenName),
    );
    // Short circuit if there are missing values
    if (!(foregroundMetadata?.value && backgroundMetadata?.value)) {
      return;
    }
    // Measure contrast
    var contrast = 0;
    try {
      contrast = chroma.contrast(
        foregroundMetadata?.value as string,
        backgroundMetadata?.value as string,
      );
    } catch (e) {}

    const isInteraction = !!(
      foreground.match(/(hovered|pressed)/) ||
      background.match(/(hovered|pressed)/)
    );

    const meetsContrastRequirement = contrast >= desiredContrast;

    const pairingKey = `${foreground}-${background}`;
    // Output the required CSV/objects for the artifacts
    fullResults[pairingKey] = {
      theme,
      pairing: `${foregroundMetadata.path[1]}-${backgroundMetadata.path[1]}`,
      token1: foreground,
      token2: background,
      meetsRequiredContrast: desiredContrast
        ? meetsContrastRequirement
          ? 'PASS'
          : 'FAIL'
        : 'N/A',
      isInteraction,
      contrast,
      isTextContrast: contrast >= 4.5 ? 'PASS' : 'FAIL',
      isGraphicContrast: contrast >= 3 ? 'PASS' : 'FAIL',
    };
  });

  return {
    generatedPairs,
    fullResults,
  };
}

export const lightResults = checkThemePairContrasts(rawTokensLight, 'light');

export const darkResults = checkThemePairContrasts(rawTokensDark, 'dark');

export const rawTokensDarkWithOverrides = flatten(
  Object.values({
    ...groupBy(rawTokensDark, (token) => token.name),
    ...groupBy(rawTokensDarkIteration, (token) => token.name),
  }),
);

export const darkResultsWithOverrides = checkThemePairContrasts(
  rawTokensDarkWithOverrides,
  'dark',
);
