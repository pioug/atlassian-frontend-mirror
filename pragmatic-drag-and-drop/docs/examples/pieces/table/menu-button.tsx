/** @jsx jsx */
import { type ReactNode, useCallback, useContext } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Tooltip from '@atlaskit/tooltip';

import { TableContext } from './table-context';

/**
 * For positioning the menu button in the header
 */
const menuButtonWrapperStyles = css({
  position: 'absolute',
  right: 4,
  /**
   * This combination of properties ensures exact vertical centering
   */
  top: '50%',
  translate: '0 -50%',
});

export function MenuButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div css={menuButtonWrapperStyles}>
      <DropdownMenu
        trigger={({ triggerRef, ...triggerProps }) => (
          <Tooltip content={label} position="left">
            <Button
              ref={triggerRef}
              {...triggerProps}
              iconBefore={<MoreIcon label={label} size="small" />}
              spacing="compact"
            />
          </Tooltip>
        )}
      >
        <DropdownItemGroup>{children}</DropdownItemGroup>
      </DropdownMenu>
    </div>
  );
}

export function RowMenuButton({
  rowIndex,
  amountOfRows,
}: {
  rowIndex: number;
  amountOfRows: number;
}) {
  const { reorderItem } = useContext(TableContext);

  const moveUp = useCallback(() => {
    reorderItem({
      startIndex: rowIndex,
      indexOfTarget: rowIndex - 1,
    });
  }, [reorderItem, rowIndex]);

  const moveDown = useCallback(() => {
    reorderItem({
      startIndex: rowIndex,
      indexOfTarget: rowIndex + 1,
    });
  }, [reorderItem, rowIndex]);

  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === amountOfRows - 1;

  /**
   * Depending on the context, there might be a better ID to use instead of
   * the index.
   */
  const label = `Actions for row ${rowIndex + 1}`;

  return (
    <MenuButton label={label}>
      <DropdownItem isDisabled={isFirstRow} onClick={moveUp}>
        Move up
      </DropdownItem>
      <DropdownItem isDisabled={isLastRow} onClick={moveDown}>
        Move down
      </DropdownItem>
    </MenuButton>
  );
}

export function ColumnMenuButton({
  columnId,
  columnIndex,
  amountOfHeaders,
}: {
  columnId: string;
  columnIndex: number;
  amountOfHeaders: number;
}) {
  const { reorderColumn } = useContext(TableContext);

  const moveLeft = useCallback(() => {
    reorderColumn({
      startIndex: columnIndex,
      indexOfTarget: columnIndex - 1,
    });
  }, [reorderColumn, columnIndex]);

  const moveRight = useCallback(() => {
    reorderColumn({
      startIndex: columnIndex,
      indexOfTarget: columnIndex + 1,
    });
  }, [reorderColumn, columnIndex]);

  const isFirstColumn = columnIndex === 0;
  const isLastColumn = columnIndex === amountOfHeaders - 1;

  return (
    <MenuButton label={`Actions for column ${columnId}`}>
      <DropdownItem isDisabled={isFirstColumn} onClick={moveLeft}>
        Move left
      </DropdownItem>
      <DropdownItem isDisabled={isLastColumn} onClick={moveRight}>
        Move right
      </DropdownItem>
    </MenuButton>
  );
}
