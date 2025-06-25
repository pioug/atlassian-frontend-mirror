/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useMemo, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import debounce from 'lodash/debounce';

import Button, { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/glyph/add';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import palettesRaw from '@atlaskit/tokens/palettes-raw';
import tokenNames from '@atlaskit/tokens/token-names';

import { isHex } from '../utils/search-params';
import { type Theme, type TokenName } from '../utils/types';

import { baseTokenNames } from './base-token-editor';

const styles = cssMap({
	select: {
		flexBasis: '300px',
		flexShrink: '0',
	},
	flexShrink: {
		flexShrink: '0',
	},
	input: {
		border: `2px solid ${token('color.border')}`,
		backgroundColor: token('color.background.input'),
		borderRadius: token('border.radius.100'),
		height: '32px',
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
		},
	},
});

const TokenNameOptions = (Object.keys(tokenNames) as TokenName[])
	.filter((token) => token.startsWith('color') || token.startsWith('elevation.surface'))
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
					baseTokenValue={baseTokenNames.includes(token.value) ? token.value : undefined}
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
					iconBefore={AddIcon}
					onClick={() => {
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
		baseTokenValue ? { label: baseTokenValue, value: baseTokenValue } : customOption,
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
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
				css={styles.select}
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
					// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
					css={styles.select}
				/>
				{currentBaseTokenValue.value === 'custom' && (
					<Inline space="space.025" grow="hug">
						<input
							css={styles.input}
							type="color"
							value={value}
							onChange={(e) => {
								debouncedOnChange(e.target.value);
							}}
						/>
						<TextField
							value={colorFieldValue}
							isCompact={true}
							width={120}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const result = e?.target.value;
								handleCustomValueChange(result);
							}}
							placeholder="Set a value"
						/>
					</Inline>
				)}
			</Stack>
			<Box xcss={styles.flexShrink}>
				<IconButton icon={CrossIcon} appearance="subtle" onClick={onRemove} label="remove" />
			</Box>
		</Inline>
	);
};

export default CustomThemeEditor;
