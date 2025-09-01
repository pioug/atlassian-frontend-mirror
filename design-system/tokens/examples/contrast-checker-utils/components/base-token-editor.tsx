/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button, { IconButton } from '@atlaskit/button/new';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditIcon from '@atlaskit/icon/glyph/edit';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import palettesRaw from '@atlaskit/tokens/palettes-raw';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import palettesBrandRefreshRaw from '../../../src/artifacts/palettes-raw/palette-brand-refresh';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { getAlpha, getContrastRatio } from '../../../src/utils/color-utils';
import { isHex } from '../utils/search-params';
import { type BaseTokens } from '../utils/types';

const palettes = () =>
	fg('platform-component-visual-refresh') ? palettesBrandRefreshRaw : palettesRaw;

export const baseTokenNames = palettes()
	.filter((base) => base.attributes.category !== 'opacity')
	.map(({ path }) => path[path.length - 1]);

export const baseTokens: Record<string, string> = palettes()
	.filter((base) => base.attributes.category !== 'opacity')
	.reduce(
		(acc, { path, value }) => ({
			...acc,
			[path[path.length - 1]]: value,
		}),
		{},
	);

const white = '#ffffff';
const black = '#000000';

/**
 * Generates a foreground color for a given background. Returns standard
 * text color for colors with transparency
 *
 * @param bg A hex code background color
 * @returns A hex color that can be used as a foreground
 */
function generateColorPair(bg: string) {
	if (getAlpha(bg) < 1) {
		return token('color.text');
	}
	const contrastWithWhite = getContrastRatio(bg, white);
	if (contrastWithWhite >= 4.5) {
		return white;
	} else {
		return black;
	}
}

const groupedBaseTokens = palettes()
	.filter((base) => base.attributes.category !== 'opacity')
	.reduce(
		(acc, baseToken) => {
			const category =
				typeof baseToken.value === 'string' && getAlpha(baseToken.value) < 1
					? 'alpha'
					: baseToken.attributes.category;
			acc[category] = [
				...(acc[category] || []),
				{
					name: baseToken.path[baseToken.path.length - 1],
					value: baseToken.value as string,
				},
			];
			return acc;
		},
		{} as { [index: string]: { name: string; value: string }[] },
	);

const styles = cssMap({
	overflow: {
		overflow: 'auto',
	},
	groupedBaseTokens: {
		overflow: 'hidden',
		display: 'flex',
		flexGrow: '1',
		borderRadius: token('radius.large'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		flexBasis: 'min-content',
	},
	paletteBlock: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		minWidth: '12rem',
	},
	flexShrink: {
		flexShrink: '0',
	},
});

/**
 * An editor for configuring base tokens. Displays ramps and allows the user to select
 * each base token and change its value
 */
const BaseTokenEditor = ({
	baseTokens,
	onChange,
}: {
	/**
	 * An array of custom values for the standard Atlassian base tokens
	 */
	baseTokens: BaseTokens;
	/**
	 * Called when the user edits the base token set; returns only custom values
	 */
	onChange: (baseTokens: BaseTokens) => void;
}) => {
	return (
		<Box xcss={styles.overflow}>
			<Inline space="space.100" grow="fill" shouldWrap={true}>
				{Object.entries(groupedBaseTokens).map(([group, originalBaseTokens]) => {
					return (
						<Box key={group} xcss={styles.groupedBaseTokens}>
							<Stack grow="fill">
								{originalBaseTokens.map(({ name, value }) => {
									return (
										<PaletteBlock
											key={name}
											baseToken={{ name: name, value: baseTokens[name] }}
											originalValue={value}
											onChange={(newValue) => {
												baseTokens[name] = newValue;
												onChange(baseTokens);
											}}
											onReset={() => {
												delete baseTokens[name];
												onChange({ ...baseTokens });
											}}
										/>
									);
								})}
							</Stack>
						</Box>
					);
				})}
			</Inline>
		</Box>
	);
};

/**
 * A form element that displays a base token, and allows the user to edit the value
 */
const PaletteBlock = ({
	baseToken,
	originalValue,
	onChange,
	onReset,
}: {
	/**
	 * An object with the name and value of the base token to display
	 */
	baseToken: { name: string; value?: string };
	/**
	 * The original value of the base token
	 */
	originalValue: string;
	/**
	 * Called when the user edits the value of the base token
	 */
	onChange: (value: string) => void;
	/**
	 * Called when the user resets the token value
	 */
	onReset: () => void;
}) => {
	const [currentValue, setCurrentValue] = useState(baseToken.value || originalValue);
	const [isEditing, setIsEditing] = useState(false);

	const textColor = generateColorPair(baseToken.value || originalValue);

	const resetField = useCallback(() => {
		setCurrentValue(originalValue);
		onReset();
	}, [onReset, originalValue]);

	const handleChange = useCallback(
		(newValue?: string) => {
			if (newValue && newValue !== originalValue && isHex(newValue)) {
				onChange(newValue);
				setCurrentValue(newValue);
			} else {
				resetField();
			}
			setIsEditing(false);
		},
		[onChange, originalValue, resetField],
	);

	const CrossIconWithColorOverrides = () => <CrossIcon primaryColor={textColor} label="close" />;
	const CheckIconWithColorOverrides = () => <CheckIcon primaryColor={textColor} label="confirm" />;
	const EditIconWithColorOverrides = () => <EditIcon primaryColor={textColor} label="edit" />;

	return (
		<div
			css={styles.paletteBlock}
			style={{
				backgroundColor: baseToken.value || originalValue,
				color: textColor,
			}}
		>
			<Inline alignBlock="center" space="space.100" spread="space-between">
				{isEditing ? (
					<Fragment>
						<TextField
							value={currentValue}
							isCompact={true}
							onChange={(e) => {
								setCurrentValue(e.currentTarget.value);
							}}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									handleChange(currentValue);
								}
							}}
						/>
						<Box xcss={styles.flexShrink}>
							<Inline space="space.025">
								<IconButton
									icon={CrossIconWithColorOverrides}
									onClick={() => {
										handleChange(baseToken.value);
									}}
									label="close"
								/>
								<IconButton
									icon={CheckIconWithColorOverrides}
									onClick={(e) => {
										handleChange(currentValue);
									}}
									label="confirm"
								/>
							</Inline>
						</Box>
					</Fragment>
				) : (
					<Fragment>
						{baseToken.name}
						{baseToken.value && (
							<Button
								onClick={() => {
									handleChange();
								}}
							>
								<Box
									style={{
										color: textColor,
									}}
								>
									Reset
								</Box>
							</Button>
						)}
						<IconButton
							icon={EditIconWithColorOverrides}
							onClick={() => {
								setIsEditing(true);
							}}
							label="edit"
						/>
					</Fragment>
				)}
			</Inline>
		</div>
	);
};

export default BaseTokenEditor;
