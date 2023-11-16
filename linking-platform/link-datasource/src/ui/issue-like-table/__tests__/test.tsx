import React from 'react';

import {
  findByTestId,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import {
  flushPromises,
  MockIntersectionObserverFactory,
  MockIntersectionObserverOpts,
} from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
} from '@atlaskit/linking-types/datasource';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/types';
import { ConcurrentExperience } from '@atlaskit/ufo';

import { ScrollableContainerHeight } from '../../../../src/ui/issue-like-table/styled';
import {
  COLUMN_MIN_WIDTH,
  getOrderedColumns,
  IssueLikeDataTableView,
} from '../index';
import {
  IssueLikeDataTableViewProps,
  TableViewPropsRenderType,
} from '../types';

function getDefaultInput(overrides: Partial<Input> = {}): Input {
  const defaults: Input = {
    // user input
    altKey: false,
    button: 0,
    buttons: 0,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,

    // coordinates
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
  };

  return {
    ...defaults,
    ...overrides,
  };
}

const mockColumnPickerUfoStart = jest.fn();
const mockColumnPickerUfoAddMetadata = jest.fn();
const mockTableRenderUfoSuccess = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/ufo'),
  ConcurrentExperience: (
    experienceId: string,
  ): Partial<ConcurrentExperience> => ({
    experienceId: experienceId,
    getInstance: jest.fn().mockImplementation(() => {
      if (experienceId === 'datasource-rendered') {
        return {
          success: mockTableRenderUfoSuccess,
        };
      }
      if (experienceId === 'column-picker-rendered') {
        return {
          start: mockColumnPickerUfoStart,
          addMetadata: mockColumnPickerUfoAddMetadata,
        };
      }
    }),
  }),
}));

const dragAndDrop = async (
  source: HTMLElement,
  destination: HTMLElement,
  moveItBy: number = 5,
) => {
  fireEvent.dragStart(source, getDefaultInput({ clientX: 5 }));
  act(() => {
    // ticking forward an animation frame will complete the lift
    // @ts-ignore
    requestAnimationFrame.step();
  });
  fireEvent.dragEnter(destination);
  fireEvent.dragOver(destination, getDefaultInput({ clientX: 5 + moveItBy }));
  act(() => {
    // ticking forward an animation frame will complete the lift
    // @ts-ignore
    requestAnimationFrame.step();
  });
  fireEvent.drop(destination);
};

const setup = (props: Partial<IssueLikeDataTableViewProps>) => {
  const onNextPage = jest.fn(() => {});
  const onLoadDatasourceDetails = jest.fn(() => {});
  const onVisibleColumnKeysChange = jest.fn(() => {});
  const onColumnResize = jest.fn(() => {});

  const renderResult = render(
    <IntlProvider locale="en">
      <IssueLikeDataTableView
        testId="sometable"
        status={'resolved'}
        onNextPage={onNextPage}
        onLoadDatasourceDetails={onLoadDatasourceDetails}
        hasNextPage={false}
        onVisibleColumnKeysChange={onVisibleColumnKeysChange}
        onColumnResize={onColumnResize}
        items={[]}
        columns={[]}
        visibleColumnKeys={['id']}
        {...props}
      />
    </IntlProvider>,
  );

  let wasColumnPickerOpenBefore = false;
  const openColumnPicker = async () => {
    const { getByTestId, getByText, baseElement } = renderResult;
    const triggerButton = getByTestId('column-picker-trigger-button');
    invariant(triggerButton);

    // open popup
    act(() => {
      fireEvent.click(triggerButton);
    });

    if (!wasColumnPickerOpenBefore) {
      expect(getByText('Loading...')).not.toBeNull();
      await waitForElementToBeRemoved(() => getByText('Loading...'));
    }
    wasColumnPickerOpenBefore = true;

    const picker = baseElement.querySelector('#column-picker-popup');
    invariant(picker);
    const allOptions = picker.querySelectorAll('.column-picker-popup__option');
    const selectedOptions = picker.querySelectorAll(
      '.column-picker-popup__option--is-selected',
    );

    const close = () => {
      // close popup
      act(() => {
        fireEvent.click(triggerButton);
      });
    };

    return {
      close,
      picker,
      allOptions,
      selectedOptions,
    };
  };

  return {
    ...renderResult,
    onNextPage,
    onLoadDatasourceDetails,
    onVisibleColumnKeysChange,
    onColumnResize,
    openColumnPicker,
  };
};

describe('IssueLikeDataTableView', () => {
  let mockGetEntries: jest.Mock;
  let mockIntersectionObserverOpts: MockIntersectionObserverOpts;
  let mockCallBackFn: jest.Mock;
  let mockGetBoundingClientRect: jest.Mock;

  beforeEach(() => {
    jest.useRealTimers();
    mockGetEntries = jest
      .fn()
      .mockImplementation(() => [{ isIntersecting: false }]);
    mockCallBackFn = jest.fn(async () => {});
    mockIntersectionObserverOpts = {
      disconnect: jest.fn(),
      getMockEntries: mockGetEntries,
    };
    // Gives us access to a mock IntersectionObserver, which we can
    // use to spoof visibility of a Smart Link.
    window.IntersectionObserver = MockIntersectionObserverFactory(
      mockIntersectionObserverOpts,
    );
    mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    // for (let width = 100; width < 500; width += 100) {
    //   mockGetBoundingClientRect.mockReturnValueOnce({width, height: 42});
    // }
    mockGetBoundingClientRect.mockReturnValue({ width: 600, height: 42 });
  });

  afterEach(() => {
    asMock(Element.prototype.getBoundingClientRect).mockRestore();
  });

  const getSimpleItems = (amount: number = 3): DatasourceDataResponseItem[] =>
    Array(amount)
      .fill(null)
      .map<DatasourceDataResponseItem>((_, i) => ({
        id: {
          data: `id${i}`,
        },
      }));

  const getComplexItems = (): DatasourceDataResponseItem[] => [
    {
      id: {
        data: 'id0',
      },
      someKey: {
        data: 'someData',
      },
      someOtherKey: {
        data: 'someOtherValue',
      },
    },
  ];

  const getSimpleColumns = (): DatasourceResponseSchemaProperty[] => [
    {
      key: 'id',
      title: 'ID',
      type: 'string',
    },
  ];

  const getComplexColumns = (): DatasourceResponseSchemaProperty[] => [
    {
      key: 'id',
      title: 'Some Id',
      type: 'string',
    },
    {
      key: 'someKey',
      title: 'Some key',
      type: 'string',
    },
    {
      key: 'someOtherKey',
      title: 'Some Other key',
      type: 'string',
    },
  ];

  const getExampleColumns = (): DatasourceResponseSchemaProperty[] => [
    {
      key: 'key',
      title: 'Key',
      type: 'link',
    },
    {
      key: 'type',
      type: 'icon',
      title: 'Type',
    },
    {
      key: 'summary',
      title: 'Summary',
      type: 'link',
    },
    {
      key: 'description',
      title: 'Description',
      type: 'richtext',
    },
    {
      key: 'assignee',
      title: 'Assignee',
      type: 'user',
    },
    {
      key: 'priority',
      title: 'P',
      type: 'icon',
    },
    {
      key: 'labels',
      title: 'Labels',
      type: 'tag',
      isList: true,
    },
    {
      key: 'status',
      title: 'Status for each issue',
      type: 'status',
    },
    {
      key: 'created',
      title: 'Date of Creation for each issue',
      type: 'date',
    },
  ];

  async function assertColumnTitles(onColumnChange?: () => void) {
    const items = getComplexItems();
    const columns = getComplexColumns();

    const { getByTestId } = setup({
      items,
      columns,
      visibleColumnKeys: ['id', 'someOtherKey'],
      onVisibleColumnKeysChange: onColumnChange,
    });

    expect(getByTestId('id-column-heading')).toHaveTextContent('Some Id');
    expect(getByTestId('someOtherKey-column-heading')).toHaveTextContent(
      'Some Other key',
    );
  }

  it('should sort columns in correct order for column picker', () => {
    const columns = getExampleColumns();
    const visibleColumnKeys = ['created', 'priority', 'key'];
    const orderedColumns = getOrderedColumns(columns, visibleColumnKeys);
    const expectedOrderedColumns = [
      {
        key: 'created',
        title: 'Date of Creation for each issue',
        type: 'date',
      },
      {
        key: 'priority',
        title: 'P',
        type: 'icon',
      },
      {
        key: 'key',
        title: 'Key',
        type: 'link',
      },
      {
        key: 'type',
        type: 'icon',
        title: 'Type',
      },
      {
        key: 'summary',
        title: 'Summary',
        type: 'link',
      },
      {
        key: 'description',
        title: 'Description',
        type: 'richtext',
      },
      {
        key: 'assignee',
        title: 'Assignee',
        type: 'user',
      },
      {
        key: 'labels',
        title: 'Labels',
        type: 'tag',
        isList: true,
      },
      {
        key: 'status',
        title: 'Status for each issue',
        type: 'status',
      },
    ];
    expect(orderedColumns).toEqual(expectedOrderedColumns);
  });

  it('should display X rows in correct order given the data', async () => {
    const items: DatasourceDataResponseItem[] = [
      { id: { data: 'id0' } },
      {},
      {
        id: {
          data: 'id2',
        },
      },
      {
        id: {
          data: 'id3',
        },
      },
    ];

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'ID',
        type: 'string',
      },
    ];

    setup({
      items,
      columns,
    });

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
    const items = getComplexItems();
    const columns = getComplexColumns();

    const visibleColumnKeys = ['id', 'someOtherKey'];

    setup({
      items,
      columns,
      visibleColumnKeys,
    });

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

  it('should show tooltip when table header title is hovered', async () => {
    jest.useFakeTimers();
    const items = getComplexItems();
    const columns = getComplexColumns();

    setup({
      items,
      columns,
      visibleColumnKeys: ['id', 'someOtherKey'],
    });

    const headerText = screen.getByText('Some Id');
    expect(headerText).toBeInTheDocument();

    // hover over the tooltip
    act(() => {
      fireEvent.mouseOver(headerText);
      jest.runAllTimers();
    });

    const usersListWrapper = await screen.findByRole('tooltip');
    expect(usersListWrapper).toBeInTheDocument();
    expect(usersListWrapper).toHaveAttribute('data-placement', 'bottom');

    expect(usersListWrapper.textContent).toEqual('Some Id');
  });

  it('should render list type', async () => {
    const items: DatasourceDataResponseItem[] = [
      {
        listProp: {
          data: [
            {
              text: 'item1',
            },
            {
              text: 'item2',
            },
          ],
        },
      },
    ];

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'listProp',
        title: 'List',
        type: 'tag',
        isList: true,
      },
    ];

    setup({
      items,
      columns,
      visibleColumnKeys: ['listProp'],
    });

    expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent(
      'item1item2',
    );
  });

  it('should be backward compatible and render with the old response format', async () => {
    const items: any[] = [
      {
        listProp: [
          {
            text: 'item1',
          },
          {
            text: 'item2',
          },
        ],
        name: 'test-name',
        anotherName: {
          data: 'another-test-name',
        },
      },
    ];

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'listProp',
        title: 'List',
        type: 'tag',
      },
      {
        key: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        key: 'anotherName',
        title: 'Name',
        type: 'string',
      },
    ];

    setup({
      items,
      columns,
      visibleColumnKeys: ['listProp', 'name', 'anotherName'],
    });

    expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent(
      'item1item2',
    );
    expect(await screen.findByTestId('sometable--cell-1')).toHaveTextContent(
      'test-name',
    );
    expect(await screen.findByTestId('sometable--cell-2')).toHaveTextContent(
      'another-test-name',
    );
  });

  it('should use provided renderer to transform data by type', async () => {
    const items: DatasourceDataResponseItem[] = [
      { someNumber: { data: 40 }, someString: { data: 'abc' } },
    ];

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

    const visibleColumnKeys: string[] = ['someNumber', 'someString'];

    const renderItem: TableViewPropsRenderType = item => {
      switch (item.type) {
        case 'number':
          return item.value + 2;
        case 'string':
          return item.value + '-blah';
      }
    };

    setup({
      items,
      columns,
      visibleColumnKeys,
      renderItem,
      hasNextPage: true,
    });

    expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent(
      '42',
    );
    expect(await screen.findByTestId('sometable--cell-1')).toHaveTextContent(
      'abc-blah',
    );
  });

  it('should call onNextPage again when scrolled to the bottom and actually has a next page', async () => {
    jest.useFakeTimers();

    const items = getSimpleItems();
    const columns = getSimpleColumns();

    const { onNextPage } = setup({
      items,
      columns,
      hasNextPage: true,
    });

    // set bottom visible
    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    // should be called twice total since nextPage is called on initial page load and then when bottom is visible
    expect(onNextPage).toHaveBeenCalledTimes(1);
    expect(onNextPage).toHaveBeenCalledWith({
      isSchemaFromData: false,
      shouldForceRequest: true,
    });
  });

  it('should not call nextPage again when scrolled to the bottom and does not have a next page', async () => {
    jest.useFakeTimers();
    const items = getSimpleItems();
    const columns = getSimpleColumns();

    const { onNextPage } = setup({
      items,
      columns,
      hasNextPage: false,
    });

    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onNextPage).toHaveBeenCalledTimes(0);
  });

  it('should not call nextPage when scrolled to the bottom and next page is already loading', async () => {
    jest.useFakeTimers();

    const items = getSimpleItems();
    const columns = getSimpleColumns();

    const { onNextPage } = setup({
      items,
      columns,
      status: 'loading',
      hasNextPage: true,
    });

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

  it('returns 10 loading rows when there are no tableRows and status is loading and scrollableContainerHeight is not provided (modal)', () => {
    jest.useFakeTimers();
    const items: DatasourceDataResponseItem[] = [];
    const columns: DatasourceResponseSchemaProperty[] = [];

    const { getByTestId, queryByTestId } = setup({
      items,
      columns,
      status: 'loading',
      hasNextPage: false,
    });
    for (let i = 0; i < 10; i++) {
      expect(getByTestId(`sometable--row-loading-${i}`)).toBeInTheDocument();
    }
    expect(queryByTestId('sometable--row-loading-10')).toBeNull();
  });

  it('returns 14 loading rows when there are no tableRows and status is loading and scrollableContainerHeight is provided (non-modal)', () => {
    jest.useFakeTimers();
    const items: DatasourceDataResponseItem[] = [];
    const columns: DatasourceResponseSchemaProperty[] = [];

    const { getByTestId, queryByTestId } = setup({
      items,
      columns,
      status: 'loading',
      hasNextPage: false,
      scrollableContainerHeight: ScrollableContainerHeight,
    });
    for (let i = 0; i < 14; i++) {
      expect(getByTestId(`sometable--row-loading-${i}`)).toBeInTheDocument();
    }
    expect(queryByTestId('sometable--row-loading-14')).toBeNull();
  });

  it('should show 1 loading row when new page is loading', async () => {
    jest.useFakeTimers();
    const items = getSimpleItems();
    const columns = getSimpleColumns();

    const { getByTestId } = setup({
      items,
      columns,
      status: 'loading',
      hasNextPage: true,
    });

    // scroll down
    mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(getByTestId('issues-table-row-loading')).toBeInTheDocument();
    });
  });

  it('should not show column picker button if onColumnsChange is not passed in', async () => {
    jest.useFakeTimers();

    const items = getSimpleItems();
    const columns = getSimpleColumns();

    setup({
      items,
      columns,
      hasNextPage: true,
      onVisibleColumnKeysChange: undefined,
    });

    expect(
      screen.queryByTestId('column-picker-trigger-button'),
    ).not.toBeInTheDocument();
  });

  it('should show column picker button if onColumnsChange is passed in', async () => {
    jest.useFakeTimers();
    const items = getSimpleItems();
    const columns = getSimpleColumns();

    setup({
      items,
      hasNextPage: true,
      columns,
    });

    expect(
      screen.getByTestId('column-picker-trigger-button'),
    ).toBeInTheDocument();
  });

  describe('column picker integration', () => {
    it('should call onLoadDatasourceDetails when opening the picker for the first time', async () => {
      jest.useFakeTimers();
      const items = getSimpleItems();
      const columns = getSimpleColumns();

      const { onLoadDatasourceDetails, openColumnPicker } = setup({
        items,
        columns,
        hasNextPage: true,
      });

      await openColumnPicker();
      expect(onLoadDatasourceDetails).toHaveBeenCalledTimes(1);
    });

    it('should not call onLoadDatasourceDetails after opening the picker for the first time', async () => {
      jest.useFakeTimers();
      const items = getSimpleItems();
      const columns = getSimpleColumns();

      const { onLoadDatasourceDetails, openColumnPicker } = setup({
        items,
        columns,
        hasNextPage: true,
      });

      const { close } = await openColumnPicker();

      await flushPromises();

      close();

      await openColumnPicker();

      expect(onLoadDatasourceDetails).toHaveBeenCalledTimes(1);
    });

    it('should show all columns', async () => {
      jest.useFakeTimers();
      const items = getComplexItems();
      const columns = getComplexColumns();

      const { openColumnPicker } = setup({
        items,
        columns,
        visibleColumnKeys: ['someKey', 'someOtherKey'],
        hasNextPage: true,
      });

      const { allOptions } = await openColumnPicker();

      expect(allOptions).toHaveLength(3);
    });

    it('should have visible columns selected', async () => {
      jest.useFakeTimers();
      const items = getComplexItems();
      const columns = getComplexColumns();

      const { openColumnPicker } = setup({
        items,
        columns,
        visibleColumnKeys: ['someKey', 'someOtherKey'],
        hasNextPage: true,
      });

      const { selectedOptions } = await openColumnPicker();

      expect(selectedOptions).toHaveLength(2);
    });

    it('should update visible columns when column is unselected', async () => {
      jest.useFakeTimers();
      const items = getComplexItems();
      const columns = getComplexColumns();

      const { onVisibleColumnKeysChange, openColumnPicker, getByTestId } =
        setup({
          items,
          columns,
          visibleColumnKeys: ['someKey', 'someOtherKey'],
          hasNextPage: true,
        });

      const { selectedOptions } = await openColumnPicker();

      expect(getByTestId('someKey-column-heading')).toHaveTextContent(
        'Some key',
      );
      expect(getByTestId('someOtherKey-column-heading')).toHaveTextContent(
        'Some Other key',
      );

      const otherKeyItem = Array.from(selectedOptions).find(
        el => (el as HTMLElement).innerText === 'Some Other key',
      );
      invariant(otherKeyItem);

      act(() => {
        fireEvent.click(otherKeyItem);
      });

      expect(onVisibleColumnKeysChange).toHaveBeenLastCalledWith(['someKey']);
    });
  });

  const makeDragAndDropTableProps = () => {
    const onColumnsChange = jest.fn();
    const onNextPage = jest.fn();
    const items: DatasourceDataResponseItem[] = [
      {
        id: { data: `id1` },
        task: {
          data: 'TASK-1',
        },
        emoji: { data: ':D' },
      },
      {
        id: { data: `id2` },
        task: { data: 'TASK-2' },
        emoji: { data: ':)' },
      },
      {
        id: { data: `id3` },
        task: { data: 'TASK-3' },
        emoji: { data: ':(' },
      },
    ];

    const columns: DatasourceResponseSchemaProperty[] = [
      {
        key: 'id',
        title: 'id',
        type: 'string',
      },
      {
        key: 'task',
        title: 'task',
        type: 'string',
      },
      {
        key: 'emoji',
        title: 'emoji',
        type: 'string',
      },
    ];

    const visibleColumnKeys: string[] = ['id', 'task', 'emoji'];

    return {
      onNextPage,
      items,
      columns,
      visibleColumnKeys,
      onColumnsChange,
    };
  };

  it('should not have column resizing handles when no onWidthChange was given', () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    const { queryByTestId } = setup({
      onColumnResize: undefined,
      items,
      columns,
      visibleColumnKeys,
      columnCustomSizes: { id: 100, task: 200, emoji: 300 },
      hasNextPage: false,
    });

    expect(queryByTestId('column-resize-handle')).toBeNull();
  });

  it('should use max-width when onWidthChange is not defined AND there are NO custom widths defined neither', () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    const { queryByTestId, queryAllByTestId } = setup({
      onColumnResize: undefined,
      items,
      columns,
      visibleColumnKeys,
      columnCustomSizes: undefined,
      hasNextPage: false,
    });

    expect(queryByTestId('task-column-heading')).toHaveStyle(
      'max-width: 176px',
    );
    expect(queryAllByTestId('sometable--cell-1')[0]).toHaveStyle(
      'max-width: 176px',
    );
    expect(queryByTestId('sometable')).not.toHaveStyle('table-layout: fixed');
  });

  it('should use max-width when in readonly mode AND there are NO custom widths defined either', () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    const { queryByTestId, queryAllByTestId } = setup({
      onColumnResize: undefined,
      onVisibleColumnKeysChange: undefined,
      items,
      columns,
      visibleColumnKeys,
      columnCustomSizes: undefined,
      hasNextPage: false,
    });

    expect(queryByTestId('task-column-heading')).toHaveStyle(
      'max-width: 176px',
    );
    expect(queryAllByTestId('sometable--cell-1')[0]).toHaveStyle(
      'max-width: 176px',
    );
    expect(queryByTestId('sometable')).not.toHaveStyle('table-layout: fixed');
  });

  it('should use width when in readonly mode AND there ARE custom widths defined', () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    const { queryByTestId, queryAllByTestId } = setup({
      onColumnResize: undefined,
      onVisibleColumnKeysChange: undefined,
      items,
      columns,
      visibleColumnKeys,
      columnCustomSizes: { emoji: 300 },
      hasNextPage: false,
    });

    expect(queryByTestId('task-column-heading')).toHaveStyle('width: 176px');
    expect(queryAllByTestId('sometable--cell-1')[0]).toHaveStyle(
      'width: 176px',
    );
    expect(queryByTestId('emoji-column-heading')).toHaveStyle('width: 300px');
    expect(queryByTestId('sometable')).toHaveStyle('table-layout: fixed');
  });

  it('should call onWidthChange when column resized', async () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    mockGetBoundingClientRect.mockReturnValueOnce({ width: 100, height: 42 });
    mockGetBoundingClientRect.mockReturnValueOnce({ width: 200, height: 42 });
    mockGetBoundingClientRect.mockReturnValueOnce({ width: 300, height: 42 });

    mockGetBoundingClientRect.mockReturnValueOnce({ width: 200, height: 42 });

    const { onColumnResize, getByTestId } = setup({
      items,
      columns,
      visibleColumnKeys,
      columnCustomSizes: { id: 100, task: 200, emoji: 300 },
      hasNextPage: false,
    });

    const dragHandle = await findByTestId(
      getByTestId('task-column-heading'),
      'column-resize-handle',
    );
    await dragAndDrop(dragHandle, dragHandle);

    expect(onColumnResize).toHaveBeenCalledWith('task', 205);
  });

  it('should not allow column width smaller then COLUMN_MIN_WIDTH when resized resized', async () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    mockGetBoundingClientRect.mockReturnValueOnce({ width: 100, height: 42 });
    mockGetBoundingClientRect.mockReturnValueOnce({ width: 200, height: 42 });
    mockGetBoundingClientRect.mockReturnValueOnce({ width: 300, height: 42 });

    mockGetBoundingClientRect.mockReturnValueOnce({ width: 200, height: 42 });

    const { onColumnResize, getByTestId } = setup({
      items,
      columns,
      visibleColumnKeys,
      columnCustomSizes: { id: 100, task: 200, emoji: 300 },
      hasNextPage: false,
    });

    const dragHandle = await findByTestId(
      getByTestId('task-column-heading'),
      'column-resize-handle',
    );
    await dragAndDrop(dragHandle, dragHandle, -195);

    expect(onColumnResize).toHaveBeenCalledWith('task', COLUMN_MIN_WIDTH);
  });

  it('should have correct column order after a drag and drop reorder', async () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    const { onVisibleColumnKeysChange, getByTestId } = setup({
      items,
      columns,
      visibleColumnKeys,
      hasNextPage: false,
    });

    const dragHandle = screen.getByTestId('id-column-heading');
    const dropTarget = await findByTestId(
      getByTestId('emoji-column-heading'),
      'column-drop-target',
    );
    expect(dropTarget).toBeDefined();

    await dragAndDrop(dragHandle, dropTarget);
    expect(onVisibleColumnKeysChange).toBeCalledTimes(1);
    expect(onVisibleColumnKeysChange).toBeCalledWith(['task', 'id', 'emoji']);
  });

  it('should have correct order of columns inside picker', async () => {
    const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();

    const { getByTestId, openColumnPicker } = setup({
      items,
      columns,
      visibleColumnKeys,
      hasNextPage: false,
    });

    const dragHandle = screen.getByTestId('id-column-heading');
    const dropTarget = await findByTestId(
      getByTestId('emoji-column-heading'),
      'column-drop-target',
    );
    expect(dropTarget).toBeDefined();

    await dragAndDrop(dragHandle, dropTarget);

    const { allOptions } = await openColumnPicker();

    const pickerOptionTitles = Array.from(allOptions).map(
      el => (el as HTMLElement).innerText,
    );
    expect(pickerOptionTitles).toEqual(['task', 'id', 'emoji']);
  });

  it('should not be able to drag and drop between tables', async () => {
    const {
      onColumnsChange: onColumnsChange1,
      columns: columns1,
      onNextPage: onNextPage1,
      items: items1,
      visibleColumnKeys,
    } = makeDragAndDropTableProps();
    const {
      onColumnsChange: onColumnsChange2,
      columns: columns2,
      onNextPage: onNextPage2,
      items: items2,
    } = makeDragAndDropTableProps();

    const { getByTestId } = render(
      <IntlProvider locale="en">
        <div>
          <IssueLikeDataTableView
            testId="sometable1"
            status={'resolved'}
            items={items1}
            onNextPage={onNextPage1}
            onLoadDatasourceDetails={mockCallBackFn}
            hasNextPage={false}
            columns={columns1}
            visibleColumnKeys={visibleColumnKeys}
            onVisibleColumnKeysChange={onColumnsChange1}
          />
          <IssueLikeDataTableView
            testId="sometable2"
            status={'resolved'}
            items={items2}
            onNextPage={onNextPage2}
            onLoadDatasourceDetails={mockCallBackFn}
            hasNextPage={false}
            columns={columns2}
            visibleColumnKeys={visibleColumnKeys}
            onVisibleColumnKeysChange={onColumnsChange2}
          />
        </div>
      </IntlProvider>,
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

  describe('drag and drop features should not be shown', () => {
    it('should not show when onColumnsChange is not provided', async () => {
      const { columns, items, visibleColumnKeys } = makeDragAndDropTableProps();
      const { queryByTestId, queryByLabelText } = setup({
        items,
        columns,
        visibleColumnKeys,
        hasNextPage: false,
        onVisibleColumnKeysChange: undefined,
      });

      expect(queryByLabelText('emoji-drag-icon')).toBeNull();
      expect(queryByTestId('column-drop-target')).toBeNull();
    });

    it('should not show when table is loading', async () => {
      const { columns, visibleColumnKeys } = makeDragAndDropTableProps();
      const { queryByTestId, queryByLabelText } = setup({
        items: [],
        columns,
        status: 'loading',
        visibleColumnKeys,
      });

      expect(queryByLabelText('emoji-drag-icon')).toBeNull();
      expect(queryByTestId('column-drop-target')).toBeNull();
    });

    it('should have column titles in table header', async () => {
      await assertColumnTitles(undefined);
    });
  });

  describe('when custom column size is not defined, and default widths are applied', () => {
    const prepColumns = (): {
      [key: string]: DatasourceResponseSchemaProperty;
    } => ({
      summary: {
        key: 'summary',
        title: 'Summary',
        type: 'string',
        isList: true,
      },
      key: {
        key: 'key',
        title: 'Key',
        type: 'string',
        isList: true,
      },
      name: {
        key: 'name',
        title: 'Name',
        type: 'string',
        isList: true,
      },
      dob: {
        key: 'dob',
        title: 'DoB',
        type: 'date',
        isList: true,
      },
      hobby: {
        key: 'hobby',
        title: 'Hobby',
        type: 'tag',
        isList: true,
      },
      status: {
        key: 'status',
        title: 'Status',
        type: 'status',
      },
    });

    it('should render the header and cells with width from the configured fields', () => {
      const items: DatasourceDataResponseItem[] = [
        { summary: { data: 'summary' }, status: { data: { text: 'done' } } },
      ];
      const columns = prepColumns();

      const { queryByTestId, queryAllByTestId } = setup({
        items,
        columns: [columns.summary, columns.status],
        visibleColumnKeys: ['summary', 'status'],
        hasNextPage: false,
        onColumnResize: undefined,
        onVisibleColumnKeysChange: undefined,
      });

      expect(queryByTestId('summary-column-heading')).toHaveStyle({
        maxWidth: '360px',
      });
      expect(queryAllByTestId('sometable--cell-0')[0]).toHaveStyle(
        'max-width: 360px',
      );

      expect(queryByTestId('status-column-heading')).toHaveStyle({
        maxWidth: `${8 * 18}px`,
      });
    });

    it('should render the header and cells with width from the configured types', () => {
      const items: DatasourceDataResponseItem[] = [
        { name: { data: 'key1' }, dob: { data: '12/12/2023' } },
      ];
      const columns = prepColumns();

      const { queryByTestId } = setup({
        items,
        columns: [columns.name, columns.dob],
        visibleColumnKeys: ['name', 'dob'],
        hasNextPage: false,
        onColumnResize: undefined,
        onVisibleColumnKeysChange: undefined,
      });

      expect(queryByTestId('name-column-heading')).toHaveStyle({
        maxWidth: '176px',
      });

      expect(queryByTestId('dob-column-heading')).toHaveStyle({
        maxWidth: '112px',
      });
    });

    it('should render the header and cells with given column width in draggable mode', () => {
      const items: DatasourceDataResponseItem[] = [
        { name: { data: 'key1' }, dob: { data: '12/12/2023' } },
      ];
      const columns = prepColumns();

      const { queryByTestId, queryAllByTestId } = setup({
        items,
        columns: [columns.name, columns.dob],
        columnCustomSizes: { name: 100, dob: 200 },
        visibleColumnKeys: ['name', 'dob'],
        hasNextPage: false,
      });

      expect(queryByTestId('name-column-heading')).toHaveStyle({
        width: '100px',
      });
      expect(queryAllByTestId('sometable--cell-0')[0]).toHaveStyle(
        'width: 100px',
      );

      expect(queryByTestId('dob-column-heading')).toHaveStyle({
        width: '200px',
      });
    });

    it('should render the header and cells with given column width in static mode', () => {
      const items: DatasourceDataResponseItem[] = [
        { name: { data: 'key1' }, dob: { data: '12/12/2023' } },
      ];
      const columns = prepColumns();

      const { queryByTestId } = setup({
        items,
        columns: [columns.name, columns.dob],
        columnCustomSizes: { name: 100, dob: 200 },
        visibleColumnKeys: ['name', 'dob'],
        hasNextPage: false,
        onVisibleColumnKeysChange: undefined,
      });

      expect(queryByTestId('name-column-heading')).toHaveStyle({
        width: '100px',
      });

      expect(queryByTestId('dob-column-heading')).toHaveStyle({
        width: '200px',
      });
    });

    it('should render the header and cells with width in draggable mode', () => {
      const items: DatasourceDataResponseItem[] = [
        { summary: { data: 'summary' }, status: { data: { text: 'done' } } },
      ];
      const columns = prepColumns();
      const { queryByTestId } = setup({
        items,
        columns: [columns.summary, columns.status],
        visibleColumnKeys: ['summary', 'status'],
        hasNextPage: false,
      });

      expect(queryByTestId('summary-column-heading')).toHaveStyle({
        width: '360px',
      });

      expect(queryByTestId('status-column-heading')).toHaveStyle({
        width: `${8 * 18}px`,
      });
    });

    it('should render the header and cells with truncate css properties', () => {
      const items: DatasourceDataResponseItem[] = [
        {
          summary: {
            data: 'summary',
          },
          key: { data: 'KEY-123' },
        },
      ];
      const columns = prepColumns();
      const { queryByTestId } = setup({
        items,
        columns: [columns.summary, columns.key],
        visibleColumnKeys: ['summary', 'key'],
        hasNextPage: false,
      });

      const tableCell = queryByTestId('sometable--cell-0');
      const styles = getComputedStyle(tableCell!);
      expect(styles.textOverflow).toBe('ellipsis');
    });
  });
});

describe('UFO metrics: IssueLikeDataTableView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TableRendered', async () => {
    it('should mark Ufo experience as successful when data is loaded', async () => {
      const items: DatasourceDataResponseItem[] = [
        { id: { data: 'id1' } },
        {
          id: {
            data: 'id2',
          },
        },
        {
          id: {
            data: 'id3',
          },
        },
      ];

      const columns: DatasourceResponseSchemaProperty[] = [
        {
          key: 'id',
          title: 'ID',
          type: 'string',
        },
      ];

      setup({
        items,
        columns,
        parentContainerRenderInstanceId: '123',
      });

      expect(mockTableRenderUfoSuccess).toHaveBeenCalled();
    });

    it('should not mark Ufo experience as successful when data is loading', async () => {
      setup({
        status: 'loading',
        parentContainerRenderInstanceId: '123',
      });

      expect(mockTableRenderUfoSuccess).not.toHaveBeenCalled();
    });

    it('should not mark Ufo experience as successful when data is resolved but no parent instance id is passed', async () => {
      expect(mockTableRenderUfoSuccess).not.toHaveBeenCalled();
    });
  });

  describe('ColumnPickerRendered', async () => {
    it('should mark Ufo experience as started when column picker is opened', async () => {
      const items: DatasourceDataResponseItem[] = [
        { id: { data: 'id1' } },
        {
          id: {
            data: 'id2',
          },
        },
        {
          id: {
            data: 'id3',
          },
        },
      ];

      const columns: DatasourceResponseSchemaProperty[] = [
        {
          key: 'id',
          title: 'ID',
          type: 'string',
        },
      ];

      jest.useFakeTimers();

      const { getByTestId } = setup({
        items,
        columns,
        parentContainerRenderInstanceId: 'abc',
      });

      const triggerButton = getByTestId('column-picker-trigger-button');
      invariant(triggerButton);

      // open popup
      fireEvent.click(triggerButton);

      expect(mockColumnPickerUfoStart).toHaveBeenCalledTimes(1);
      expect(mockColumnPickerUfoAddMetadata).toHaveBeenCalledTimes(1);
    });
  });
});
