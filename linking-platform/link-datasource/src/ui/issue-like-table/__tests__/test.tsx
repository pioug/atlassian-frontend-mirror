import React from 'react';

import { findByTestId, screen } from '@testing-library/dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import {
  MockIntersectionObserverFactory,
  MockIntersectionObserverOpts,
} from '@atlaskit/link-test-helpers';
import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
} from '@atlaskit/linking-types/datasource';

import { IssueLikeDataTableView } from '../index';
import {
  IssueLikeDataTableViewProps,
  TableViewPropsRenderType,
} from '../types';

const dragAndDrop = async (source: HTMLElement, destination: HTMLElement) => {
  fireEvent.dragStart(source);
  act(() => {
    // ticking forward an animation frame will complete the lift
    // @ts-ignore
    requestAnimationFrame.step();
  });
  fireEvent.dragEnter(destination);
  fireEvent.drop(destination);
};

describe('IssueLikeDataTableView', () => {
  let mockGetEntries: jest.Mock;
  let mockIntersectionObserverOpts: MockIntersectionObserverOpts;

  beforeEach(() => {
    jest.useRealTimers();
    mockGetEntries = jest
      .fn()
      .mockImplementation(() => [{ isIntersecting: false }]);
    mockIntersectionObserverOpts = {
      disconnect: jest.fn(),
      getMockEntries: mockGetEntries,
    };
    // Gives us access to a mock IntersectionObserver, which we can
    // use to spoof visibility of a Smart Link.
    window.IntersectionObserver = MockIntersectionObserverFactory(
      mockIntersectionObserverOpts,
    );
  });

  async function assertColumnTitles(onColumnChange?: () => void) {
    const items = [
      { id: 'id0', someKey: 'someData', someOtherKey: 'someOtherValue' },
    ];
    const status: IssueLikeDataTableViewProps['status'] = 'resolved';

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
      {
        key: 'someKey',
        title: 'Some key',
        type: 'string',
        isIdentity: false,
      },
      {
        key: 'someOtherKey',
        title: 'Some Other key',
        type: 'string',
        isIdentity: false,
      },
    ];

    const selectedColumnKeys: string[] = ['id', 'someOtherKey'];

    const renderItem: TableViewPropsRenderType = item => item.value;

    const onNextPage = async () => {};

    const { getByTestId } = render(
      <IssueLikeDataTableView
        testId="sometable"
        items={items}
        status={status}
        hasNextPage={false}
        onNextPage={onNextPage}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={selectedColumnKeys}
        onVisibleColumnKeysChange={onColumnChange}
      />,
    );

    expect(getByTestId('id-column-heading')).toHaveTextContent('ID');
    expect(getByTestId('someOtherKey-column-heading')).toHaveTextContent(
      'Some Other key',
    );
  }

  it('should display X rows in correct order given the data', async () => {
    const items: DatasourceDataResponseItem[] = [
      { id: 'id0' },
      {},
      { id: 'id2' },
      { id: 'id3' },
    ];
    const onNextPage = async () => {};

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
    ];

    const renderItem: TableViewPropsRenderType = item => item.value;

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={['id']}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    const rowTestIds = (await screen.findAllByTestId(/sometable--row-.+/)).map(
      el => el.getAttribute('data-testid'),
    );

    expect(rowTestIds).toEqual([
      'sometable--row-id0',
      'sometable--row-1',
      'sometable--row-id2',
      'sometable--row-id3',
    ]);
  });

  it('should display only selected columns', async () => {
    const items: DatasourceDataResponseItem[] = [
      { id: 'id0', someKey: 'someData', someOtherKey: 'someOtherValue' },
    ];
    const onNextPage = async () => {};

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
      {
        key: 'someKey',
        title: 'Some key',
        type: 'string',
        isIdentity: false,
      },
      {
        key: 'someOtherKey',
        title: 'Some Other key',
        type: 'string',
        isIdentity: false,
      },
    ];

    const selectedColumnKeys: string[] = ['id', 'someOtherKey'];

    const renderItem: TableViewPropsRenderType = item => item.value;

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={selectedColumnKeys}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    const rowColumnTestIds = (
      await screen.findAllByTestId(/sometable--cell-.+/)
    ).map(el => el.getAttribute('data-testid'));
    expect(rowColumnTestIds).toEqual([
      'sometable--cell-0',
      'sometable--cell-1',
    ]);

    expect(screen.getByTestId('sometable--cell-0')).toHaveTextContent('id0');
    expect(screen.getByTestId('sometable--cell-1')).toHaveTextContent(
      'someOtherValue',
    );
  });

  it('should have column titles in table header', async () => {
    await assertColumnTitles(() => {});
  });

  it('should render list type', async () => {
    const items: DatasourceDataResponseItem[] = [
      { listProp: ['item1', 'item2'] },
    ];
    const onNextPage = async () => {};

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'listProp',
        title: 'List',
        type: 'tag',
        isList: true,
      },
    ];

    const renderItem: TableViewPropsRenderType = item => item.value;

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={['listProp']}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent(
      'item1item2',
    );
  });

  it('should use provided renderer to transform data by type', async () => {
    const items: DatasourceDataResponseItem[] = [
      { someNumber: 40, someString: 'abc' },
    ];
    const onNextPage = async () => {};

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'someNumber',
        title: 'Some number',
        type: 'number',
      },
      {
        key: 'someString',
        title: 'Some string',
        type: 'string',
      },
    ];

    const selectedColumnKeys: string[] = ['someNumber', 'someString'];

    const renderItem: TableViewPropsRenderType = item => {
      switch (item.type) {
        case 'number':
          return item.value + 2;
        case 'string':
          return item.value + '-blah';
      }
    };

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={selectedColumnKeys}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent(
      '42',
    );
    expect(await screen.findByTestId('sometable--cell-1')).toHaveTextContent(
      'abc-blah',
    );
  });

  it('should call onNextPage again when scrolled to the bottom and actually has a next page', async () => {
    jest.useFakeTimers();

    let counter = 0;

    const items: DatasourceDataResponseItem[] = [
      { id: `id${counter++}` },
      { id: `id${counter++}` },
      { id: `id${counter++}` },
    ];
    const onNextPage = jest.fn(async () => {});

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
    ];

    const renderItem: TableViewPropsRenderType = item => item.value;
    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={['id']}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    // set bottom visible
    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    // should be called twice total since nextPage is called on initial page load and then when bottom is visible
    expect(onNextPage).toHaveBeenCalledTimes(1);
  });

  it('should not call nextPage again when scrolled to the bottom and does not have a next page', async () => {
    jest.useFakeTimers();

    let counter = 0;

    const items: DatasourceDataResponseItem[] = [
      { id: `id${counter++}` },
      { id: `id${counter++}` },
      { id: `id${counter++}` },
    ];
    const onNextPage = jest.fn(async () => {});

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
    ];

    const renderItem: TableViewPropsRenderType = item => item.value;
    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={['id']}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onNextPage).toHaveBeenCalledTimes(0);
  });

  it('should not call nextPage when scrolled to the bottom and next page is already loading', async () => {
    jest.useFakeTimers();

    let counter = 0;
    const items: DatasourceDataResponseItem[] = [
      { id: `id${counter++}` },
      { id: `id${counter++}` },
      { id: `id${counter++}` },
    ];
    const onNextPage = jest.fn(async () => {});

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
    ];
    const renderItem: TableViewPropsRenderType = item => item.value;
    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'loading'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={['id']}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    // first scroll to bottom
    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // second scroll to bottom
    mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // should only be called twice even though we scrolled to bottom again since second scroll was still in loading state
    expect(onNextPage).not.toHaveBeenCalled();
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // make sure again only called twice after all async stuff just in case
    expect(onNextPage).not.toHaveBeenCalled();
  });

  it('should show special loading row when new page is loading', async () => {
    jest.useFakeTimers();
    let counter = 0;
    const items: DatasourceDataResponseItem[] = [
      { id: `id${counter++}` },
      { id: `id${counter++}` },
      { id: `id${counter++}` },
    ];
    const onNextPage = jest.fn(async () => {});

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
    ];
    const renderItem: TableViewPropsRenderType = item => item.value;

    const { getByTestId } = render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'loading'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={['id']}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    // scroll down
    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(getByTestId('sometable--row-loading')).toBeInTheDocument();
    });
  });

  it('should not show column picker button if onColumnsChange is not passed in', async () => {
    jest.useFakeTimers();
    let counter = 0;
    const items: DatasourceDataResponseItem[] = [
      { id: `id${counter++}` },
      { id: `id${counter++}` },
      { id: `id${counter++}` },
    ];
    const onNextPage = jest.fn(async () => {});

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
    ];
    const renderItem: TableViewPropsRenderType = item => item.value;

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
        visibleColumnKeys={['id']}
        renderItem={renderItem}
      />,
    );

    expect(
      screen.queryByTestId('column-picker-trigger-button'),
    ).not.toBeInTheDocument();
  });

  it('should show column picker button if onColumnsChange is passed in', async () => {
    jest.useFakeTimers();
    let counter = 0;
    const items: DatasourceDataResponseItem[] = [
      { id: `id${counter++}` },
      { id: `id${counter++}` },
      { id: `id${counter++}` },
    ];
    const onNextPage = jest.fn(async () => {});

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
        isIdentity: true,
      },
    ];
    const renderItem: TableViewPropsRenderType = item => item.value;

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={['id']}
        onVisibleColumnKeysChange={() => {}}
      />,
    );

    expect(
      screen.getByTestId('column-picker-trigger-button'),
    ).toBeInTheDocument();
  });

  const makeDragAndDropTableProps = () => {
    const onColumnsChange = jest.fn();
    const onNextPage = jest.fn();
    const items: DatasourceDataResponseItem[] = [
      { id: `id1`, task: 'TASK-1', emoji: ':D' },
      { id: `id2`, task: 'TASK-2', emoji: ':)' },
      { id: `id3`, task: 'TASK-3', emoji: ':(' },
    ];

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'id',
        type: 'string',
        isIdentity: true,
      },
      {
        key: 'task',
        title: 'task',
        type: 'string',
        isIdentity: false,
      },
      {
        key: 'emoji',
        title: 'emoji',
        type: 'string',
        isIdentity: false,
      },
    ];

    const selectedColumnKeys: string[] = ['id', 'task', 'emoji'];

    const renderItem: TableViewPropsRenderType = item => item.value;

    return {
      onNextPage,
      items,
      columns,
      renderItem,
      selectedColumnKeys,
      onColumnsChange,
    };
  };

  it('should have correct column order after a drag and drop reorder', async () => {
    const {
      onColumnsChange,
      columns,
      renderItem,
      onNextPage,
      items,
      selectedColumnKeys,
    } = makeDragAndDropTableProps();

    const { getByTestId, getByLabelText } = render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        onNextPage={onNextPage}
        items={items}
        hasNextPage={false}
        columns={columns}
        renderItem={renderItem}
        visibleColumnKeys={selectedColumnKeys}
        onVisibleColumnKeysChange={onColumnsChange}
      />,
    );

    expect(getByLabelText('emoji-drag-icon')).toBeInTheDocument();

    const dragHandle = screen.getByTestId('id-column-heading');
    const dropTarget = await findByTestId(
      getByTestId('emoji-column-heading'),
      'column-drop-target',
    );

    await dragAndDrop(dragHandle, dropTarget);
    expect(onColumnsChange).toBeCalledTimes(1);
    expect(onColumnsChange).toBeCalledWith(['task', 'id', 'emoji']);
  });

  it('should not be able to drag and drop between tables', async () => {
    const {
      onColumnsChange: onColumnsChange1,
      columns: columns1,
      renderItem: renderItem1,
      onNextPage: onNextPage1,
      items: items1,
      selectedColumnKeys,
    } = makeDragAndDropTableProps();
    const {
      onColumnsChange: onColumnsChange2,
      columns: columns2,
      renderItem: renderItem2,
      onNextPage: onNextPage2,
      items: items2,
    } = makeDragAndDropTableProps();

    const { getByTestId } = render(
      <div>
        <IssueLikeDataTableView
          testId="sometable1"
          status={'resolved'}
          items={items1}
          onNextPage={onNextPage1}
          hasNextPage={false}
          columns={columns1}
          renderItem={renderItem1}
          visibleColumnKeys={selectedColumnKeys}
          onVisibleColumnKeysChange={onColumnsChange1}
        />
        <IssueLikeDataTableView
          testId="sometable2"
          status={'resolved'}
          items={items2}
          onNextPage={onNextPage2}
          hasNextPage={false}
          columns={columns2}
          renderItem={renderItem2}
          visibleColumnKeys={selectedColumnKeys}
          onVisibleColumnKeysChange={onColumnsChange2}
        />
      </div>,
    );

    const table1Head = getByTestId('sometable1--head');
    const table2Head = getByTestId('sometable2--head');

    const dragHandle = await findByTestId(table1Head, 'id-column-heading');
    const table2EmojiHeader = await findByTestId(
      table2Head,
      'emoji-column-heading',
    );
    const dropTarget = await findByTestId(
      table2EmojiHeader,
      'column-drop-target',
    );

    await dragAndDrop(dragHandle, dropTarget);
    expect(onColumnsChange1).not.toHaveBeenCalled();
    expect(onColumnsChange2).not.toHaveBeenCalled();
  });

  describe('when no onColumnsChange provided', () => {
    it('should not show drag and drop features', async () => {
      const { columns, renderItem, onNextPage, items, selectedColumnKeys } =
        makeDragAndDropTableProps();
      const { queryByTestId, queryByLabelText } = render(
        <IssueLikeDataTableView
          testId="sometable"
          status={'resolved'}
          items={items}
          onNextPage={onNextPage}
          hasNextPage={false}
          columns={columns}
          renderItem={renderItem}
          visibleColumnKeys={selectedColumnKeys}
          onVisibleColumnKeysChange={undefined}
        />,
      );

      expect(queryByLabelText('emoji-drag-icon')).toBeNull();
      expect(queryByTestId('column-drop-target')).toBeNull();
    });

    it('should have column titles in table header', async () => {
      await assertColumnTitles(undefined);
    });
  });
});
