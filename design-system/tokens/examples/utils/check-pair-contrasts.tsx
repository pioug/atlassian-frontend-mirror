import chroma from 'chroma-js';

import generatedPairs from '../../src/artifacts/generated-pairs';
import rawTokensDark from '../../src/artifacts/tokens-raw/atlassian-dark';

export default function checkThemePairContrasts(
  rawTokenSet: typeof rawTokensDark,
  theme: string,
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
      meetsRequiredContrast: meetsContrastRequirement ? 'PASS' : 'FAIL',
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
