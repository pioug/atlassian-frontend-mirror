import React, { useMemo, useCallback, useRef, useEffect } from 'react';

import chromatism from 'chromatism';
import { useIntl } from 'react-intl-next';

import { Grid, Inline } from '@atlaskit/primitives/compiled';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { Color } from './Color';
import getColorMessage from './getColorMessage';
import type { ColorPaletteProps } from './types';
import {
	DEFAULT_COLOR_PICKER_COLUMNS,
	getColorsPerRowFromPalette,
	getSelectedRowAndColumnFromPalette,
	getTokenCSSVariableValue,
} from './utils';

/**
 * For a given color pick the color from a list of colors with
 * the highest contrast
 *
 * @param color color string, supports HEX, RGB, RGBA etc.
 * @param useIconToken boolean, describes if a token should be used for the icon color
 * @returns Highest contrast color in pool
 */
function getCheckMarkColor(color: string, useIconToken: boolean): string {
	const tokenVal = getTokenCSSVariableValue(color);
	const colorValue = !!tokenVal ? tokenVal : color;

	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	const contrastColor = ['#FFFFFF', '#42526E'].sort(
		(a, b) => chromatism.difference(b, colorValue) - chromatism.difference(a, colorValue),
	)[0];

	if (!useIconToken) {
		return contrastColor;
	}

	// Use of these token comes from guidance from designers in the Design System team
	// they are only intended for use with text colors (and there are different tokens
	// planned to be used when this extended to be used with other palettes).
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	return contrastColor === '#FFFFFF' ? token('color.icon.inverse') : token('color.icon');
}

/**
 * ColorPalette component for displaying a grid of selectable colors
 *
 * Features:
 * - Responsive grid layout
 * - Keyboard navigation support
 * - Accessibility compliance (ARIA attributes)
 * - Theme-aware tooltips
 * - Design token integration
 * - Customizable color mapping
 */
const ColorPalette = ({
	cols = DEFAULT_COLOR_PICKER_COLUMNS,
	onClick,
	onKeyDown,
	selectedColor,
	paletteOptions,
}: ColorPaletteProps) => {
	const { formatMessage } = useIntl();
	const { palette, hexToPaletteColor, paletteColorTooltipMessages } = paletteOptions;

	const { colorMode: tokenTheme } = useThemeObserver();
	const useIconToken = !!hexToPaletteColor;

	// Refs for keyboard navigation
	const paletteRef = useRef<HTMLDivElement>(null);
	const currentFocusRef = useRef<{ col: number; row: number }>({ row: 0, col: 0 });

	const colorsPerRow = useMemo(() => {
		return getColorsPerRowFromPalette(palette, cols);
	}, [palette, cols]);

	// Get initial focus position based on selected color
	const { selectedRowIndex, selectedColumnIndex } = useMemo(() => {
		return getSelectedRowAndColumnFromPalette(palette, selectedColor, cols);
	}, [palette, selectedColor, cols]);

	// Focus management utility
	const focusColorAt = useCallback((row: number, col: number) => {
		if (!paletteRef.current) {
			return;
		}

		const rowElement = paletteRef.current.children[row];
		if (!(rowElement instanceof HTMLElement)) {
			return;
		}

		const colorButtonCandidate = rowElement.children[col]?.querySelector?.('button');
		const colorButton =
			colorButtonCandidate instanceof HTMLButtonElement ? colorButtonCandidate : null;
		if (colorButton) {
			colorButton.focus();
			currentFocusRef.current = { row, col };
		}
	}, []);

	// Initialize focus position and handle autofocus
	useEffect(() => {
		if (selectedRowIndex >= 0 && selectedColumnIndex >= 0) {
			currentFocusRef.current = { row: selectedRowIndex, col: selectedColumnIndex };
		} else {
			currentFocusRef.current = { row: 0, col: 0 };
		}
	}, [selectedRowIndex, selectedColumnIndex]);

	// Keyboard navigation handler
	const handleKeyDown = useCallback(
		(value: string, label: string, event: React.KeyboardEvent) => {
			const { row, col } = currentFocusRef.current;
			const maxRow = colorsPerRow.length - 1;
			const maxCol = colorsPerRow[row]?.length - 1 || 0;

			switch (event.key) {
				case 'ArrowRight': {
					event.preventDefault();
					if (col < maxCol) {
						focusColorAt(row, col + 1);
					} else if (row < maxRow) {
						// Move to first color of next row
						focusColorAt(row + 1, 0);
					} else {
						// Wrap to first color of first row
						focusColorAt(0, 0);
					}
					break;
				}
				case 'ArrowLeft': {
					event.preventDefault();
					if (col > 0) {
						focusColorAt(row, col - 1);
					} else if (row > 0) {
						// Move to last color of previous row
						const prevRowMaxCol = colorsPerRow[row - 1]?.length - 1 || 0;
						focusColorAt(row - 1, prevRowMaxCol);
					} else {
						// Wrap to last color of last row
						const lastRowMaxCol = colorsPerRow[maxRow]?.length - 1 || 0;
						focusColorAt(maxRow, lastRowMaxCol);
					}
					break;
				}
				case 'ArrowDown': {
					event.preventDefault();
					if (row < maxRow) {
						// Move to same column in next row, or last available column
						const nextRowMaxCol = colorsPerRow[row + 1]?.length - 1 || 0;
						const targetCol = Math.min(col, nextRowMaxCol);
						focusColorAt(row + 1, targetCol);
					} else {
						// Wrap to same column in first row
						const firstRowMaxCol = colorsPerRow[0]?.length - 1 || 0;
						const targetCol = Math.min(col, firstRowMaxCol);
						focusColorAt(0, targetCol);
					}
					break;
				}
				case 'ArrowUp': {
					event.preventDefault();
					if (row > 0) {
						// Move to same column in previous row, or last available column
						const prevRowMaxCol = colorsPerRow[row - 1]?.length - 1 || 0;
						const targetCol = Math.min(col, prevRowMaxCol);
						focusColorAt(row - 1, targetCol);
					} else {
						// Wrap to same column in last row
						const lastRowMaxCol = colorsPerRow[maxRow]?.length - 1 || 0;
						const targetCol = Math.min(col, lastRowMaxCol);
						focusColorAt(maxRow, targetCol);
					}
					break;
				}
				case 'Home': {
					event.preventDefault();
					focusColorAt(row, 0);
					break;
				}
				case 'End': {
					event.preventDefault();
					focusColorAt(row, maxCol);
					break;
				}
				case 'PageUp': {
					event.preventDefault();
					focusColorAt(0, col);
					break;
				}
				case 'PageDown': {
					event.preventDefault();
					const lastRowMaxCol = colorsPerRow[maxRow]?.length - 1 || 0;
					const targetCol = Math.min(col, lastRowMaxCol);
					focusColorAt(maxRow, targetCol);
					break;
				}
				case 'Tab': {
					// Allow Tab to move to next focusable element (don't prevent default)
					// This will allow Tab to move between color palettes
					if (onKeyDown) {
						onKeyDown(value, label, event);
					}
					break;
				}
				case 'Enter':
				case ' ': {
					event.preventDefault();
					onClick(value, label, event);
					break;
				}
				default: {
					// Pass through to custom onKeyDown handler if provided
					if (onKeyDown) {
						onKeyDown(value, label, event);
					}
					break;
				}
			}
		},
		[colorsPerRow, focusColorAt, onClick, onKeyDown],
	);

	return (
		<Grid gap="space.050" ref={paletteRef} role="group">
			{colorsPerRow.map((row, rowIndex) => (
				<Inline rowSpace="space.050" key={`row-first-color-${row[0].value}`} role="radiogroup">
					{row.map(({ value, label, border, message, decorator }, colIndex) => {
						let tooltipMessage = message;

						// Override with theme-specific tooltip messages if provided
						if (paletteColorTooltipMessages) {
							if (tokenTheme === 'dark') {
								tooltipMessage = getColorMessage(
									paletteColorTooltipMessages.dark,
									value.toUpperCase(),
								);
							}
							if (tokenTheme === 'light') {
								tooltipMessage = getColorMessage(
									paletteColorTooltipMessages.light,
									value.toUpperCase(),
								);
							}
						}

						// Determine if this color should be focusable
						const isSelectedColor = value === selectedColor;
						const isFirstColor = rowIndex === 0 && colIndex === 0;

						// Only the selected color or first color should be focusable via Tab
						// This allows Tab to move between color palettes
						const shouldBeFocusable = isSelectedColor || (!selectedColor && isFirstColor);

						return (
							<Color
								key={value}
								value={value}
								borderColor={border}
								label={tooltipMessage ? formatMessage(tooltipMessage) : label}
								onClick={onClick}
								onKeyDown={handleKeyDown}
								isSelected={isSelectedColor}
								checkMarkColor={getCheckMarkColor(value, useIconToken)}
								hexToPaletteColor={hexToPaletteColor}
								decorator={decorator}
								tabIndex={shouldBeFocusable ? 0 : -1}
							/>
						);
					})}
				</Inline>
			))}
		</Grid>
	);
};

export default ColorPalette;
