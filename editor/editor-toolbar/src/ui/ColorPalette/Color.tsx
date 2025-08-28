/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, memo } from 'react';

import { css, jsx } from '@compiled/react';

import EditorDoneIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import { token } from '@atlaskit/tokens';
import type { IconColor } from '@atlaskit/tokens/css-type-schema';
import Tooltip from '@atlaskit/tooltip';

import type { ColorProps } from './types';

const buttonWrapperStyles = css({
	borderColor: 'transparent',
	borderStyle: 'solid',
	borderWidth: '1px',
	display: 'flex',
	alignItems: 'center',
	paddingTop: token('space.025', '2px'),
	paddingRight: token('space.025', '2px'),
	paddingBottom: token('space.025', '2px'),
	paddingLeft: token('space.025', '2px'),
	borderRadius: token('radius.small', '4px'),
	'&:focus-within, &:focus, &:hover': {
		borderColor: token('color.border'),
	},
});

const buttonStyles = css({
	height: token('space.300', '26px'),
	width: token('space.300', '26px'),
	backgroundColor: token('color.background.neutral'),
	padding: 0,
	borderRadius: token('radius.small', '4px'),
	border: `1px solid ${token('color.border.inverse')}`,
	cursor: 'pointer',
	display: 'block',
	position: 'relative',
	'&:focus': {
		outline: `2px solid ${token('color.border.focused')}`,
		outlineOffset: token('space.025', '2px'),
	},
});

/**
 * Individual color palette item component
 * Displays a single color swatch with tooltip and selection state
 */
export const Color = memo<ColorProps>(
	({
		autoFocus,
		tabIndex,
		value,
		label,
		isSelected,
		borderColor,
		checkMarkColor = token('color.icon.inverse', '#FFFFFF'),
		hexToPaletteColor,
		decorator,
		onClick,
		onKeyDown,
	}) => {
		const colorStyle = hexToPaletteColor ? hexToPaletteColor(value) : value;

		const handleMouseDown = useCallback((e: React.MouseEvent) => {
			e.preventDefault();
		}, []);

		const handleClick = useCallback(
			(e: React.MouseEvent) => {
				e.preventDefault();
				onClick(value, label);
			},
			[onClick, value, label],
		);

		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if (!onKeyDown) {
					return;
				}
				e.preventDefault();
				onKeyDown(value, label, e);
			},
			[onKeyDown, value, label],
		);

		return (
			<Tooltip content={label}>
				<span css={buttonWrapperStyles}>
					<button
						type="button"
						css={buttonStyles}
						aria-label={label}
						role="radio"
						aria-checked={isSelected}
						onClick={handleClick}
						onKeyDown={handleKeyDown}
						onMouseDown={handleMouseDown}
						tabIndex={tabIndex}
						style={{
							backgroundColor: colorStyle || token('color.background.input', '#FFFFFF'),
							border: `1px solid ${borderColor}`,
						}}
						autoFocus={autoFocus}
					>
						{!decorator && isSelected && (
							<EditorDoneIcon
								color={checkMarkColor as IconColor}
								LEGACY_primaryColor={checkMarkColor}
								label=""
							/>
						)}
						{decorator}
					</button>
				</span>
			</Tooltip>
		);
	},
);
