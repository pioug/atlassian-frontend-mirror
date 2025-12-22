/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext, useEffect, useMemo, useRef } from 'react';
import type { KeyboardEventHandler, SyntheticEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Stack } from '@atlaskit/primitives/compiled';
import { B100 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { toolbarInsertBlockMessages as messages } from '../../messages';
import { OutsideClickTargetRefContext } from '../../ui-react';

export const TABLE_SELECTOR_BUTTON_GAP = 2;
export const TABLE_SELECTOR_BUTTON_SIZE = 17;

const MULTIPLICATION_SYMBOL = '×';

export interface TableSelectorButtonProps {
	col: number;
	handleInitialButtonFocus: () => void;
	isActive: boolean;
	isFocused: boolean;
	label: string;
	onClick: OnTableSizeSelection;
	onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	row: number;
}

export interface OnTableSizeSelection {
	(rowsCount: number, colsCount: number, event?: SyntheticEvent): void;
}

const selectedButtonStyles = css({
	backgroundColor: token('color.background.accent.blue.subtlest', '#579DFF'),
	border: `${token('border.width')} solid ${token(
		'color.background.accent.blue.subtle',
		'#579DFF',
	)}`,
});

const buttonStyles = css({
	height: `${TABLE_SELECTOR_BUTTON_SIZE}px`,
	width: `${TABLE_SELECTOR_BUTTON_SIZE}px`,
	border: `${token('border.width')} solid ${token('color.border', '#091e4224')}`,
	backgroundColor: token('color.background.input', '#ffffff'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	cursor: 'pointer',
	display: 'block',
	'&:focus': {
		outline: 'none',
		border: `${token('border.width')} solid ${token('color.border.focused', B100)}`,
		boxShadow: `0 0 0 0.5px ${token('color.border.focused', B100)}`,
	},
});

const selectionSizeTextStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '14px',
	display: 'flex',
	justifyContent: 'center',
	marginTop: token('space.075', '5px'),
	padding: token('space.075', '10px'),
});

const TableSelectorButton = ({
	row,
	col,
	isActive,
	onClick,
	label,
	onKeyDown,
	isFocused,
	handleInitialButtonFocus,
}: TableSelectorButtonProps) => {
	const btnRef = useRef<HTMLButtonElement | null>(null);
	useEffect(() => {
		if (btnRef.current) {
			if (isFocused) {
				btnRef.current.focus({
					preventScroll: editorExperiment('platform_editor_controls', 'variant1')
						? true
						: undefined,
				});
			} else {
				btnRef.current.blur();
			}
		}
	}, [isFocused, btnRef]);

	const handleFocus = col === 1 && row === 1 ? () => handleInitialButtonFocus() : undefined;
	return (
		<button
			type="button"
			css={[buttonStyles, isActive ? selectedButtonStyles : undefined]}
			onClick={() => onClick(row, col)}
			aria-label={label}
			onKeyDown={onKeyDown}
			ref={btnRef}
			onFocus={handleFocus}
		/>
	);
};

interface TableSelectorPopupProps {
	handleInitialButtonFocus: () => void;
	isFocused: boolean;
	maxCols: number;
	maxRows: number;
	onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
	onSelection: OnTableSizeSelection;
	selectedCol: number;
	selectedRow: number;
}

const createArray = (maxCols: number, maxRows: number) => {
	const arr: Array<{ col: number; row: number }> = [];
	for (let i = 1; i < maxRows + 1; i++) {
		for (let j = 1; j < maxCols + 1; j++) {
			arr.push({ col: j, row: i });
		}
	}
	return arr;
};

const gridWrapperStyles = ({ maxCols, maxRows }: { maxCols: number; maxRows: number }) =>
	css({
		display: 'grid',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		gridTemplateRows: `repeat(${maxRows}, 1fr)`,
		gap: `${token('space.025', `${TABLE_SELECTOR_BUTTON_GAP}px`)}`,
	});

const TableSelectorPopup = ({
	maxCols,
	maxRows,
	onSelection,
	selectedCol,
	selectedRow,
	onKeyDown,
	isFocused,
	handleInitialButtonFocus,
	intl: { formatMessage },
}: TableSelectorPopupProps & WrappedComponentProps) => {
	const buttons = useMemo(() => {
		return createArray(maxCols, maxRows);
	}, [maxCols, maxRows]);
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	return (
		<Stack ref={setOutsideClickTargetRef}>
			<div
				aria-label={`${formatMessage(messages.tableSizeSelectorPopup)}`}
				css={
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					gridWrapperStyles({
						maxCols: maxCols,
						maxRows: maxRows,
					})
				}
			>
				{buttons.map(({ col, row }, index) => {
					const isCurrentFocused = isFocused && selectedCol === col && selectedRow === row;
					const isActive = selectedCol >= col && selectedRow >= row ? true : false;
					return (
						<TableSelectorButton
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							isActive={isActive}
							col={col}
							row={row}
							onClick={onSelection}
							label={`${formatMessage(messages.tableSizeSelectorButton, {
								numberOfColumns: col,
								numberOfRows: row,
							})}`}
							onKeyDown={onKeyDown}
							isFocused={isCurrentFocused}
							handleInitialButtonFocus={handleInitialButtonFocus}
						/>
					);
				})}
			</div>
			<span css={selectionSizeTextStyles} aria-hidden={true}>
				{fg('platform_editor_dec_a11y_fixes')
					? `${selectedCol} ${MULTIPLICATION_SYMBOL} ${selectedRow}`
					: `${selectedCol} x ${selectedRow}`}
			</span>
		</Stack>
	);
};

export default injectIntl(TableSelectorPopup);
