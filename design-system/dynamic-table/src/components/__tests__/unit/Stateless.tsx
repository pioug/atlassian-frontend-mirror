import React from 'react';

import { mount, shallow, ShallowWrapper } from 'enzyme';

import { StatelessProps } from '../../../types';
import DynamicTableWithAnalytics, {
  DynamicTableWithoutAnalytics as StatelessDynamicTable,
} from '../../Stateless';
import TableHead from '../../TableHead';

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

test('totalRows should not be considered if less than number of rows passed', () => {
  const props = createProps();
  const wrapper = shallow(
    <StatelessDynamicTable {...props} totalRows={2} rowsPerPage={4} />,
  );

  /**
   * 4 rows of data are present
   * total number of records indicated to be 2, less than number of rows
   * Should create 1 page and ignore totalRows
   */
  const paginatorTotalPages = wrapper.find('ManagedPagination').prop('total');
  expect(paginatorTotalPages).toBe(1);
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
