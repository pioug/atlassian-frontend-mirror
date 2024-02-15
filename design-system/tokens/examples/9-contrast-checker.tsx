/** @jsx jsx */
import { Fragment, useEffect, useState } from 'react';

import { jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { Label } from '@atlaskit/form';
import Grid, { GridItem } from '@atlaskit/grid';
import Heading from '@atlaskit/heading';
import LinkIcon from '@atlaskit/icon/glyph/link';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import { Popup } from '@atlaskit/popup';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import SectionMessage, {
  SectionMessageAction,
} from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import Tooltip from '@atlaskit/tooltip';

import { setGlobalTheme } from '../src';
import { getCSSCustomProperty } from '../src/utils/token-ids';

import Accordion from './contrast-checker-utils/components/accordion';
import BaseTokenEditor, {
  baseTokens,
} from './contrast-checker-utils/components/base-token-editor';
import CustomThemeEditor from './contrast-checker-utils/components/custom-theme-editor';
import Results, {
  getCustomTheme,
} from './contrast-checker-utils/components/results';
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

function copyString(string: string) {
  setFocusToIframe();
  navigator.clipboard.writeText(string);
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
    <Fragment>
      <Label htmlFor="theme-select">Theme</Label>
      <Select
        spacing="compact"
        inputId="theme-select"
        onChange={(e) => {
          if (e?.value) {
            onChange(e.value);
          }
        }}
        value={themeSelectOptions.find((option) => option.value === value)}
        options={themeSelectOptions.filter((option) => option)}
        placeholder="Choose a base theme"
      />
    </Fragment>
  );
};

function getThemeCSS(
  customTheme: Theme,
  customBaseTokens: typeof baseTokens,
  baseThemeType: ColorMode,
) {
  const customThemeValues = getCustomTheme(
    customTheme,
    customBaseTokens,
    baseThemeType,
  );
  return customThemeValues.reduce((acc, value) => {
    // turn into CSS
    const cssName = getCSSCustomProperty(value.path);
    if (!cssName || typeof value.value !== 'string') {
      return acc;
    }
    return `${acc}\n${cssName}: ${value.value};`;
  }, '');
}

/**
 * An import dialog for importing a custom theme
 */
const ImportPopup = ({
  onImport,
}: {
  onImport: (theme: ThemeExportFormat) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [importValue, setImportValue] = useState('');

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      content={() => (
        <Stack
          space="space.100"
          xcss={xcss({ padding: 'space.200', maxWidth: '400px' })}
        >
          <Heading level="h600">Import a custom theme</Heading>
          <p>
            Paste in a JSON string of a custom theme to import it. This will
            overwrite your current custom theme.
          </p>
          <TextArea
            onChange={(e) => setImportValue(e.target.value)}
            value={importValue}
          />
          <Button
            onClick={() => {
              try {
                const parsed = JSON.parse(importValue);
                onImport(parsed);
                setIsOpen(false);
              } catch (e) {
                alert('Invalid JSON');
              }
            }}
          >
            Import
          </Button>
        </Stack>
      )}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          Import
        </Button>
      )}
    />
  );
};

interface ThemeExportFormat {
  customBaseTokens: typeof baseTokens;
  customTokens: Theme;
}

/**
 * A bar of buttons that perform actions based on the provided theme
 */
const CustomThemeActions = ({
  customBaseTokens,
  customTheme,
  baseThemeType,
  onClear,
  onImport,
}: {
  customBaseTokens: typeof baseTokens;
  customTheme: Theme;
  baseThemeType: ColorMode;
  onClear: () => void;
  onImport: (Theme: ThemeExportFormat) => void;
}) => (
  <ButtonGroup label="Export options">
    <ImportPopup onImport={onImport} />
    <DropdownMenu trigger="Export" placement="bottom-start">
      <DropdownItem
        description="Format for import, and engineering handoff"
        onClick={() =>
          copyString(
            JSON.stringify({
              customBaseTokens: customBaseTokens,
              customTokens: customTheme,
            }),
          )
        }
      >
        Copy as JSON
      </DropdownItem>
      <DropdownItem
        onClick={() =>
          copyString(getThemeCSS(customTheme, customBaseTokens, baseThemeType))
        }
        description="Compatible with the theming browser extension"
      >
        Copy as CSS
      </DropdownItem>
    </DropdownMenu>
    <Tooltip content="Copy link to custom theme">
      <IconButton
        icon={LinkIcon}
        onClick={() => {
          setFocusToIframe();
          navigator.clipboard.writeText(location.href);
        }}
        label="Share link to custom theme"
      />
    </Tooltip>
    <Tooltip content="Delete custom theme">
      <IconButton
        icon={TrashIcon}
        onClick={onClear}
        label="Remove custom theme"
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
    typography: 'typography-adg3',
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
                baseThemeType={baseThemeType}
                onImport={(theme) => {
                  setCustomTheme(theme.customTokens);
                  setCustomBaseTokens(theme.customBaseTokens);
                }}
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
