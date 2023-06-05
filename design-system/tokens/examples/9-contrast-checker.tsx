/** @jsx jsx */
import { Fragment, useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import Grid, { GridItem } from '@atlaskit/grid';
import Heading from '@atlaskit/heading';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import LinkIcon from '@atlaskit/icon/glyph/link';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import SectionMessage, {
  SectionMessageAction,
} from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import Spinner from '@atlaskit/spinner';
import Tooltip from '@atlaskit/tooltip';

import { setGlobalTheme, token } from '../src';
import rawTokensDark from '../src/artifacts/tokens-raw/atlassian-dark';
import rawTokensLight from '../src/artifacts/tokens-raw/atlassian-light';
import tokenNames from '../src/entry-points/token-names';

import checkThemePairContrasts, {
  darkResults,
  darkResultsWithOverrides,
  lightResults,
  rawTokensDarkWithOverrides,
} from './utils/check-pair-contrasts';
import { defaultCustomTheme } from './utils/default-custom-themes';
import CustomThemeBuilder, { Theme } from './utils/theme-builder';

type TokenName = keyof typeof tokenNames;
type ColorMode = 'light' | 'dark';

const url = new URL(window.location.href);
const params = new URLSearchParams(window.location.search);

// Get search params
const getSearchParams = (): {
  theme: Theme;
  colorMode: ColorMode;
  isDarkIterationSelected: boolean;
} => {
  const urlSearchParams = params;
  const paramEntries = Object.fromEntries(urlSearchParams.entries());
  var objectTheme = {};
  try {
    objectTheme = JSON.parse(paramEntries.customTheme || '""');
  } catch (error) {
    console.error(error);
  }

  const filteredTheme = Object.entries(objectTheme)
    .map(([key, value]) => {
      if (Object.keys(tokenNames).includes(key)) {
        return {
          name: key as TokenName,
          value: value,
        };
      }
    })
    .filter((value) => value !== undefined) as Theme;
  return {
    colorMode: ['light', 'dark'].includes(paramEntries.colorMode || '')
      ? (paramEntries.colorMode as ColorMode)
      : 'light',
    theme: filteredTheme,
    isDarkIterationSelected: paramEntries.isDarkIterationSelected === 'true',
  };
};

// Set search params
const setSearchParamsTheme = (
  theme: { name: string; value: string }[],
  colorMode: ColorMode,
  isDarkIterationSelected: boolean,
) => {
  let objectTheme: { [index: string]: string } = {};
  theme.forEach((value: { name: string; value: string }) => {
    objectTheme[value.name] = value.value;
  });
  url.searchParams.set('colorMode', colorMode);
  url.searchParams.set('customTheme', JSON.stringify(objectTheme));
  url.searchParams.set(
    'isDarkIterationSelected',
    isDarkIterationSelected.toString(),
  );
  // set window query params to the newly generated URL
  window.history.replaceState({}, '', url.toString());
};

const downloadResultsAsCSV = (
  customResults?: typeof lightResults.fullResults,
  isDarkIterationSelected?: boolean,
) => {
  const fullResults = [
    ...Object.values(customResults || {}),
    ...Object.values(lightResults.fullResults),
    ...Object.values(
      (isDarkIterationSelected ? darkResultsWithOverrides : darkResults)
        .fullResults,
    ),
  ];

  const headings = Object.keys(fullResults[0]);

  const csv: string = fullResults.reduce((accum, pair) => {
    return `${accum}\n${Object.values(pair).join(',')}`;
  }, headings.join(','));

  // Download string as CSV file in user's browser
  const blob = new Blob([csv], { type: 'text/csv' });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'contrast-results.csv';
  link.click();
  document.body.removeChild(link);
};

/**
 * Color contrast checking app - allows you to configure a custom theme and see how contrasts
 * change over time
 */
export default function ContrastChecker() {
  const [customTheme, setCustomTheme] = useState<Theme>([]);
  const paramEntries = Object.fromEntries(params.entries());
  const colorModeFromUrl = paramEntries.colorMode as ColorMode;
  const [baseThemeType, setBaseThemeType] = useState<'light' | 'dark'>(
    ['light', 'dark'].includes(colorModeFromUrl) ? colorModeFromUrl : 'light',
  );
  const [isDarkIterationSelected, setIsDarkIterationSelected] =
    useState<boolean>(false);
  if (customTheme) {
    setSearchParamsTheme(customTheme, baseThemeType, isDarkIterationSelected);
  }

  setGlobalTheme({
    colorMode: baseThemeType,
    spacing: 'spacing',
    typography: 'typography',
  });

  const baseRawTokens =
    baseThemeType === 'light'
      ? rawTokensLight
      : isDarkIterationSelected
      ? rawTokensDarkWithOverrides
      : rawTokensDark;
  const resultsBaseTheme =
    baseThemeType === 'light'
      ? lightResults
      : isDarkIterationSelected
      ? darkResultsWithOverrides
      : darkResults;

  // Parse query params and set the custom theme based on that
  useEffect(() => {
    const queryParams = getSearchParams();
    //TODO validate theme is correct
    setCustomTheme(queryParams.theme);
    setBaseThemeType(queryParams.colorMode);
    setIsDarkIterationSelected(queryParams.isDarkIterationSelected);
  }, []);

  // Generate custom theme from input
  const rawTokensCustom = useMemo(() => {
    const temp: typeof rawTokensLight = JSON.parse(
      JSON.stringify(baseRawTokens),
    );
    temp.forEach((token) => {
      const index = customTheme.findIndex((t) => t?.name === token?.cleanName);
      if (index !== -1) {
        token.value = customTheme[index].value;
      }
    });
    return temp;
  }, [customTheme, baseRawTokens]);

  // Generate results (should be debounced)
  const resultsCustom = useMemo(() => {
    var temp: typeof lightResults | undefined;
    try {
      temp = checkThemePairContrasts(rawTokensCustom, 'custom');
    } catch (e) {
      console.error(e);
    }
    return temp;
  }, [rawTokensCustom]);

  // Generate list of new violations in custom theme
  const betterContrast: string[] = [];
  const worseContrast: string[] = [];
  const newViolations: string[] = [];
  const solvedViolations: string[] = [];
  const bothViolations: string[] = [];

  if (resultsCustom && resultsCustom.fullResults) {
    Object.keys(resultsBaseTheme.fullResults).forEach((combination) => {
      const combinationLight = resultsBaseTheme.fullResults[combination];
      const combinationCustom = (resultsCustom as typeof resultsBaseTheme)
        .fullResults[combination];
      const isPairing =
        combinationLight.meetsRequiredContrast === 'FAIL' ||
        combinationLight.meetsRequiredContrast === 'TRUE';
      if (isPairing && combinationCustom.contrast > combinationLight.contrast) {
        betterContrast.push(combination);
      }
      if (isPairing && combinationCustom.contrast < combinationLight.contrast) {
        worseContrast.push(combination);
      }
      if (
        combinationLight.meetsRequiredContrast === 'FAIL' &&
        combinationCustom.meetsRequiredContrast === 'PASS'
      ) {
        solvedViolations.push(combination);
      }
      if (
        combinationLight.meetsRequiredContrast === 'PASS' &&
        combinationCustom.meetsRequiredContrast === 'FAIL'
      ) {
        newViolations.push(combination);
      }
      if (
        combinationLight.meetsRequiredContrast === 'FAIL' &&
        combinationCustom.meetsRequiredContrast === 'FAIL'
      ) {
        bothViolations.push(combination);
      }
    });
  }

  function mapToCards(pairing: string) {
    const foreground = resultsBaseTheme.fullResults[pairing]
      .token1 as TokenName;
    const background = resultsBaseTheme.fullResults[pairing]
      .token2 as TokenName;
    return (
      <ContrastCard
        name={pairing}
        key={pairing}
        foregroundName={foreground}
        backgroundName={background}
        foregroundValue={
          rawTokensCustom.find((token) => token.cleanName === foreground)
            ?.value as string
        }
        backgroundValue={
          rawTokensCustom.find((token) => token.cleanName === background)
            ?.value as string
        }
        contrastBase={resultsBaseTheme.fullResults[
          pairing
        ].contrast.toPrecision(4)}
        baseThemeType={baseThemeType}
        contrastCustom={
          resultsCustom
            ? resultsCustom?.fullResults[pairing].contrast.toPrecision(4)
            : undefined
        }
      />
    );
  }

  function setFocusToIframe() {
    const iframe = window.parent.document.querySelector('iframe');
    if (!iframe) {
      return;
    }
    iframe.contentWindow?.focus();
  }

  const themeSelectOptions = [
    { label: 'Light Theme', value: 'light' },
    { label: 'Dark Theme', value: 'dark' },
  ] as const;

  return (
    <Grid maxWidth="wide">
      <GridItem>
        <Box paddingBlockStart="space.500">
          <Inline spread="space-between">
            <Heading level="h900">Contrast Checker</Heading>
            <div css={{ flexBasis: 300, flexShrink: 0 }}>
              <Stack space="space.100">
                <Select
                  spacing={'compact'}
                  inputId={`theme-select`}
                  onChange={(e) => {
                    if (e?.value) {
                      setBaseThemeType(e.value);
                    }
                  }}
                  value={themeSelectOptions.find(
                    (value) => value.value === baseThemeType,
                  )}
                  options={themeSelectOptions.filter((option) => option)}
                  placeholder="Choose a base theme"
                />
                {baseThemeType === 'dark' && (
                  <Checkbox
                    value="dark_iteration"
                    label="Dark iteration enabled"
                    isChecked={isDarkIterationSelected}
                    onChange={(e) =>
                      setIsDarkIterationSelected(e.target.checked)
                    }
                    name="dark_iteration"
                  />
                )}
              </Stack>
            </div>
          </Inline>
        </Box>
      </GridItem>
      <GridItem span={{ sm: 12, md: 6 }}>
        <Stack space="space.200">
          <Inline spread="space-between">
            <Heading level="h800">Custom {baseThemeType} theme:</Heading>
            <div>
              <ButtonGroup>
                <Tooltip content="Copy custom theme to clipboard">
                  <Button
                    iconBefore={<CopyIcon label="Copy custom theme" />}
                    appearance="subtle"
                    onClick={() => {
                      setFocusToIframe();
                      navigator.clipboard.writeText(
                        JSON.stringify(customTheme),
                      );
                    }}
                  />
                </Tooltip>
                <Tooltip content="Share custom theme">
                  <Button
                    iconBefore={<LinkIcon label="Share link to custom theme" />}
                    appearance="subtle"
                    onClick={() => {
                      setFocusToIframe();
                      navigator.clipboard.writeText(location.href);
                    }}
                  />
                </Tooltip>
                <Tooltip content="Delete custom theme">
                  <Button
                    iconBefore={<TrashIcon label="Remove custom theme" />}
                    appearance="subtle"
                    onClick={() => {
                      setCustomTheme([]);
                    }}
                  />
                </Tooltip>
              </ButtonGroup>
            </div>
          </Inline>
          {customTheme && customTheme.length === 0 && (
            <SectionMessage
              appearance="information"
              title="No custom theme"
              actions={[
                <SectionMessageAction
                  onClick={() => setCustomTheme(defaultCustomTheme)}
                >
                  Load "purple" custom theme
                </SectionMessageAction>,
              ]}
            >
              Add your first custom color below, or load in a sample theme
            </SectionMessage>
          )}
          <CustomThemeBuilder
            // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
            theme={customTheme}
            onChange={(theme) => {
              setCustomTheme([...theme]);
            }}
          />
        </Stack>
      </GridItem>
      <GridItem start={{ sm: 1, md: 7 }} span={{ sm: 12, md: 6 }}>
        <Stack space="space.200">
          <Inline spread="space-between">
            <Heading level="h800">Results:</Heading>
            <Button
              onClick={() => {
                const fullCustomResults =
                  customTheme.length > 0
                    ? checkThemePairContrasts(rawTokensCustom, 'custom')
                    : undefined;
                downloadResultsAsCSV(
                  fullCustomResults?.fullResults,
                  isDarkIterationSelected,
                );
              }}
            >
              Download CSV
            </Button>
          </Inline>
          <p>
            Checking WCAG 2.1 contrast for "recommended pairings" of tokens,
            automatically generated by the{' '}
            <code>typescript-token-pairings</code> formatter.
          </p>
          <SectionMessage appearance="discovery" title="This tool is in beta">
            Some listed pairs of tokens may not have contrast requirements, and
            some valid pairings may be missing. Transparent tokens are not
            checked.
          </SectionMessage>
          {resultsCustom ? (
            <Fragment>
              <Box xcss={xcss({ overflow: 'auto', height: '100%' })}>
                <Stack space="space.200">
                  <Accordion
                    appearance="danger"
                    description="Pairings that now breach:"
                  >
                    {newViolations.map(mapToCards)}
                  </Accordion>
                  <Accordion
                    appearance="success"
                    description="Pairings that no longer breach:"
                  >
                    {solvedViolations.map(mapToCards)}
                  </Accordion>
                  <Accordion
                    appearance="success"
                    description="Pairings with better contrast:"
                  >
                    {betterContrast.map(mapToCards)}
                  </Accordion>
                  <Accordion
                    appearance="warning"
                    description="Pairings with worse contrast:"
                  >
                    {worseContrast.map(mapToCards)}
                  </Accordion>
                  <Accordion
                    appearance="warning"
                    description="Breaching in both"
                  >
                    {bothViolations.map(mapToCards)}
                  </Accordion>
                </Stack>
              </Box>
            </Fragment>
          ) : (
            <SectionMessage appearance="warning" title="Invalid theme provided">
              Check the syntax of your custom theme
            </SectionMessage>
          )}
        </Stack>
      </GridItem>
      <GridItem>
        <Box paddingBlockEnd="space.500" />
      </GridItem>
    </Grid>
  );
}

/**
 * Accordion for displaying content
 */
function Accordion({
  description,
  children,
  appearance = 'information',
}: {
  description: string;
  children: any;
  appearance?: 'information' | 'warning' | 'danger' | 'success';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const appearanceMapping = {
    information: 'inprogress',
    warning: 'moved',
    danger: 'removed',
    success: 'success',
  } as const;

  const handleToggle = (event: React.ChangeEvent<HTMLDetailsElement>) =>
    setIsOpen(event.currentTarget.open);

  return (
    <Fragment>
      {children ? (
        <details
          // @ts-ignore
          onToggle={handleToggle}
          open={isOpen}
          css={{
            alignItems: 'center',
            border: `1px solid ${token('color.border')}`,
            background: token('elevation.surface.raised'),
            boxShadow: token('elevation.shadow.raised'),
            borderRadius: '4px',
            padding: '0em 0.5em',
            transition: 'background 0.2s ease-in',
            '&[open]': {
              padding: '0em 0.5em 0.5em',
              '& summary': {
                marginBottom: '0.5em',
              },
            },
          }}
        >
          <summary
            css={{
              margin: '0em -0.5em 0',
              padding: '1em',
              ':hover': {
                background: token('color.background.neutral.subtle.hovered'),
              },
              ':active': {
                background: token('color.background.neutral.subtle.pressed'),
              },
            }}
          >
            <span
              css={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: token('space.050'),
              }}
            >
              <Heading level="h600">{description}</Heading>
              <Lozenge
                appearance={
                  children.length > 0
                    ? appearanceMapping[appearance]
                    : 'default'
                }
              >
                {children.length}
              </Lozenge>
            </span>
          </summary>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {isOpen ? children : <Spinner />}
          </ul>
        </details>
      ) : null}
    </Fragment>
  );
}

/**
 * Card for displaying a single pairing and its contrast
 */
function ContrastCard({
  name,
  foregroundName,
  backgroundName,
  foregroundValue,
  backgroundValue,
  baseThemeType,
  contrastBase,
  contrastCustom,
}: {
  name: string;
  foregroundName: TokenName;
  backgroundName: TokenName;
  foregroundValue: string;
  backgroundValue: string;
  baseThemeType: string;
  contrastBase: string;
  contrastCustom?: string;
}) {
  return (
    <Box
      as="li"
      padding="space.100"
      backgroundColor="neutral"
      xcss={xcss({ flex: '1', width: '100%', borderRadius: 'radius.200' })}
    >
      <Inline space="space.050" spread="space-between">
        <Inline space="space.100">
          <div
            css={{
              backgroundColor: backgroundValue,
              padding: '8px',
              alignSelf: 'center',
            }}
          >
            <div css={{ backgroundColor: foregroundValue, padding: '8px' }} />
          </div>
          <Stack space="space.050">
            <code css={{ maxWidth: '320px', overflowX: 'auto' }}>
              {foregroundName}
            </code>
            <code css={{ maxWidth: '320px', overflowX: 'auto' }}>
              {backgroundName}
            </code>
          </Stack>
        </Inline>
        <dl
          css={{
            padding: 0,
            margin: 0,
            display: 'flex',
            flexFlow: 'column',
            gap: '4px',
          }}
        >
          <ValueListItem
            description={`${baseThemeType}:`}
            value={contrastBase}
          />
          {contrastCustom && (
            <ValueListItem description="Custom:" value={contrastCustom} />
          )}
        </dl>
      </Inline>
    </Box>
  );
}

const ValueListItem = ({
  description,
  value,
}: {
  description: string;
  value?: string;
}) => (
  <Inline spread="space-between" space="space.100">
    <dt>
      <strong css={{ textTransform: 'capitalize' }}>{description}</strong>
    </dt>
    <dd css={{ marginTop: 0, marginInlineStart: 0 }}>
      <p css={{ margin: 0 }}>{value}</p>
    </dd>
  </Inline>
);
