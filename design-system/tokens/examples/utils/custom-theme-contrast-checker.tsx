import generatedPairs from '../../src/artifacts/generated-pairs';
import tokens from '../../src/artifacts/token-names';
import rawTokensDark from '../../src/artifacts/tokens-raw/atlassian-dark';
import rawTokensLight from '../../src/artifacts/tokens-raw/atlassian-light';
import { getContrastRatio } from '../../src/utils/color-utils';

export interface CustomThemeContrastCheckResult {
  contrast: number;
  desiredContrast: number;
  previousContrast: number;
  foreground: {
    tokenName: Token;
    color: string;
  };
  background: {
    tokenName: Token;
    color: string;
  };
  updatedTokens?: Token[];
}

type Token = keyof typeof tokens;

const getColorFromTokenRaw = (
  tokenName: string,
  mode: 'light' | 'dark',
): string => {
  return (mode === 'light' ? rawTokensLight : rawTokensDark).find(
    (rawToken) => rawToken.cleanName === tokenName,
  )?.value as string;
};

export const customThemeContrastChecker = ({
  customThemeTokenMap,
  mode,
  themeRamp,
}: {
  customThemeTokenMap: { [key: string]: number };
  mode: 'light' | 'dark';
  themeRamp: string[];
}): CustomThemeContrastCheckResult[] => {
  const brandTokens = Object.keys(customThemeTokenMap);

  const contrastCheckFailedPairings: CustomThemeContrastCheckResult[] = [];
  generatedPairs.forEach((pairing) => {
    const { background, foreground, desiredContrast } = pairing;
    if (
      !brandTokens.includes(foreground) &&
      !brandTokens.includes(background)
    ) {
      return;
    }

    const rawForegroundColor = getColorFromTokenRaw(foreground, mode);
    const foregroundColor = themeRamp[customThemeTokenMap[foreground] ?? -1];
    const rawBackgroundColor = getColorFromTokenRaw(background, mode);
    const backgroundColor = themeRamp[customThemeTokenMap[background] ?? -1];

    const contrast = getContrastRatio(
      foregroundColor || rawForegroundColor,
      backgroundColor || rawBackgroundColor,
    );

    if (contrast >= desiredContrast) {
      return;
    }

    contrastCheckFailedPairings.push({
      foreground: {
        tokenName: foreground as Token,
        color: foregroundColor || rawForegroundColor,
      },
      background: {
        tokenName: background as Token,
        color: backgroundColor || rawBackgroundColor,
      },
      contrast,
      desiredContrast,
      previousContrast: getContrastRatio(
        rawForegroundColor as string,
        rawBackgroundColor as string,
      ),
    });
  });

  return contrastCheckFailedPairings;
};
