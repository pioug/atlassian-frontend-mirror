import { normal } from 'color-blend';

import generatedPairs from '../../../src/artifacts/generated-pairs';
import rawTokensDark from '../../../src/artifacts/tokens-raw/atlassian-dark';
import rawTokensLight from '../../../src/artifacts/tokens-raw/atlassian-light';
import { getContrastRatio, hexToRgbA } from '../../../src/utils/color-utils';

const groupedTokens: { [key: string]: typeof rawTokensDark } = {};
['text', 'link', 'icon', 'border', 'background', 'surface', 'chart'].forEach(
  (type) => {
    groupedTokens[type] = rawTokensDark.filter(
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
  ['background', 'surface'],
  ['text', 'surface'],
  ['link', 'surface'],
  ['icon', 'surface'],
  ['border', 'surface'],
  ['chart', 'surface'],
];

const invalidPairs: {
  foreground: string;
  background: string;
  desiredContrast: number;
}[] = [];

// Iterate over each pairing of token types
groupPairings.forEach((pairing) => {
  // Iterate over the first type of token
  groupedTokens[pairing[0]].forEach((foreground) => {
    groupedTokens[pairing[1]].forEach((background) => {
      if (
        !generatedPairs.find(
          (pairing) =>
            pairing.foreground === foreground.cleanName &&
            pairing.background === background.cleanName,
        )
      ) {
        invalidPairs.push({
          foreground: foreground.cleanName,
          background: background.cleanName,
          desiredContrast: 0,
        });
      }
    });
  });
});

const layeredTokenMap: { [index: string]: string[] } = {
  'color.background.neutral': [
    'color.background.neutral',
    'color.background.neutral.hovered',
    'color.background.neutral.pressed',
  ],
  'color.background.neutral.subtle': [
    'color.background.neutral.subtle',
    'color.background.neutral.subtle.hovered',
    'color.background.neutral.subtle.pressed',
  ],
  'color.background.inverse.subtle': [
    'color.background.inverse.subtle',
    'color.background.inverse.subtle.hovered',
    'color.background.inverse.subtle.pressed',
  ],
};

type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function ArrayToRGBA(
  array: [number, number, number, number] = [0, 0, 0, 0],
): RGBA {
  return {
    r: array[0],
    g: array[1],
    b: array[2],
    a: array[3],
  };
}

function RGBAToString(rgba: RGBA): string {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}

export default function checkThemePairContrasts(
  rawTokenSet: typeof rawTokensDark,
  theme: string,
  checkAll = false,
  isAAA = false,
) {
  9;
  const fullResults: {
    [index: string]: {
      theme: string;
      pairing: string;
      foreground: string;
      middleLayer?: string;
      background: string;
      meetsRequiredContrast: string;
      isInteraction: boolean;
      contrast: number;
      isTextContrast: string;
      isGraphicContrast: string;
    };
  } = {};

  const pairsToCheck: typeof generatedPairs = [...generatedPairs];
  if (checkAll) {
    pairsToCheck.push(...invalidPairs);
  }

  // Iterate over each pairing of token types
  pairsToCheck.forEach(
    ({ foreground, background, desiredContrast, layeredTokens }) => {
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

      // Generate the list of transparent tokens that need to be checked for this pairing
      const layeredTokensToTest: (string | undefined)[] = [undefined];
      layeredTokens?.forEach((layeredToken) => {
        layeredTokensToTest.push(...(layeredTokenMap[layeredToken] || []));
      });

      layeredTokensToTest.forEach((layeredToken) => {
        const layeredTokenMetadata = rawTokenSet.find(
          (rawToken) => rawToken.cleanName === layeredToken,
        );

        if (layeredToken && typeof layeredTokenMetadata?.value !== 'string') {
          return;
        }

        const backgroundValue: string = layeredToken
          ? RGBAToString(
              normal(
                // @ts-ignore
                ArrayToRGBA(hexToRgbA(backgroundMetadata.value)),
                // @ts-ignore
                ArrayToRGBA(hexToRgbA(layeredTokenMetadata.value)),
              ),
            )
          : (backgroundMetadata.value as string);

        var contrast = 0;
        try {
          contrast = getContrastRatio(
            foregroundMetadata.value as string,
            backgroundValue,
          );
        } catch (e) {}

        const isInteraction = !!(
          foreground.match(/(hovered|pressed)/) ||
          background.match(/(hovered|pressed)/)
        );

        let adjustedDesiredContrast = desiredContrast;
        if (isAAA && desiredContrast) {
          adjustedDesiredContrast = desiredContrast === 4.5 ? 7 : 4.5;
        }

        // Account for color space blending differences for transparent tokens with a buffer
        const meetsContrastRequirement = layeredToken
          ? contrast - adjustedDesiredContrast > 0.05
          : contrast >= adjustedDesiredContrast;

        const pairingKey = layeredToken
          ? `${foreground}-${layeredToken}-${background}`
          : `${foreground}-${background}`;

        // Output the required CSV/objects for the artifacts
        fullResults[pairingKey] = {
          theme,
          pairing: `${foregroundMetadata.path[1]}-${backgroundMetadata.path[1]}`,
          foreground: foreground,
          middleLayer: layeredToken,
          background: background,
          meetsRequiredContrast: adjustedDesiredContrast
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
    },
  );

  return {
    generatedPairs,
    fullResults,
  };
}

export const lightResults = checkThemePairContrasts(rawTokensLight, 'light');
export const lightResultsAAA = checkThemePairContrasts(
  rawTokensLight,
  'light',
  false,
  true,
);
export const darkResults = checkThemePairContrasts(rawTokensDark, 'dark');
export const darkResultsAAA = checkThemePairContrasts(
  rawTokensLight,
  'light',
  false,
  true,
);
