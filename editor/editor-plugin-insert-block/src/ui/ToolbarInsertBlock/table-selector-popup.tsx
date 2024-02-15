/** @jsx jsx */
import { useEffect, useMemo, useRef } from 'react';
import type { KeyboardEventHandler, SyntheticEvent } from 'react';

import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { Stack } from '@atlaskit/primitives';
import { B100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const TABLE_SELECTOR_BUTTON_GAP = 2;
export const TABLE_SELECTOR_BUTTON_SIZE = 17;

export interface TableSelectorButtonProps {
  row: number;
  col: number;
  isActive: boolean;
  onClick: OnTableSizeSelection;
  label: string;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
  isFocused: boolean;
  handleInitialButtonFocus: () => void;
}

export interface OnTableSizeSelection {
  (rowsCount: number, colsCount: number, event?: SyntheticEvent): void;
}

const selectedButtonStyles = css({
  backgroundColor: token('color.background.accent.blue.subtlest', '#579DFF'),
  border: `1px solid ${token(
    'color.background.accent.blue.subtle',
    '#579DFF',
  )}`,
});

const buttonStyles = css({
  height: `${TABLE_SELECTOR_BUTTON_SIZE}px`,
  width: `${TABLE_SELECTOR_BUTTON_SIZE}px`,
  border: `1px solid ${token('color.border', '#091e4224')}`,
  backgroundColor: token('color.background.input', '#ffffff'),
  borderRadius: '3px',
  cursor: 'pointer',
  display: 'block',
  '&:focus': {
    outline: 'none',
    border: `1px solid ${token('color.border.focused', B100)}`,
    boxShadow: `0 0 0 0.5px ${token('color.border.focused', B100)}`,
  },
});

const selectionSizeTextStyles = css({
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
        btnRef.current.focus();
      } else {
        btnRef.current.blur();
      }
    }
  }, [isFocused, btnRef]);

  const handleFocus =
    col === 1 && row === 1 ? () => handleInitialButtonFocus() : undefined;
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
  maxCols: number;
  maxRows: number;
  onSelection: OnTableSizeSelection;
  selectedCol: number;
  selectedRow: number;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
  isFocused: boolean;
  handleInitialButtonFocus: () => void;
}

const createArray = (maxCols: number, maxRows: number) => {
  const arr = [];
  for (let i = 1; i < maxRows + 1; i++) {
    for (let j = 1; j < maxCols + 1; j++) {
      arr.push({ col: j, row: i });
    }
  }
  return arr;
};

const gridWrapperStyles = ({
  maxCols,
  maxRows,
}: {
  maxCols: number;
  maxRows: number;
}) =>
  css({
    display: 'grid',
    gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
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

  return (
    <Stack>
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
          const isCurrentFocused =
            isFocused && selectedCol === col && selectedRow === row;
          const isActive =
            selectedCol >= col && selectedRow >= row ? true : false;
          return (
            <TableSelectorButton
              key={index}
              isActive={isActive}
              col={col}
              row={row}
              onClick={onSelection}
              label={`${formatMessage(
                messages.tableSizeSelectorButton,
              )} ${row} x ${col}`}
              onKeyDown={onKeyDown}
              isFocused={isCurrentFocused}
              handleInitialButtonFocus={handleInitialButtonFocus}
            />
          );
        })}
      </div>
      <span css={selectionSizeTextStyles} aria-hidden={true}>
        {`${selectedRow} x ${selectedCol}`}
      </span>
    </Stack>
  );
};

export default injectIntl(TableSelectorPopup);
