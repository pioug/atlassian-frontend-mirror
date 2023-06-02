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

const c = (title: any, children?: any) => ({ title, children });

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

describe('expanding and collapsing', () => {
  const nestedData = [
    c('Chapter 1'),
    c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
    c('Chapter 3'),
  ];
  const jsx = (
    <TableTree>
      <Rows
        items={nestedData}
        render={({ title, children }: any) => (
          <Row itemId={title} items={children} hasChildren={children?.length}>
            <Cell>{title}</Cell>
          </Row>
        )}
      />
    </TableTree>
  );

  // This is a little ganky but this is used for the click handler and Jest
  // doesn't really have a version of getSelection that operates according to
  // the spec.
  const originalSelection = window.getSelection;

  beforeEach(() => {
    window.getSelection = jest.fn(() => '' as unknown as Selection);
  });

  afterAll(() => {
    // Clean up
    window.getSelection = originalSelection;
  });

  it('should expand and collapse when using the buttons at the row header', () => {
    const { getAllByRole, getByRole } = render(jsx);

    let rowContent = getAllByRole('gridcell');
    expect(rowContent[0]).toHaveTextContent('Chapter 1');
    expect(rowContent[1]).toHaveTextContent('Chapter 2');
    expect(rowContent[2]).toHaveTextContent('Chapter 3');

    const secondRowExpandButton = getByRole('button', {
      name: /expand/i,
    });
    fireEvent.click(secondRowExpandButton);

    rowContent = getAllByRole('gridcell');

    expect(rowContent[0]).toHaveTextContent('Chapter 1');
    expect(rowContent[1]).toHaveTextContent('Chapter 2');
    expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
    expect(rowContent[3]).toHaveTextContent('Chapter 3');

    const secondFirstChildRowExpandButton = getByRole('button', {
      name: /expand/i,
    });
    fireEvent.click(secondFirstChildRowExpandButton);

    rowContent = getAllByRole('gridcell');
    expect(rowContent[0]).toHaveTextContent('Chapter 1');
    expect(rowContent[1]).toHaveTextContent('Chapter 2');
    expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
    expect(rowContent[3]).toHaveTextContent('Chapter 2.1.1');
    expect(rowContent[4]).toHaveTextContent('Chapter 3');

    const collapseButtons = getAllByRole('button', {
      name: /collapse/i,
    });
    fireEvent.click(collapseButtons[0]);

    rowContent = getAllByRole('gridcell');
    expect(rowContent[0]).toHaveTextContent('Chapter 1');
    expect(rowContent[1]).toHaveTextContent('Chapter 2');
    expect(rowContent[2]).toHaveTextContent('Chapter 3');
  });

  it('should not expand and collapse when clicking anywhere on the row itself when not using shouldExpandOnClick', () => {
    const jsxRow = (
      <TableTree>
        <Rows
          items={nestedData}
          render={({ title, children }: any) => (
            <Row itemId={title} items={children} hasChildren={children?.length}>
              <Cell>{title}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );

    const jsxTableTree = <TableTree items={nestedData} />;

    [jsxRow, jsxTableTree].forEach((jsx) => {
      const { getAllByRole } = render(jsx);

      const rows = getAllByRole('row');

      let rowContent = getAllByRole('gridcell');
      expect(rowContent[0]).toHaveTextContent('Chapter 1');
      expect(rowContent[1]).toHaveTextContent('Chapter 2');
      expect(rowContent[2]).toHaveTextContent('Chapter 3');

      fireEvent.click(rows[1]);
      rowContent = getAllByRole('gridcell');
      expect(rowContent[0]).toHaveTextContent('Chapter 1');
      expect(rowContent[1]).toHaveTextContent('Chapter 2');
      expect(rowContent[2]).toHaveTextContent('Chapter 3');
    });
  });

  it('should expand and collapse when clicking anywhere on the row itself when using shouldExpandOnClick', () => {
    const jsxRow = (
      <TableTree>
        <Rows
          items={nestedData}
          render={({ title, children }: any) => (
            <Row
              itemId={title}
              items={children}
              hasChildren={children?.length}
              shouldExpandOnClick
            >
              <Cell>{title}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );

    const jsxTableTree = <TableTree items={nestedData} shouldExpandOnClick />;

    [jsxRow, jsxTableTree].forEach((jsx) => {
      const { getAllByRole } = render(jsx);

      const rows = getAllByRole('row');

      let rowContent = getAllByRole('gridcell');
      expect(rowContent[0]).toHaveTextContent('Chapter 1');
      expect(rowContent[1]).toHaveTextContent('Chapter 2');
      expect(rowContent[2]).toHaveTextContent('Chapter 3');

      fireEvent.click(rows[1]);
      rowContent = getAllByRole('gridcell');
      expect(rowContent[0]).toHaveTextContent('Chapter 1');
      expect(rowContent[1]).toHaveTextContent('Chapter 2');
      expect(rowContent[2]).toHaveTextContent('Chapter 2.1');
      expect(rowContent[3]).toHaveTextContent('Chapter 3');

      fireEvent.click(rows[1]);
      rowContent = getAllByRole('gridcell');
      expect(rowContent[0]).toHaveTextContent('Chapter 1');
      expect(rowContent[1]).toHaveTextContent('Chapter 2');
      expect(rowContent[2]).toHaveTextContent('Chapter 3');
    });
  });

  it('should not expand when selecting text anywhere on the row', () => {
    // Unfortunately, because Jest's getSelection implementation is lacking, we
    // can't test the selection using RTL, but this will do the trick
    // considering our use of getSelection is only for the `toString` output.
    window.getSelection = jest.fn(() => 'selection' as unknown as Selection);

    const jsxRow = (
      <TableTree>
        <Rows
          items={nestedData}
          render={({ title, children }: any) => (
            <Row
              itemId={title}
              items={children}
              hasChildren={children?.length}
              shouldExpandOnClick
            >
              <Cell>{title}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );

    const jsxTableTree = <TableTree items={nestedData} shouldExpandOnClick />;

    [jsxRow, jsxTableTree].forEach((jsx) => {
      const { getAllByRole } = render(jsx);

      const rows = getAllByRole('row');

      let rowContent = getAllByRole('gridcell');
      expect(rowContent[0]).toHaveTextContent('Chapter 1');
      expect(rowContent[1]).toHaveTextContent('Chapter 2');
      expect(rowContent[2]).toHaveTextContent('Chapter 3');

      // Should not expand because text is selected
      fireEvent.click(rows[1]);
      rowContent = getAllByRole('gridcell');
      expect(rowContent[0]).toHaveTextContent('Chapter 1');
      expect(rowContent[1]).toHaveTextContent('Chapter 2');
      expect(rowContent[2]).toHaveTextContent('Chapter 3');
    });
  });

  it('should show extended label for expand and collapse button when the mainColumnForExpandCollapseLabel is passed as string', () => {
    const nestedItems = [
      {
        id: 'item1',
        content: {
          title: 'Chapter 1: Clean Code',
          numbering: '1',
        },
        hasChildren: true,
        children: [
          {
            id: 'child1.1',
            content: {
              title: 'There Will Be Code',
              numbering: '1.1',
            },
            hasChildren: false,
          },
        ],
      },
    ];
    const Title = (props: any) => <span>{props.title}</span>;
    const Numbering = (props: any) => <span>{props.numbering}</span>;
    const jsxTableTree = (
      <TableTree
        items={nestedItems}
        columns={[Title, Numbering]}
        headers={['Chapter Title', 'Numbering']}
        mainColumnForExpandCollapseLabel="title"
      ></TableTree>
    );

    const { getByLabelText, queryByLabelText } = render(jsxTableTree);

    expect(getByLabelText(/Chapter 1: Clean Code/)).toBeInTheDocument();
    expect(queryByLabelText(/item1/)).not.toBeInTheDocument();
  });

  it('should show extended label for expand and collapse button when the mainColumnForExpandCollapseLabel is passed as number', () => {
    const nestedData = [
      {
        title: 'Chapter 1: Clean Code',
        page: 1,
        numbering: 'item1',
        children: [
          {
            title: 'There Will Be Code',
            page: 4,
            numbering: 'item1.1',
          },
        ],
      },
    ];

    const jsxTableTree = (
      <TableTree>
        <Rows
          items={nestedData}
          render={({ title, page, numbering, children }: any) => (
            <Row
              itemId={numbering}
              items={children}
              hasChildren={children?.length}
              mainColumnForExpandCollapseLabel={0}
            >
              <Cell>{title}</Cell>
              <Cell>{numbering}</Cell>
              <Cell>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );

    const { getByLabelText, queryByLabelText } = render(jsxTableTree);

    expect(getByLabelText(/Chapter 1: Clean Code/)).toBeInTheDocument();
    expect(queryByLabelText(/item1/)).not.toBeInTheDocument();
  });

  it('should show default label for expand and collapse button when the mainColumnForExpandCollapseLabel is not passed', () => {
    const nestedData = [
      {
        title: 'Chapter 1: Clean Code',
        page: 1,
        numbering: 'item1',
        children: [
          {
            title: 'There Will Be Code',
            page: 4,
            numbering: 'item1.1',
          },
        ],
      },
    ];

    const jsxTableTree = (
      <TableTree>
        <Rows
          items={nestedData}
          render={({ title, page, numbering, children }: any) => (
            <Row
              itemId={numbering}
              items={children}
              hasChildren={children?.length}
            >
              <Cell>{title}</Cell>
              <Cell>{numbering}</Cell>
              <Cell>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );

    const { getByLabelText } = render(jsxTableTree);

    expect(getByLabelText(/item1/)).toBeInTheDocument();
  });
});

test('with isDefaultExpanded property', async () => {
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
