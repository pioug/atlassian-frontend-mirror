/** @jsx jsx */
import { useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';

import Button, { ButtonGroup } from '@atlaskit/button';
import Calendar from '@atlaskit/calendar';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { Radio } from '@atlaskit/radio';
import Select from '@atlaskit/select';

import { setGlobalTheme, token } from '../src';
import { ThemeOptionsSchema } from '../src/theme-config';
import { getContrastRatio } from '../src/utils/color-utils';
import {
  generateColors,
  generateTokenMapWithContrastCheck,
} from '../src/utils/generate-custom-color-ramp';

import Accordion from './contrast-checker-utils/components/accordion';
import ContrastCard from './contrast-checker-utils/components/contrast-card';
import {
  customThemeContrastChecker,
  CustomThemeContrastCheckResult,
} from './utils/custom-theme-contrast-checker';

const colorContainerStyles = css({
  boxSizing: 'border-box',
  height: '72px',
  paddingTop: '28px',
  position: 'relative',
  flex: 1,
  textAlign: 'center',
  transition: 'all 0.2s',
  '&:hover': {
    height: '80px',
    marginTop: '-8px',
    paddingTop: '8px',
    borderRadius: '3px 3px 0 0',
    span: {
      bottom: 8,
      opacity: 1,
    },
    p: {
      opacity: 0,
    },
  },
});

type HEX = `#${string}`;

export default () => {
  const [customTheme, setCustomTheme] = useState<ThemeOptionsSchema>({
    brandColor: '#65D26E',
  });
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const [themeRamp, setThemeRamp] = useState<string[]>([]);
  const [darkTokens, setDarkTokens] = useState<{
    [key: string]: number | string;
  }>({});
  const [lightTokens, setLightTokens] = useState<{
    [key: string]: number | string;
  }>({});
  const [contrastCheckResults, setContrastCheckResults] = useState<
    CustomThemeContrastCheckResult[]
  >([]);

  useEffect(() => {
    setGlobalTheme({
      colorMode: colorMode,
      UNSAFE_themeOptions: customTheme,
      spacing: 'spacing',
    });
    const themeRamp = generateColors(customTheme.brandColor).ramp;
    setThemeRamp(themeRamp);

    const tokenMaps = generateTokenMapWithContrastCheck(
      customTheme.brandColor,
      'auto',
      themeRamp,
    );
    setLightTokens(tokenMaps.light!);
    setDarkTokens(tokenMaps.dark!);

    const contrastCheckResults = customThemeContrastChecker({
      customThemeTokenMap:
        colorMode === 'light' ? tokenMaps.light! : tokenMaps.dark!,
      mode: colorMode,
      themeRamp,
    });
    setContrastCheckResults(contrastCheckResults);
  }, [customTheme, colorMode]);

  const debouncedBrandColorChange = debounce((brandColor: HEX) => {
    setCustomTheme({
      ...customTheme,
      brandColor,
    });
  }, 150);

  const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedBrandColorChange(e.target.value as HEX);
  };

  const betterContrastResults = contrastCheckResults.filter(
    (pairing) => pairing.contrast >= pairing.previousContrast,
  );

  const worseContrastResults = contrastCheckResults.filter(
    (pairing) => pairing.contrast < pairing.previousContrast,
  );

  const newBreachContrastResults = contrastCheckResults.filter(
    (pairing) =>
      pairing.contrast < pairing.desiredContrast &&
      pairing.previousContrast > pairing.desiredContrast,
  );

  const renderContrastResults = useCallback(
    (results: CustomThemeContrastCheckResult[]) => {
      return results.map((pairing) => {
        const {
          foreground: { tokenName: foregroundName, color: foregroundValue },
          background: { tokenName: backgroundName, color: backgroundValue },
          contrast,
          previousContrast,
        } = pairing;
        return (
          <ContrastCard
            key={foregroundName + '-' + backgroundName}
            foregroundName={foregroundName}
            foregroundValue={foregroundValue}
            backgroundName={backgroundName}
            backgroundValue={backgroundValue}
            contrastBase={previousContrast.toPrecision(4)}
            contrastCustom={contrast.toPrecision(4)}
            baseThemeType={colorMode}
            // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
            style={{ marginBottom: token('space.050', '4px') }}
          />
        );
      });
    },
    [colorMode],
  );

  const renderTokenColor = (value: number | string, isLight?: boolean) => {
    const color = typeof value === 'string' ? value : themeRamp[value];
    const rampValue = typeof value === 'string' ? value : `X${value + 1}00`;
    return (
      <code
        style={{
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          backgroundColor: color,
          color: getContrastRatio('#ffffff', color) >= 4.5 ? 'white' : 'black',
          borderRadius: '24px',
          padding: '0 4px',
          whiteSpace: 'nowrap',
        }}
      >
        {isLight ? 'Light: ' : 'Dark: '}
        {rampValue}
      </code>
    );
  };

  return (
    <Box padding="space.200" testId="custom-theming">
      <Stack space={'space.200'}>
        <Box
          padding="space.200"
          style={{ width: 'fit-content' }}
          xcss={xcss({
            borderColor: 'color.border',
            borderWidth: 'border.width',
            borderRadius: 'border.radius.050',
            borderStyle: 'solid',
          })}
        >
          <Stack space="space.100">
            <Inline space="space.100">
              <p id="brandColor">Brand color:</p>
              <input
                aria-labelledby="brandColor"
                type="color"
                value={customTheme?.brandColor}
                onChange={onColorChange}
              />
            </Inline>

            <Inline space="space.100">
              <p id="baseTheme">Base theme:</p>
              <Select
                aria-labelledby="baseTheme"
                value={
                  colorMode === 'light'
                    ? { label: 'Light mode', value: 'light' }
                    : { label: 'Dark mode', value: 'dark' }
                }
                options={[
                  { label: 'Light mode', value: 'light' },
                  { label: 'Dark mode', value: 'dark' },
                ]}
                onChange={(e) =>
                  setColorMode((e?.value as 'light' | 'dark') || 'light')
                }
              />
            </Inline>
          </Stack>
        </Box>
        {themeRamp.length > 0 && (
          <Inline>
            {themeRamp.map((colorString, i) => (
              <div
                key={colorString}
                css={colorContainerStyles}
                style={{
                  background: colorString,
                  color:
                    getContrastRatio('#ffffff', colorString) >= 4.5
                      ? 'white'
                      : 'black',
                }}
              >
                {colorString === customTheme.brandColor && (
                  <Box
                    as="p"
                    xcss={xcss({
                      width: '100%',
                      paddingTop: 8,
                      position: 'absolute',
                      top: 'space.0',
                      transition: 'all 0.2s',
                    })}
                  >
                    Brand
                  </Box>
                )}
                <b>
                  X{i + 1}
                  00
                </b>
                <Box
                  as="span"
                  xcss={xcss({
                    boxSizing: 'border-box',
                    width: '100%',
                    position: 'absolute',
                    bottom: 'space.0',
                    left: 'space.0',
                    opacity: 0,
                    textAlign: 'center',
                    transition: 'all 0.3s',
                  })}
                >
                  {colorString}
                </Box>
              </div>
            ))}
          </Inline>
        )}
        <Stack space="space.100">
          <Heading level="h700">Modified tokens</Heading>

          {Object.entries(lightTokens).map(([tokenName, value]) => {
            return (
              <Box
                key={tokenName}
                paddingInline="space.100"
                paddingBlock="space.050"
                xcss={xcss({
                  border: `1px solid ${token('color.border')}`,
                  width: 'fit-content',
                  borderRadius: 'border.radius.circle',
                })}
              >
                <Inline space="space.100">
                  {renderTokenColor(value, true)}
                  {renderTokenColor(darkTokens[tokenName])}
                  <code>{tokenName}</code>
                </Inline>
              </Box>
            );
          })}
        </Stack>
        {contrastCheckResults.length ? (
          <Stack space="space.100">
            <Inline space="space.100" alignBlock="center">
              <Heading level="h700">Contrast check results</Heading>
              <Lozenge appearance="moved">
                {contrastCheckResults.length}
              </Lozenge>
            </Inline>
            <Accordion
              size={newBreachContrastResults.length}
              appearance="danger"
              description="Pairings that now breach:"
            >
              {renderContrastResults(newBreachContrastResults)}
            </Accordion>
            <Accordion
              size={betterContrastResults.length}
              appearance="success"
              description="Pairings with better contrast:"
            >
              {renderContrastResults(betterContrastResults)}
            </Accordion>
            <Accordion
              size={worseContrastResults.length}
              appearance="warning"
              description="Pairings with worse contrast:"
            >
              {renderContrastResults(worseContrastResults)}
            </Accordion>
          </Stack>
        ) : null}
        <Stack space="space.200">
          <Heading level="h700">Component examples</Heading>
          <Inline space="space.100">
            <Stack space="space.100">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#">Test link</a>
              <ButtonGroup>
                <Button appearance="primary">Primary button</Button>
                <Button selected={true} isSelected={true}>
                  Selected button
                </Button>
              </ButtonGroup>
              <Stack>
                <Checkbox
                  value="Checkbox"
                  label="Checkbox"
                  isChecked={true}
                  name="checkbox-basic"
                />
                <Radio
                  value="Radio"
                  label="Radio"
                  name="radio-default"
                  testId="radio-default"
                  isChecked={true}
                />
              </Stack>
              <Select
                menuIsOpen={true}
                defaultValue={{ label: 'One', value: 'one' }}
                options={[
                  { label: 'One', value: 'one' },
                  { label: 'Two', value: 'two' },
                ]}
              />
            </Stack>
            <Calendar />
          </Inline>
        </Stack>
      </Stack>
    </Box>
  );
};
