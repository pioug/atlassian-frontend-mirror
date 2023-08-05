/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Skeleton } from '@atlaskit/linking-common';
import { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';
import { token } from '@atlaskit/tokens';

import UserType from '../render-type/user';
import { EmptyStateTableHeading } from '../styled';

import Priority from './priority';
import Type from './type';
import { IssuePriority, IssueType } from './types';

type Column = Omit<DatasourceResponseSchemaProperty, 'type' | 'title'> & {
  width: number;
};

type Row = {
  id: number;
  priority: IssuePriority;
  type: IssueType;
  summaryWidth: number;
  statusWidth: number;
};

const tableBodyStyles = css({
  borderBottom: 0,
});

const baseColumns: Column[] = [
  {
    key: 'type',
    width: 50,
  },
  {
    key: 'issue',
    width: 50,
  },
  {
    key: 'summary',
    width: 70,
  },
  {
    key: 'assignee',
    width: 100,
  },
  {
    key: 'priority',
    width: 60,
  },
  {
    key: 'status',
    width: 60,
  },
  {
    key: 'resolution',
    width: 55,
  },
  {
    key: 'created',
    width: 50,
  },
  {
    key: 'due',
    width: 50,
  },
];

const priorities: IssuePriority[] = [
  'low',
  'medium',
  'high',
  'medium',
  'low',
  'blocker',
  'medium',
  'blocker',
  'high',
  'low',
];

const types: IssueType[] = [
  'task',
  'story',
  'commit',
  'epic',
  'bug',
  'task',
  'story',
  'commit',
  'issue',
  'epic',
];

const summaryColumnWidths = [141, 208, 186, 212, 212, 151, 212, 182, 180, 147];
const statusColumnWidths = [75, 54, 66, 73, 52, 73, 55, 80, 66, 59];

const rows: Row[] = new Array(10).fill(null).map((_, index) => ({
  id: index,
  priority: priorities[index],
  type: types[index],
  summaryWidth: summaryColumnWidths[index],
  statusWidth: statusColumnWidths[index],
}));

const cellStyles = css({
  '&:first-child': {
    paddingLeft: token('space.100', '8px'),
  },
  '&:last-child': {
    paddingRight: token('space.100', '8px'),
  },
});

const renderItem = (
  { key, width }: Column,
  { priority, type, summaryWidth, statusWidth }: Row,
  isShimmering: boolean,
) => {
  switch (key) {
    case 'assignee':
      return (
        <UserType>
          <Skeleton
            borderRadius={8}
            testId="empty-state-skeleton"
            height={13}
            isShimmering={isShimmering}
            width={width}
          />
        </UserType>
      );
    case 'priority':
      return <Priority priority={priority} />;
    case 'type':
      return <Type type={type} />;
    case 'summary':
      return (
        <Skeleton
          appearance="blue"
          borderRadius={10}
          testId="empty-state-skeleton"
          height={13}
          isShimmering={isShimmering}
          width={summaryWidth}
        />
      );
    case 'status':
      return (
        <Skeleton
          appearance="blue"
          borderRadius={3}
          testId="empty-state-skeleton"
          height={16}
          isShimmering={isShimmering}
          width={statusWidth}
        />
      );
    default:
      return (
        <Skeleton
          borderRadius={8}
          testId="empty-state-skeleton"
          height={13}
          isShimmering={isShimmering}
          width={width}
        />
      );
  }
};

export interface Props {
  isCompact?: boolean;
  isLoading?: boolean;
  testId?: string;
}

export default ({ isCompact, isLoading = false, testId }: Props) => {
  const columnsToRender = isCompact ? baseColumns.slice(0, 6) : baseColumns;

  return (
    <table data-testid={testId}>
      <thead>
        <tr>
          {columnsToRender.map(({ key, width }) => (
            <EmptyStateTableHeading key={key} style={{ width }}>
              <Skeleton
                appearance="darkGray"
                borderRadius={8}
                testId="empty-state-skeleton"
                isShimmering={isLoading}
                height={13}
                width={width}
              />
            </EmptyStateTableHeading>
          ))}
        </tr>
      </thead>
      <tbody css={tableBodyStyles}>
        {rows.map(row => (
          <tr key={row.id}>
            {columnsToRender.map(column => (
              <td css={cellStyles} key={column.key}>
                {renderItem(column, row, isLoading)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
