/** @jsx jsx */
import { useEffect, useState } from 'react';

import { jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';
import Grid, { GridItem } from '@atlaskit/grid';
import Heading from '@atlaskit/heading';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import LinkIcon from '@atlaskit/icon/glyph/link';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import SectionMessage, {
  SectionMessageAction,
} from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';

import { setGlobalTheme } from '../src';

import Accordion from './contrast-checker-utils/components/accordion';
import BaseTokenEditor, {
  baseTokens,
} from './contrast-checker-utils/components/base-token-editor';
import CustomThemeEditor from './contrast-checker-utils/components/custom-theme-editor';
import Results from './contrast-checker-utils/components/results';
import { defaultCustomTheme } from './contrast-checker-utils/utils/default-custom-themes';
import {
  getSearchParams,
  setSearchParams,
} from './contrast-checker-utils/utils/search-params';
import { ColorMode, Theme } from './contrast-checker-utils/utils/types';

const params = new URLSearchParams(window.location.search);

function setFocusToIframe() {
  const iframe = window.parent.document.querySelector('iframe');
  if (!iframe) {
    return;
  }
  iframe.contentWindow?.focus();
}
/**
 * A select that chooses between themes (currently, light or dark)
 */
const ThemePicker = ({
  value,
  onChange,
}: {
  value: ColorMode;
  onChange: (theme: ColorMode) => void;
}) => {
  const themeSelectOptions = [
    { label: 'Light Theme', value: 'light' },
    { label: 'Dark Theme', value: 'dark' },
  ] as const;

  return (
    <Select
      spacing={'compact'}
      inputId={`theme-select`}
      onChange={(e) => {
        if (e?.value) {
          onChange(e.value);
        }
      }}
      value={themeSelectOptions.find((option) => option.value === value)}
      options={themeSelectOptions.filter((option) => option)}
      placeholder="Choose a base theme"
    />
  );
};

/**
 * A bar of buttons that perform actions based on the provided theme
 */
const CustomThemeActions = ({
  customBaseTokens,
  customTheme,
  onClear,
}: {
  customBaseTokens: typeof baseTokens;
  customTheme: Theme;
  onClear: () => void;
}) => (
  <ButtonGroup>
    <Tooltip content="Copy custom theme to clipboard">
      <Button
        iconBefore={<CopyIcon label="Copy custom theme" />}
        appearance="subtle"
        onClick={() => {
          setFocusToIframe();
          navigator.clipboard.writeText(
            JSON.stringify({
              customBaseTokens: customBaseTokens,
              customTokens: customTheme,
            }),
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
        onClick={onClear}
      />
    </Tooltip>
  </ButtonGroup>
);

const colorModeFromUrl = Object.fromEntries(params.entries())
  .colorMode as ColorMode;
const initialColorMode = ['light', 'dark'].includes(colorModeFromUrl)
  ? colorModeFromUrl
  : 'light';

/**
 * Color contrast checking app - allows you to configure a custom theme and see how contrasts
 * change over time
 */
export default function ContrastChecker() {
  const [customTheme, setCustomTheme] = useState<Theme>([]);
  const [customBaseTokens, setCustomBaseTokens] = useState<typeof baseTokens>(
    {},
  );

  // Set base theme on initial load
  const [baseThemeType, setBaseThemeType] = useState(initialColorMode);

  setGlobalTheme({
    colorMode: baseThemeType,
    spacing: 'spacing',
    typography: 'typography',
  });

  if (customTheme) {
    setSearchParams(customTheme, customBaseTokens, baseThemeType);
  }

  // Parse query params and set the custom theme based on that
  useEffect(() => {
    const queryParams = getSearchParams();
    setCustomTheme(queryParams.theme);
    setCustomBaseTokens(queryParams.baseTokens);
    setBaseThemeType(queryParams.colorMode);
  }, []);

  return (
    <Grid maxWidth="wide">
      <GridItem>
        <Box paddingBlockStart="space.500">
          <Inline spread="space-between" shouldWrap={true} space="space.100">
            <Heading level="h900">Contrast Checker</Heading>
            <Box xcss={xcss({ flexBasis: 300, flexShrink: '1' })}>
              <Stack space="space.100">
                <ThemePicker
                  value={baseThemeType}
                  onChange={setBaseThemeType}
                />
              </Stack>
            </Box>
          </Inline>
        </Box>
      </GridItem>
      <GridItem span={{ sm: 12, md: 6 }}>
        <Stack space="space.200">
          <Inline spread="space-between">
            <Heading level="h800">Theme editor</Heading>
            <Box>
              <CustomThemeActions
                customTheme={customTheme}
                customBaseTokens={customBaseTokens}
                onClear={() => {
                  setCustomTheme([]);
                }}
              />
            </Box>
          </Inline>
          <Heading level="h700">Base tokens:</Heading>
          <Accordion description="Edit base tokens">
            <BaseTokenEditor
              baseTokens={customBaseTokens}
              onChange={(baseTokens: typeof customBaseTokens) =>
                setCustomBaseTokens({ ...baseTokens })
              }
            />
          </Accordion>
          <Heading level="h700">
            {baseThemeType.charAt(0).toUpperCase() + baseThemeType.slice(1)}{' '}
            theme:
          </Heading>
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
          <CustomThemeEditor
            // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
            theme={customTheme}
            onChange={(theme) => {
              setCustomTheme([...theme]);
            }}
          />
        </Stack>
      </GridItem>
      <GridItem start={{ sm: 1, md: 7 }} span={{ sm: 12, md: 6 }}>
        <Results
          customTheme={customTheme}
          customBaseTokens={customBaseTokens}
          baseThemeType={baseThemeType}
        />
      </GridItem>
      <GridItem>
        <Box paddingBlockEnd="space.500" />
      </GridItem>
    </Grid>
  );
}
