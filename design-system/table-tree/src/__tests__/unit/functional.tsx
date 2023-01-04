import React from 'react';

import {
  fireEvent,
  getAllByRole,
  getByRole,
  queryByRole,
  render,
  screen,
} from '@testing-library/react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../../index';

test('flat tree', async () => {
  const flatItems = [
    { title: 'Chapter One', page: 10 },
    { title: 'Chapter Two', page: 20 },
    { title: 'Chapter Three', page: 30 },
  ];

  render(
    <TableTree>
      <Rows
        items={flatItems}
        render={({ title, page }) => (
          <Row itemId={title} hasChildren={false}>
            <Cell>{title}</Cell>
            <Cell>{page}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  const rows = screen.getAllByRole('row');

  expect(rows).toHaveLength(3);

  const [firstRow, secondRow, thirdRow] = rows.map((row) =>
    getAllByRole(row, 'gridcell'),
  );

  expect(firstRow[0]).toHaveTextContent('Chapter One');
  expect(firstRow[1]).toHaveTextContent('10');
  expect(secondRow[0]).toHaveTextContent('Chapter Two');
  expect(secondRow[1]).toHaveTextContent('20');
  expect(thirdRow[0]).toHaveTextContent('Chapter Three');
  expect(thirdRow[1]).toHaveTextContent('30');
});

test('chevron next to items with children', async () => {
  const nestedData = [
    {
      title: 'Chapter One',
      page: 10,
    },
    {
      title: 'Chapter Two',
      page: 20,
      children: [
        {
          title: 'Chapter Two Subchapter One',
          page: 21,
        },
      ],
    },
  ];
  render(
    <TableTree>
      <Rows
        items={nestedData}
        render={({ title, page, children }) => (
          <Row itemId={title} hasChildren={!!children} items={children}>
            <Cell className="title">{title}</Cell>
            <Cell className="page">{page}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  const [firstRow, secondRow] = screen.getAllByRole('row');
  const firstRowExpandChevron = queryByRole(firstRow, 'button', {
    name: /expand/i,
  });
  const secondRowExpandChevron = queryByRole(secondRow, 'button', {
    name: /expand/i,
  });

  expect(firstRowExpandChevron).not.toBeInTheDocument();
  expect(secondRowExpandChevron).toBeInTheDocument();
});

test('expanding and collapsing', async () => {
  const c = (title: any, children?: any) => ({ title, children });
  const nestedData = [
    c('Chapter 1'),
    c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
    c('Chapter 3'),
  ];

  render(
    <TableTree>
      <Rows
        items={nestedData}
        render={({ title, children }: any) => (
          <Row itemId={title} items={children} hasChildren={children?.length}>
            <Cell>{title}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  let rows = screen.getAllByRole('row');
  let rowContent = rows.map((row) => getByRole(row, 'gridcell'));
  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 3');

  let secondRowExpandButton = getByRole(rowContent[1], 'button', {
    name: /expand/i,
  });
  fireEvent.click(secondRowExpandButton);

  rows = screen.getAllByRole('row');
  rowContent = rows.map((row) => getByRole(row, 'gridcell'));

  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
  expect(rowContent[3]).toHaveTextContent('Chapter 3');

  let secondFistChildRowExpandButton = getByRole(rowContent[2], 'button', {
    name: /expand/i,
  });
  fireEvent.click(secondFistChildRowExpandButton);

  rows = screen.getAllByRole('row');
  rowContent = rows.map((row) => getByRole(row, 'gridcell'));
  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
  expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
  expect(rowContent[4]).toHaveTextContent('Chapter 3');

  secondRowExpandButton = getByRole(rowContent[1], 'button', {
    name: /collapse/i,
  });
  fireEvent.click(secondRowExpandButton);

  rows = screen.getAllByRole('row');
  rowContent = rows.map((row) => getByRole(row, 'gridcell'));
  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 3');
});

test('with isDefaultExpanded property', async () => {
  const c = (title: string, children?: any) => ({ title, children });
  const nestedData = [
    c('Chapter 1'),
    c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
    c('Chapter 3'),
  ];

  render(
    <TableTree>
      <Rows
        items={nestedData}
        render={({ title, children }) => (
          <Row
            itemId={title}
            items={children}
            hasChildren={children && children.length}
            isDefaultExpanded
          >
            <Cell>{title}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  const rows = screen.getAllByRole('row');
  const rowContent = rows.map((row) => getByRole(row, 'gridcell'));

  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
  expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
  expect(rowContent[4]).toHaveTextContent('Chapter 3');
});

test('with isExpanded=true property', async () => {
  const c = (title: string, children?: any) => ({ title, children });
  const nestedData = [
    c('Chapter 1'),
    c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
    c('Chapter 3'),
  ];
  const onCollapseSpy = jest.fn();

  render(
    <TableTree>
      <Rows
        items={nestedData}
        render={({ title, children }) => (
          <Row
            itemId={title}
            items={children}
            hasChildren={children && children.length}
            onCollapse={onCollapseSpy}
            isExpanded
          >
            <Cell>{title}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  let rows = screen.getAllByRole('row');
  let rowContent = rows.map((row) => getByRole(row, 'gridcell'));

  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
  expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
  expect(rowContent[4]).toHaveTextContent('Chapter 3');

  const secondRowExpandButton = getByRole(rowContent[1], 'button', {
    name: /collapse/i,
  });
  fireEvent.click(secondRowExpandButton);

  rows = screen.getAllByRole('row');
  rowContent = rows.map((row) => getByRole(row, 'gridcell'));

  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
  expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
  expect(rowContent[4]).toHaveTextContent('Chapter 3');

  expect(onCollapseSpy).toBeCalledWith(
    expect.objectContaining({
      ...c('Chapter 2'),
      children: expect.any(Array),
    }),
    expect.any(Object),
  );
});

test('with isExpanded=false property', async () => {
  const c = (title: string, children?: any) => ({ title, children });
  const nestedData = [
    c('Chapter 1'),
    c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
    c('Chapter 3'),
  ];
  const onExpandSpy = jest.fn();

  render(
    <TableTree>
      <Rows
        items={nestedData}
        render={({ title, children }) => (
          <Row
            itemId={title}
            items={children}
            hasChildren={children && children.length}
            onExpand={onExpandSpy}
            isExpanded={false}
          >
            <Cell>{title}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  let rows = screen.getAllByRole('row');
  let rowContent = rows.map((row) => getByRole(row, 'gridcell'));
  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 3');

  let secondRowExpandButton = getByRole(rowContent[1], 'button', {
    name: /expand/i,
  });
  fireEvent.click(secondRowExpandButton);

  rows = screen.getAllByRole('row');
  rowContent = rows.map((row) => getByRole(row, 'gridcell'));

  expect(rowContent[0]).toHaveTextContent('Chapter 1');
  expect(rowContent[1]).toHaveTextContent('Chapter 2');
  expect(rowContent[2]).toHaveTextContent('Chapter 3');
  expect(onExpandSpy).toBeCalledWith(
    expect.objectContaining({
      ...c('Chapter 2'),
      children: expect.any(Array),
    }),
    expect.any(Object),
  );
});

test('headers and column widths', async () => {
  const nestedData = [
    {
      title: 'Chapter One',
      page: 10,
    },
    {
      title: 'Chapter Two',
      page: 20,
      children: [
        {
          title: 'Chapter Two Subchapter One',
          page: 21,
        },
      ],
    },
  ];

  render(
    <TableTree>
      <Headers>
        <Header width={300}>Chapter title</Header>
        <Header width={100}>Page #</Header>
      </Headers>
      <Rows
        items={nestedData}
        render={({ title, page, children }: any) => (
          <Row itemId={title} items={children} hasChildren={!!children}>
            <Cell className="title">{title}</Cell>
            <Cell className="page">{page}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  let [, ...rows] = screen.getAllByRole('row');
  let rowContent = rows.map((row) => getAllByRole(row, 'gridcell'));

  expect(rows).toHaveLength(2);

  const secondRowExpandButton = getByRole(rowContent[1][0], 'button', {
    name: /expand/i,
  });
  fireEvent.click(secondRowExpandButton);

  const headers = screen.getAllByRole('columnheader');
  expect(headers[1]).toHaveTextContent('Page #');

  [, ...rows] = screen.getAllByRole('row');
  screen.logTestingPlaygroundURL();

  const [firstRow, secondRow, thirdRow] = rows.map((row) =>
    getAllByRole(row, 'gridcell'),
  );

  expect(rows).toHaveLength(3);
  expect(firstRow[0]).toHaveStyle({ width: '300px' });
  expect(firstRow[1]).toHaveStyle({ width: '100px' });
  expect(secondRow[0]).toHaveStyle({ width: '300px' });
  expect(secondRow[1]).toHaveStyle({ width: '100px' });
  expect(thirdRow[0]).toHaveStyle({ width: '300px' });
  expect(thirdRow[1]).toHaveStyle({ width: '100px' });
});
