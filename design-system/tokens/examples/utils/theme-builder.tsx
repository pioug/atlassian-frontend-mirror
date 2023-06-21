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

import { token } from '../../src';
import tokenNames from '../../src/entry-points/token-names';

type TokenName = keyof typeof tokenNames;

export type Theme = { name: TokenName; value: string }[];

/**
 * Editor for custom themes
 */
const CustomThemeBuilder = ({
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
          value={token.value}
          onChange={(newValue) => {
            theme[index] = {
              name: newValue.selectedToken,
              value: newValue.value,
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
  value,
  onChange,
  onRemove,
}: {
  selectedToken: TokenName;
  value: string;
  onChange: (selection: { selectedToken: TokenName; value: string }) => void;
  onRemove: () => void;
}) => {
  const [colorValue, setColorValue] = useState(value);

  const handleChange = useCallback(
    (newValue: string) => {
      if (newValue.match(/^#[0-9A-Fa-f]{6}$/)) {
        onChange({ selectedToken: selectedToken, value: newValue });
      }
      setColorValue(newValue);
    },
    [onChange, selectedToken],
  );

  const debouncedOnChange = useMemo(
    () => debounce(handleChange, 200),
    [handleChange],
  );

  return (
    <Inline space="space.100" grow="hug">
      <Select<{ label: TokenName; value: TokenName }>
        css={{ flexBasis: 300, flexShrink: 0 }}
        spacing={'compact'}
        inputId={`token-select-${selectedToken}`}
        value={{ label: selectedToken, value: selectedToken }}
        onChange={(e) => {
          if (e?.value) {
            onChange({ selectedToken: e?.value, value: value });
          }
        }}
        options={(Object.keys(tokenNames) as TokenName[])
          .filter(
            (token) =>
              token.startsWith('color') || token.startsWith('elevation'),
          )
          .map((token) => ({
            label: token,
            value: token,
          }))}
        placeholder="Choose a token"
      />
      <input
        css={{
          border: `2px solid ${token('color.border', N20)}`,
          backgroundColor: token('color.background.input', 'white'),
          borderRadius: token('border.radius.100', '3px'),
          height: token('space.400', '32px'),
          '&:hover': {
            backgroundColor: token('color.background.input.hovered', 'N20'),
          },
        }}
        type="color"
        value={colorValue}
        onChange={(e) => {
          debouncedOnChange(e.target.value);
        }}
      />
      <TextField
        value={colorValue}
        isCompact={true}
        width={100}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const result = e?.target.value;
          handleChange(result);
        }}
        placeholder="Set a value"
      />
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

export default CustomThemeBuilder;
