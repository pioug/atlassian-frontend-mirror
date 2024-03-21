/* eslint-disable no-unused-vars */
/** @jsx jsx */
import { FC, ReactNode, useCallback } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useTable } from './hooks/use-table';
import { SortIcon as SortIconPrimitive } from './ui/sort-icon';
import { TH as THPrimitive } from './ui/th';

export interface CellProps {
  /**
   * Unique key used for sorting table data by this column
   */
  name: string;
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid`
   * in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  onClick?: React.MouseEventHandler;
  children?: ReactNode;
}

/**
 * TODO these need to be i18n supported
 */
const sortingMessages = {
  unsorted: {
    string: 'Sort from A to Z',
    number: 'Sort from 0 to 9',
  },
  ascending: {
    string: 'Sort from A to Z',
    number: 'Sort from 0 to 9',
  },
  descending: {
    string: 'Sort from Z to A',
    number: 'Sort from 9 to 0',
  },
};

const overrideStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  margin: '0 -2px !important',
  gap: token('space.050', '4px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  paddingInline: `2px !important`,
});

/**
 * __SortableColumn__
 *
 * SortableColumn is used in place of the default Column when sorting is desired.
 */
const SortableColumn: FC<CellProps> = ({
  name,
  testId,
  onClick,
  children,
  ...other
}) => {
  const { sortKey, sortDirection, setSortState } = useTable();

  const getSortMessage = () => {
    if (sortKey === name) {
      // TODO: Change message depending on data type (string/number)
      return sortingMessages[sortDirection || 'unsorted'].string;
    }
    return sortingMessages.unsorted.string;
  };

  const updateSortState = useCallback(
    // @ts-expect-error: TODO: Our `name` typing is off; refer to `SortKey`
    () => setSortState(name),
    [setSortState, name],
  );

  return (
    <THPrimitive
      testId={testId}
      sortDirection={sortKey === name ? sortDirection : 'none'}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...other}
    >
      <Tooltip content={getSortMessage()} position="top">
        {tooltipProps => (
          <Button
            testId={`${testId}--button`}
            spacing="compact"
            appearance="subtle"
            iconAfter={<SortIconPrimitive name={name} />}
            {...tooltipProps}
            onClick={updateSortState}
            // TODO: (from codemod) Buttons with "css" or "style" prop can't be migrated for now. Please wait for the support of xcss prop.
            css={overrideStyles}
            // TODO: i18n support for this attr
            aria-roledescription="Column sort button"
          >
            {children}
          </Button>
        )}
      </Tooltip>
    </THPrimitive>
  );
};

export default SortableColumn;
