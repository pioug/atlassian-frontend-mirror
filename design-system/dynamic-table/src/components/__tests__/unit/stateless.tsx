import React from 'react';

import { render } from '@testing-library/react';
import { mount, shallow, ShallowWrapper } from 'enzyme';

import { StatelessProps } from '../../../types';
import DynamicTableWithAnalytics, {
  DynamicTableWithoutAnalytics as StatelessDynamicTable,
} from '../../stateless';
import TableHead from '../../table-head';

import { head, rowsWithKeys, secondSortKey, sortKey } from './_data';

const simulateOnSort = (wrapper: ShallowWrapper<StatelessProps>) => {
  const tableHead = wrapper.find(TableHead);
  const item = { key: sortKey };
  tableHead.prop('onSort')(item)();
  return item;
};

const createProps: () => StatelessProps = () => ({
  head,
  rows: rowsWithKeys,
  sortKey,
  sortOrder: 'ASC',
  onSort: jest.fn(),
  onPageRowsUpdate: jest.fn(),
});

test('onSort should change to ASC from DESC if table is not rankable', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} sortOrder="DESC" />,
  );

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'ASC',
  });
});

test('onSort should change to none if table is rankable and sort order was DESC', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} sortOrder="DESC" isRankable />,
  );

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: null,
    item,
    sortOrder: null,
  });
});

test('onSort should change to DESC if table is rankable and sort order was ASC', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} sortOrder="ASC" isRankable />,
  );

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'DESC',
  });
});

test('onSort should change to ASC if table is rankable and was sorted using on different row', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable
      {...props}
      sortOrder="DESC"
      sortKey={secondSortKey}
      isRankable
    />,
  );

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'ASC',
  });
});

test('onPageRowsUpdate should be called on mount and on sorting change', () => {
  const props = createProps();
  const wrapper = mount(<StatelessDynamicTable {...props} />);

  expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(1);
  wrapper.setProps({ sortOrder: 'DESC' });
  expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(2);
});
// TODO: fix Matcher error: received value must be a mock or spy function
test.skip('Mount should throw errors if the sortKey is invalid', () => {
  const props = { ...createProps(), sortKey: 'InvalidSortKey' };
  mount(<StatelessDynamicTable {...props} />);

  /* eslint-disable no-console */
  expect(console.error).toHaveBeenCalled();
  expect(console.error).toBeCalledWith(
    Error(`Cell with InvalidSortKey key not found in head.`),
  );
  /* eslint-enable no-console */
});

test('totalRows dictate number of pages in pagination', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} totalRows={6} rowsPerPage={4} />,
  );

  /**
   * 4 rows of data are present
   * total number of records indicated to be 6
   * Should create 2 pages
   */
  const paginatorTotalPages = wrapper.find('ManagedPagination').prop('total');
  expect(paginatorTotalPages).toBe(2);
});

test('pagination should not show if only one page', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} totalRows={6} rowsPerPage={10} />,
  );
  expect(wrapper.find('ManagedPagination')).toHaveLength(0);
});

test('pagination should move to first page when total number of pages is 1', () => {
  const props = createProps();
  const { rerender, getAllByTestId, getByText } = render(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={3}
      page={2}
      testId="myTable"
    />,
  );

  expect(getByText('Thomas')).toBeTruthy(); // only showing 4th one
  expect(getAllByTestId(/^myTable--row-*/)).toHaveLength(1);

  rerender(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={4}
      page={2}
      testId="myTable"
    />,
  );

  expect(getByText('hillary')).toBeTruthy();
  expect(getAllByTestId(/^myTable--row-*/)).toHaveLength(4); // but we're back on page 1, showing all rows
});

test('pagination should move to last page when selected page is greater than total pages', () => {
  const props = createProps();
  const { rerender, getAllByTestId, getByText } = render(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={1}
      page={4}
      testId="myTable"
    />,
  );

  expect(getByText('Thomas')).toBeTruthy(); // only show 4th one
  expect(getAllByTestId(/^myTable--row-*/)).toHaveLength(1);

  rerender(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={3}
      page={4}
      testId="myTable"
    />,
  );

  expect(getByText('Thomas')).toBeTruthy(); // only show 4th one
  expect(getAllByTestId(/^myTable--row-*/)).toHaveLength(1); // we're on the 2nd page
});

test('totalRows should prevent WithSortedPageRows from sorting and slicing', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} totalRows={20} rowsPerPage={4} />,
  );
  const tableBody = wrapper.find('WithSortedPageRows');
  expect(tableBody.prop('isTotalPagesControlledExternally')).toBe(true);
});

test('should work without totalRows being explicitly defined', () => {
  const props = createProps();
  const wrapper = shallow(<StatelessDynamicTable {...props} rowsPerPage={3} />);

  const paginatorTotalPages = wrapper.find('ManagedPagination').prop('total');
  expect(paginatorTotalPages).toBe(2);
});

test('totalRows if not present should allow WithSortedPageRows do slicing and sorting as needed', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} rowsPerPage={30} />,
  );
  const tableBody = wrapper.find('WithSortedPageRows');
  expect(tableBody.prop('isTotalPagesControlledExternally')).toBe(false);
});

describe('DynamicTableWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn');
    jest.spyOn(console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('DynamicTableWithoutAnalytics', () => {
    it('onSort should change to ASC from DESC if table is not rankable', () => {
      const props = createProps();
      const wrapper = shallow(
        <StatelessDynamicTable {...props} sortOrder="DESC" />,
      );

      const item = simulateOnSort(wrapper);
      expect(props.onSort).toHaveBeenCalledTimes(1);
      expect(props.onSort).toHaveBeenLastCalledWith({
        key: sortKey,
        item,
        sortOrder: 'ASC',
      });
    });

    it('onSort should change to none if table is rankable and sort order was DESC', () => {
      const props = createProps();
      const wrapper = shallow(
        <StatelessDynamicTable {...props} sortOrder="DESC" isRankable />,
      );

      const item = simulateOnSort(wrapper);
      expect(props.onSort).toHaveBeenCalledTimes(1);
      expect(props.onSort).toHaveBeenLastCalledWith({
        key: null,
        item,
        sortOrder: null,
      });
    });

    it('onSort should change to DESC if table is rankable and sort order was ASC', () => {
      const props = createProps();
      const wrapper = shallow(
        <StatelessDynamicTable {...props} sortOrder="ASC" isRankable />,
      );

      const item = simulateOnSort(wrapper);
      expect(props.onSort).toHaveBeenCalledTimes(1);
      expect(props.onSort).toHaveBeenLastCalledWith({
        key: sortKey,
        item,
        sortOrder: 'DESC',
      });
    });

    it('onSort should change to ASC if table is rankable and was sorted using on different row', () => {
      const props = createProps();
      const wrapper = shallow(
        <StatelessDynamicTable
          {...props}
          sortOrder="DESC"
          sortKey={secondSortKey}
          isRankable
        />,
      );

      const item = simulateOnSort(wrapper);
      expect(props.onSort).toHaveBeenCalledTimes(1);
      expect(props.onSort).toHaveBeenLastCalledWith({
        key: sortKey,
        item,
        sortOrder: 'ASC',
      });
    });

    it('onPageRowsUpdate should be called on mount and on sorting change', () => {
      const props = createProps();
      const wrapper = mount(<StatelessDynamicTable {...props} />);

      expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(1);
      wrapper.setProps({ sortOrder: 'DESC' });
      expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(2);
    });

    it('Mount should throw errors if the sortKey is invalid', () => {
      const props = { ...createProps(), sortKey: 'InvalidSortKey' };
      mount(<StatelessDynamicTable {...props} />);

      /* eslint-disable no-console */
      expect(console.error).toHaveBeenCalled();
      expect(console.error).toBeCalledWith(
        Error(`Cell with InvalidSortKey key not found in head.`),
      );
      /* eslint-enable no-console */
    });
  });

  describe('DynamicTableWithAnalytics', () => {
    it('should mount without errors', () => {
      mount(<DynamicTableWithAnalytics {...createProps()} />);
      /* eslint-disable no-console */
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      /* eslint-enable no-console */
    });
  });
});
