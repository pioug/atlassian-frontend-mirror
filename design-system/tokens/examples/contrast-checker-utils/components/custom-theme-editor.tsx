/** @jsx jsx */

import { useCallback, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import debounce from 'lodash/debounce';

import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import { N20 } from '@atlaskit/theme/colors';

import { token } from '../../../src';
import palettesRaw from '../../../src/entry-points/palettes-raw';
import tokenNames from '../../../src/entry-points/token-names';
import { isHex } from '../utils/search-params';
import { Theme, TokenName } from '../utils/types';

import { baseTokenNames } from './base-token-editor';

const TokenNameOptions = (Object.keys(tokenNames) as TokenName[])
  .filter(
    (token) =>
      token.startsWith('color') || token.startsWith('elevation.surface'),
  )
  .map((token) => ({
    label: token,
    value: token,
  }));

const baseTokenNameOptions = palettesRaw
  .filter((base) => base.attributes.category !== 'opacity')
  .map(({ path }) => ({
    label: path[path.length - 1],
    value: path[path.length - 1],
  }));

const customOption = { label: 'Custom value', value: 'custom' };
const baseTokenNameOptionsWithCustom = [customOption, ...baseTokenNameOptions];

/**
 * Editor for custom themes
 */
const CustomThemeEditor = ({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) => {
  return (
    <Stack space="space.100">
      {theme.map((token, index) => (
        <TokenSelect
          key={`${token.name}-${index}`}
          selectedToken={token.name}
          baseTokenValue={
            baseTokenNames.includes(token.value) ? token.value : undefined
          }
          value={baseTokenNames.includes(token.value) ? undefined : token.value}
          onChange={(newValue) => {
            theme[index] = {
              name: newValue.selectedToken,
              value: newValue.value || newValue.baseTokenValue || '#ffffff',
            };
            onChange(theme);
          }}
          onRemove={() => {
            theme.splice(index, 1);
            onChange(theme);
          }}
        />
      ))}
      <Box>
        <Button
          iconBefore={<AddIcon label="" />}
          onClick={() => {
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            theme.push({ name: 'color.text', value: '#ffffff' });
            onChange(theme);
          }}
        >
          New custom value{' '}
        </Button>
      </Box>
    </Stack>
  );
};

const TokenSelect = ({
  selectedToken,
  baseTokenValue,
  value,
  onChange,
  onRemove,
}: {
  selectedToken: TokenName;
  baseTokenValue?: string;
  value?: string;
  onChange: (selection: {
    selectedToken: TokenName;
    baseTokenValue?: string;
    value?: string;
  }) => void;
  onRemove: () => void;
}) => {
  const [colorFieldValue, setColorFieldValue] = useState(value);

  const [currentBaseTokenValue, setCurrentBaseTokenValue] = useState(
    baseTokenValue
      ? { label: baseTokenValue, value: baseTokenValue }
      : customOption,
  );

  const handleCustomValueChange = useCallback(
    (newValue: string) => {
      if (isHex(newValue)) {
        onChange({ selectedToken: selectedToken, value: newValue });
      }
      setColorFieldValue(newValue);
    },
    [onChange, selectedToken],
  );

  const handleBaseTokenValueChange = useCallback(
    (newValue: string) => {
      onChange({ selectedToken: selectedToken, baseTokenValue: newValue });
    },
    [onChange, selectedToken],
  );

  const debouncedOnChange = useMemo(
    () => debounce(handleCustomValueChange, 200),
    [handleCustomValueChange],
  );

  return (
    <Inline space="space.100" grow="fill">
      <Select<{ label: TokenName; value: TokenName }>
        options={TokenNameOptions}
        value={{ label: selectedToken, value: selectedToken }}
        onChange={(e) => {
          if (e?.value) {
            onChange({ selectedToken: e?.value, value: value });
          }
        }}
        placeholder="Choose a token"
        inputId={`token-select-${selectedToken}`}
        spacing={'compact'}
        css={{ flexBasis: 300, flexShrink: 0 }}
      />
      <Stack space="space.025" grow="fill">
        <Select<{ label: string; value: string }>
          options={baseTokenNameOptionsWithCustom}
          value={currentBaseTokenValue}
          onChange={(e) => {
            e && setCurrentBaseTokenValue(e);
            if (e?.value === 'custom') {
              handleCustomValueChange(colorFieldValue || '#ffffff');
            } else {
              e?.value && handleBaseTokenValueChange(e.value);
            }
          }}
          placeholder="Choose a value"
          inputId={`token-select-${selectedToken}`}
          spacing={'compact'}
          css={{ flexBasis: '100%', flexShrink: 0 }}
        />
        {currentBaseTokenValue.value === 'custom' && (
          <Inline space="space.025" grow="hug">
            <input
              css={{
                border: `2px solid ${token('color.border', N20)}`,
                backgroundColor: token('color.background.input', 'white'),
                borderRadius: token('border.radius.100', '3px'),
                height: token('space.400', '32px'),
                '&:hover': {
                  backgroundColor: token(
                    'color.background.input.hovered',
                    'N20',
                  ),
                },
              }}
              type="color"
              value={value}
              onChange={(e) => {
                debouncedOnChange(e.target.value);
              }}
            />
            <TextField
              value={colorFieldValue}
              isCompact={true}
              width={100}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const result = e?.target.value;
                handleCustomValueChange(result);
              }}
              placeholder="Set a value"
            />
          </Inline>
        )}
      </Stack>
      <Box xcss={xcss({ flexShrink: '0' })}>
        <Button
          iconBefore={<CrossIcon label="remove" />}
          appearance="subtle"
          onClick={onRemove}
        />
      </Box>
    </Inline>
  );
};

export default CustomThemeEditor;
