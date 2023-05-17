/** @jsx jsx */
import { useCallback } from 'react';

import { jsx } from '@emotion/react';

import { Skeleton } from '@atlaskit/linking-common';
import { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';

import UserType from '../render-type/user';
import { TableHeading } from '../styled';

import Priority from './priority';
import Type from './type';
import { IssuePriority, IssueType } from './types';

type Column = Omit<DatasourceResponseSchemaProperty, 'type'> & {
  width?: number;
};

type Row = {
  id: number;
  priority: IssuePriority;
  type: IssueType;
  summaryWidth: number;
  statusWidth: number;
};

const columns: Column[] = [
  {
    key: 'type',
    title: 'Type',
  },
  {
    key: 'issue',
    title: 'Key',
    width: 50,
  },
  {
    key: 'summary',
    title: 'Summary',
  },
  {
    key: 'assignee',
    title: 'Assignee',
    width: 100,
  },
  {
    key: 'priority',
    title: 'P',
  },
  {
    key: 'status',
    title: 'Status',
  },
  {
    key: 'resolution',
    title: 'Resolution',
  },
  {
    key: 'created',
    title: 'Created',
  },
  {
    key: 'due',
    title: 'Updated',
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

export interface Props {
  testId?: string;
}

export default (props: Props) => {
  const renderItem = useCallback(
    (
      { key, width }: Column,
      { priority, type, summaryWidth, statusWidth }: Row,
    ) => {
      switch (key) {
        case 'assignee':
          return (
            <UserType>
              <Skeleton width={width} height={13} borderRadius={8} />
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
              width={summaryWidth}
              borderRadius={10}
              height={13}
            />
          );
        case 'status':
          return (
            <Skeleton
              appearance="blue"
              width={statusWidth}
              height={16}
              borderRadius={3}
            />
          );
        default:
          return <Skeleton width={width} height={13} borderRadius={8} />;
      }
    },
    [],
  );

  return (
    <table data-testid={props.testId}>
      <thead>
        <tr>
          {columns.map(({ title, key, width }) => (
            <TableHeading key={key} style={{ width }}>
              {title}
            </TableHeading>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            {columns.map(column => (
              <td key={column.key}>{renderItem(column, row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
