/* eslint-disable no-unused-vars */
/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import ArrowDownIcon from '@atlaskit/icon/glyph/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/glyph/arrow-up';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useTable } from './hooks/use-table';
import { TH } from './ui';

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
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  margin: '0 -2px !important',
  gap: token('space.050', '4px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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

  const getSortIcon = () => {
    if (sortKey === name) {
      switch (sortDirection) {
        case undefined:
          return undefined;
        case 'ascending':
          return <ArrowUpIcon size="small" label="" primaryColor="inherit" />;
        case 'descending':
          return <ArrowDownIcon size="small" label="" primaryColor="inherit" />;
      }
    }
    return undefined;
  };

  return (
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    <TH testId={testId} {...other}>
      <Tooltip content={getSortMessage()} position="top">
        {tooltipProps => (
          <Button
            spacing="compact"
            appearance="subtle"
            iconAfter={getSortIcon()}
            {...tooltipProps}
            // @ts-expect-error
            onClick={() => setSortState(name)}
            css={overrideStyles}
          >
            {children}
          </Button>
        )}
      </Tooltip>
    </TH>
  );
};

export default SortableColumn;
