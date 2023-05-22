import React from 'react';

import { findByTestId, screen } from '@testing-library/dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

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
      {
        id: {
          value: 'id0',
        },
        someKey: {
          value: 'someData',
        },
        someOtherKey: {
          value: 'someOtherValue',
        },
      },
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

    const onNextPage = async () => {};

    const { getByTestId } = render(
      <IssueLikeDataTableView
        testId="sometable"
        items={items}
        status={status}
        hasNextPage={false}
        onNextPage={onNextPage}
        columns={columns}
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
      { id: { value: 'id0' } },
      {},
      {
        id: {
          value: 'id2',
        },
      },
      {
        id: {
          value: 'id3',
        },
      },
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

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
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
      {
        id: {
          value: 'id0',
        },
        someKey: {
          value: 'someData',
        },
        someOtherKey: {
          value: 'someOtherValue',
        },
      },
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

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
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
      {
        listProp: [
          {
            value: 'item1',
          },
          {
            value: 'item2',
          },
        ],
      },
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

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
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
      { someNumber: { value: 40 }, someString: { value: 'abc' } },
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
          return item.value.value + 2;
        case 'string':
          return item.value.value + '-blah';
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
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
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

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
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
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
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

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={false}
        columns={columns}
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
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
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
    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'loading'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
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
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
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

    const { getByTestId } = render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'loading'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
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
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
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

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
        visibleColumnKeys={['id']}
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
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
      {
        id: {
          value: `id${counter++}`,
        },
      },
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

    render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        items={items}
        onNextPage={onNextPage}
        hasNextPage={true}
        columns={columns}
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
      {
        id: { value: `id1` },
        task: {
          value: 'TASK-1',
        },
        emoji: { value: ':D' },
      },
      {
        id: { value: `id2` },
        task: { value: 'TASK-2' },
        emoji: { value: ':)' },
      },
      {
        id: { value: `id3` },
        task: { value: 'TASK-3' },
        emoji: { value: ':(' },
      },
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

    return {
      onNextPage,
      items,
      columns,
      selectedColumnKeys,
      onColumnsChange,
    };
  };

  it('should have correct column order after a drag and drop reorder', async () => {
    const { onColumnsChange, columns, onNextPage, items, selectedColumnKeys } =
      makeDragAndDropTableProps();

    const { getByTestId, getByLabelText } = render(
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        onNextPage={onNextPage}
        items={items}
        hasNextPage={false}
        columns={columns}
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
      onNextPage: onNextPage1,
      items: items1,
      selectedColumnKeys,
    } = makeDragAndDropTableProps();
    const {
      onColumnsChange: onColumnsChange2,
      columns: columns2,
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
      const { columns, onNextPage, items, selectedColumnKeys } =
        makeDragAndDropTableProps();
      const { queryByTestId, queryByLabelText } = render(
        <IssueLikeDataTableView
          testId="sometable"
          status={'resolved'}
          items={items}
          onNextPage={onNextPage}
          hasNextPage={false}
          columns={columns}
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

  describe('when column widths are applied', () => {
    const onNextPage = async () => {};

    const summary: DatasourceResponseSchemaProperty = {
      key: 'summary',
      title: 'Summary',
      type: 'string',
      isList: true,
    };

    const key: DatasourceResponseSchemaProperty = {
      key: 'key',
      title: 'Key',
      type: 'string',
      isList: true,
    };

    const name: DatasourceResponseSchemaProperty = {
      key: 'name',
      title: 'Name',
      type: 'string',
      isList: true,
    };

    const dob: DatasourceResponseSchemaProperty = {
      key: 'dob',
      title: 'DoB',
      type: 'date',
      isList: true,
    };

    const hobby: DatasourceResponseSchemaProperty = {
      key: 'hobby',
      title: 'Hobby',
      type: 'tag',
      isList: true,
    };

    it('should render the header and cells with width from the configured fields', () => {
      const items: DatasourceDataResponseItem[] = [
        { summary: { value: 'summary' }, key: { value: 'KEY-123' } },
      ];

      const { queryByTestId } = render(
        <IntlProvider locale="en">
          <IssueLikeDataTableView
            testId="sometable"
            status={'resolved'}
            items={items}
            onNextPage={onNextPage}
            hasNextPage={false}
            columns={[summary, key]}
            visibleColumnKeys={['summary', 'key']}
          />
        </IntlProvider>,
      );

      expect(queryByTestId('summary-column-heading')).toHaveStyle({
        'max-width': '360px',
      });
      expect(queryByTestId('sometable--cell-0')).toHaveStyle({
        'max-width': '360px',
      });

      expect(queryByTestId('key-column-heading')).toHaveStyle({
        'max-width': '80px',
      });
      expect(queryByTestId('sometable--cell-1')).toHaveStyle({
        'max-width': '80px',
      });
    });

    it('should render the header and cells with width from the configured types', () => {
      const items: DatasourceDataResponseItem[] = [
        { name: { value: 'key1' }, dob: { value: '12/12/2023' } },
      ];

      const { queryByTestId } = render(
        <IntlProvider locale="en">
          <IssueLikeDataTableView
            testId="sometable"
            status={'resolved'}
            items={items}
            onNextPage={onNextPage}
            hasNextPage={false}
            columns={[name, dob]}
            visibleColumnKeys={['name', 'dob']}
          />
        </IntlProvider>,
      );

      expect(queryByTestId('name-column-heading')).toHaveStyle({
        'max-width': '176px',
      });
      expect(queryByTestId('sometable--cell-0')).toHaveStyle({
        'max-width': '176px',
      });

      expect(queryByTestId('dob-column-heading')).toHaveStyle({
        'max-width': '112px',
      });
      expect(queryByTestId('sometable--cell-1')).toHaveStyle({
        'max-width': '112px',
      });
    });

    it('should not render the header and cells with width if not configured', () => {
      const items: DatasourceDataResponseItem[] = [
        {
          summary: { value: 'summary' },
          key: { value: 'KEY-123' },
          name: { value: 'Bob' },
          dob: { value: '12/12/2023' },
          hobby: { value: 'Coding' },
        },
      ];

      const { queryByTestId } = render(
        <IntlProvider locale="en">
          <IssueLikeDataTableView
            testId="sometable"
            status={'resolved'}
            items={items}
            onNextPage={onNextPage}
            hasNextPage={false}
            columns={[summary, key, name, dob, hobby]}
            visibleColumnKeys={['summary', 'key', 'name', 'dob', 'hobby']}
          />
        </IntlProvider>,
      );

      const hobbyHeader = queryByTestId('hobby-column-heading');
      const hobbyCell = queryByTestId('sometable--cell-4');

      expect(hobbyHeader).toBeInTheDocument();
      expect(hobbyCell).toBeInTheDocument();
      expect(hobbyHeader).not.toHaveAttribute('style');
      expect(hobbyCell).not.toHaveAttribute('style');
    });

    it('should render the header and cells with width in draggable mode', () => {
      const items: DatasourceDataResponseItem[] = [
        { summary: { value: 'summary' }, key: { value: 'KEY-123' } },
      ];

      const { queryByTestId } = render(
        <IntlProvider locale="en">
          <IssueLikeDataTableView
            testId="sometable"
            status={'resolved'}
            items={items}
            onNextPage={onNextPage}
            hasNextPage={false}
            columns={[summary, key]}
            visibleColumnKeys={['summary', 'key']}
            onVisibleColumnKeysChange={() => {}}
          />
        </IntlProvider>,
      );

      expect(queryByTestId('summary-column-heading')).toHaveStyle({
        'max-width': '360px',
      });
      expect(queryByTestId('sometable--cell-0')).toHaveStyle({
        'max-width': '360px',
      });

      expect(queryByTestId('key-column-heading')).toHaveStyle({
        'max-width': '80px',
      });
      expect(queryByTestId('sometable--cell-1')).toHaveStyle({
        'max-width': '80px',
      });
    });

    it('should render the header and cells with truncate css properties', () => {
      const items: DatasourceDataResponseItem[] = [
        {
          summary: {
            value: 'summary',
          },
          key: { value: 'KEY-123' },
        },
      ];

      const { queryByTestId } = render(
        <IntlProvider locale="en">
          <IssueLikeDataTableView
            testId="sometable"
            status={'resolved'}
            items={items}
            onNextPage={onNextPage}
            hasNextPage={false}
            columns={[summary, key]}
            visibleColumnKeys={['summary', 'key']}
          />
        </IntlProvider>,
      );

      const tableCell = queryByTestId('sometable--cell-0');
      const styles = getComputedStyle(tableCell!);
      expect(styles.textOverflow).toBe('ellipsis');
    });
  });
});
