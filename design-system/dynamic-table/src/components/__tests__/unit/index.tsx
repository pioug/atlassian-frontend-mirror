import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import Pagination from '../../managedPagination';
import TableHead from '../../TableHead';
import {
  EmptyViewContainer,
  EmptyViewWithFixedHeight,
} from '../../../styled/EmptyBody';
import Body from '../../Body';
import RankableTableBody from '../../rankable/Body';
import LoadingContainer from '../../LoadingContainer';
import LoadingContainerAdvanced from '../../LoadingContainerAdvanced';
import { Caption } from '../../../styled/DynamicTable';
import DynamicTable, { DynamicTableStateless } from '../../..';
import { rows, head, rowsWithKeys } from './_data';
import { headNumeric, rowsNumeric } from './_dataNumeric';

import { name } from '../../../version.json';
import { RowType, RowCellType, StatelessProps } from '../../../types';
import { State } from '../../Stateless';

describe(name, () => {
  describe('stateless', () => {
    it('should render TableHead when items length is 0 and not render EmptyViewContainer if emptyView prop is ommitted', () => {
      const wrapper = mount(<DynamicTableStateless head={head} />);
      const header = wrapper.find(TableHead);
      const emptyView = wrapper.find(EmptyViewContainer);
      const body = wrapper.find(Body);
      expect(header.length).toBe(1);
      expect(emptyView.length).toBe(0);
      expect(body.length).toBe(0);
    });
    it('should not render any text in the table when rows prop is an empty array', () => {
      const wrapper = mount(<DynamicTableStateless rows={[]} head={head} />);
      const header = wrapper.find(TableHead);
      const table = wrapper.find('table');
      expect(table.children()).toHaveLength(1);
      expect(header.length).toBe(1);
    });
    it('should render TableHead when items length is 0 and render EmptyViewContainer if emptyView prop is provided', () => {
      const wrapper = mount(
        <DynamicTableStateless
          head={head}
          emptyView={<h2>No items present in table</h2>}
        />,
      );
      const header = wrapper.find(TableHead);
      const emptyView = wrapper.find(EmptyViewContainer);
      const body = wrapper.find(Body);
      expect(header.length).toBe(1);
      expect(emptyView.length).toBe(1);
      expect(body.length).toBe(0);
    });
    it('should not render TableHead if head prop is not provided and should render EmptyViewContainer if emptyView prop is provided', () => {
      const wrapper = mount(
        <DynamicTableStateless
          emptyView={<h2>No items present in table</h2>}
        />,
      );
      const header = wrapper.find(TableHead);
      const emptyView = wrapper.find(EmptyViewContainer);
      const body = wrapper.find(Body);
      expect(header.length).toBe(0);
      expect(body.length).toBe(0);
      expect(emptyView.length).toBe(1);
    });

    it('should render head, emptyView and caption if provided', () => {
      const wrapper = mount(
        <DynamicTableStateless
          head={head}
          emptyView={<h2>No items present in table</h2>}
          caption={<h2>This is a table caption</h2>}
        />,
      );
      const header = wrapper.find(TableHead);
      const emptyView = wrapper.find(EmptyViewContainer);
      const caption = wrapper.find(Caption);
      const body = wrapper.find(Body);
      expect(header.length).toBe(1);
      expect(emptyView.length).toBe(1);
      expect(caption.length).toBe(1);
      expect(body.length).toBe(0);
    });

    it('should render RankableTableBody if table is rankable', () => {
      const wrapper = mount(
        <DynamicTableStateless
          rowsPerPage={2}
          page={2}
          head={head}
          rows={rowsWithKeys}
          isRankable
        />,
      );

      const body = wrapper.find(Body);
      const rankableBody = wrapper.find(RankableTableBody);
      expect(body.length).toBe(0);
      expect(rankableBody.length).toBe(1);
    });

    it('should display paginated data', () => {
      const wrapper = mount(
        <DynamicTableStateless
          rowsPerPage={2}
          page={2}
          head={head}
          rows={rows}
        />,
      );
      const bodyRows = wrapper.find('tbody tr');
      expect(bodyRows.length).toBe(2);
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(0)
          .text(),
      ).toBe('Donald');
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(1)
          .text(),
      ).toBe('Trump');
    });

    const checkSortedData = (isRankable: boolean) => {
      const headCells = head.cells.map(cell => ({
        ...cell,
        isSortable: true,
      }));
      const wrapper = mount(
        <DynamicTableStateless
          sortKey="first_name"
          sortOrder="ASC"
          head={{ cells: headCells }}
          rows={rowsWithKeys}
          isRankable={isRankable}
        />,
      );
      const bodyRows = wrapper.find('tbody tr');
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(0)
          .text(),
      ).toBe('Barack');
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(1)
          .text(),
      ).toBe('Obama');
      expect(
        bodyRows
          .at(1)
          .find('td')
          .at(0)
          .text(),
      ).toBe('Donald');
      expect(
        bodyRows
          .at(1)
          .find('td')
          .at(1)
          .text(),
      ).toBe('Trump');
      expect(
        bodyRows
          .at(2)
          .find('td')
          .at(0)
          .text(),
      ).toBe('hillary');
      expect(
        bodyRows
          .at(2)
          .find('td')
          .at(1)
          .text(),
      ).toBe('clinton');
    };

    it('should display sorted data', () => {
      checkSortedData(false);
    });

    it('should display sorted data in rankable table', () => {
      checkSortedData(true);
    });

    it('should pass down extra props', () => {
      const theadOnClick = () => {};
      const theadOnKeyDown = () => {};
      const thOnClick = () => {};
      const thOnKeyDown = () => {};
      const trOnClick = () => {};
      const tdOnClick = () => {};

      const newHead = {
        onClick: theadOnClick,
        onKeyDown: theadOnKeyDown,
        cells: head.cells.map(cell => ({
          ...cell,
          onClick: thOnClick,
          onKeyDown: thOnKeyDown,
        })),
      };
      const newRows = rows.map((row: RowType) => ({
        ...row,
        onClick: trOnClick,
        cells: row.cells.map((cell: RowCellType) => ({
          ...cell,
          onClick: tdOnClick,
        })),
      }));

      const wrapper = mount(
        <DynamicTableStateless head={newHead} rows={newRows} />,
      );
      expect(wrapper.find('thead').prop('onClick')).toBe(theadOnClick);
      expect(wrapper.find('thead').prop('onKeyDown')).toBe(theadOnKeyDown);
      wrapper.find('th').forEach(headCell => {
        expect(headCell.prop('onClick')).toBe(thOnClick);
      });
      wrapper.find('th').forEach(headCell => {
        expect(headCell.prop('onKeyDown')).toBe(thOnKeyDown);
      });
      wrapper.find('tbody tr').forEach(bodyRow => {
        expect(bodyRow.prop('onClick')).toBe(trOnClick);
      });
      wrapper.find('td').forEach(bodyCell => {
        expect(bodyCell.prop('onClick')).toBe(tdOnClick);
      });
    });

    describe('loading mode', () => {
      describe('with rows', () => {
        let wrapper: ReactWrapper<
          StatelessProps,
          State,
          React.Component<StatelessProps>
        >;

        beforeEach(() => {
          wrapper = mount(<DynamicTableStateless rows={rows} isLoading />);
        });

        it('should render a loading container with a large spinner when there is more than 2 rows', () => {
          const lc = () => wrapper.find(LoadingContainerAdvanced).props();
          expect(lc().spinnerSize).toBe('large');

          wrapper.setProps({ rows: rows.slice(-3) });
          wrapper.update();
          expect(lc().spinnerSize).toBe('large');

          wrapper.setProps({ rows: rows.slice(-2) });
          wrapper.update();
          expect(lc().spinnerSize).toBe('small');
        });

        it('should render a loading container with a proper loading flag', () => {
          const loadingContainer = wrapper.find(LoadingContainerAdvanced);
          expect(loadingContainer.props().isLoading).toBe(true);
        });

        it('should override the spinner size on demand', () => {
          const withOverriddenSpinnerSize = mount(
            <DynamicTableStateless
              rows={rows}
              loadingSpinnerSize="small"
              isLoading
            />,
          );
          const loadingContainer = withOverriddenSpinnerSize.find(
            LoadingContainerAdvanced,
          );
          expect(loadingContainer.props().spinnerSize).toBe('small');
        });

        it('should pass a proper target ref', () => {
          const loadingContainer = wrapper.find(LoadingContainerAdvanced);
          const body = wrapper.find(Body);
          const target = loadingContainer.prop('targetRef')!();
          expect(target).toBe(body.instance());
        });

        it('should not render a loading container for the empty view', () => {
          const loadingContainer = wrapper.find(LoadingContainer);
          expect(loadingContainer.length).toBe(0);
        });
      });

      describe('without rows (empty)', () => {
        let wrapper: ReactWrapper<
          StatelessProps,
          State,
          React.Component<StatelessProps>
        >;

        beforeEach(() => {
          wrapper = mount(
            <DynamicTableStateless emptyView={<div>No rows</div>} isLoading />,
          );
        });

        it('should render a blank view of a fixed height when the empty view is defined', () => {
          const blankView = wrapper.find(EmptyViewWithFixedHeight);
          expect(blankView.length).toBe(1);
        });

        it('should render a blank view of a fixed height when the empty view is not defined', () => {
          const withoutEmptyView = mount(<DynamicTableStateless isLoading />);
          const blankView = withoutEmptyView.find(EmptyViewWithFixedHeight);
          expect(blankView.length).toBe(1);
        });

        it('should render a loading container with proper props', () => {
          const loadingContainer = wrapper.find(LoadingContainer);
          expect(loadingContainer.props().isLoading).toBe(true);
          expect(loadingContainer.props().spinnerSize).toBe('large');
        });

        it("should keep the loading mode of the table's loading container disabled", () => {
          const loadingContainer = wrapper.find(LoadingContainerAdvanced);
          expect(loadingContainer.props().isLoading).toBe(false);
        });
      });
    });

    describe('should invoke callbacks', () => {
      let onSetPage: jest.Mock;
      let onSort: jest.Mock;
      let wrapper: ReactWrapper<
        StatelessProps,
        State,
        React.Component<StatelessProps>
      >;

      beforeEach(() => {
        onSetPage = jest.fn();
        onSort = jest.fn();
        wrapper = mount(
          <DynamicTableStateless
            rowsPerPage={2}
            page={2}
            head={head}
            rows={rows}
            onSetPage={onSetPage}
            onSort={onSort}
          />,
        );
      });

      it('should not run onSort for a non-sortable column', () => {
        const headCells = wrapper.find('th');
        headCells.at(0).simulate('click');
        expect(onSort).toHaveBeenCalledTimes(1);
        headCells.at(1).simulate('click');
        expect(onSort).toHaveBeenCalledTimes(1);
        expect(onSetPage).toHaveBeenCalledWith(1, undefined);
      });

      it('should run onSort & onSetPage', () => {
        const headCells = wrapper.find('th');
        headCells.at(0).simulate('click');
        expect(onSort).toHaveBeenCalledTimes(1);
        expect(onSort).toHaveBeenCalledWith(
          {
            key: 'first_name',
            sortOrder: 'ASC',
            item: {
              key: 'first_name',
              content: 'First name',
              isSortable: true,
            },
          },
          expect.anything(),
        );
        expect(onSetPage).toHaveBeenCalledWith(1, undefined);
        expect(onSetPage).toHaveBeenCalledTimes(1);
      });

      it('should run onSort with enter key pressed & onSetPage', () => {
        const headCells = wrapper.find('th');
        headCells.at(0).simulate('keyDown', { key: 'Enter' });
        expect(onSort).toHaveBeenCalledTimes(1);
        expect(onSort).toHaveBeenCalledWith(
          {
            key: 'first_name',
            sortOrder: 'ASC',
            item: {
              key: 'first_name',
              content: 'First name',
              isSortable: true,
            },
          },
          expect.anything(),
        );
        expect(onSetPage).toHaveBeenCalledWith(1, undefined);
        expect(onSetPage).toHaveBeenCalledTimes(1);
      });

      it('should not run onSort with enter key pressed when th is not sortable', () => {
        const headCells = wrapper.find('th');
        headCells.at(1).simulate('keyDown', { key: 'Enter' });
        expect(onSort).toHaveBeenCalledTimes(0);
      });

      it('onSetPage', () => {
        wrapper
          .find(Pagination)
          .find('button')
          .at(1)
          .simulate('click');
        expect(onSetPage).toHaveBeenCalledTimes(1);
        expect(onSetPage).toHaveBeenCalledWith(1, expect.any(UIAnalyticsEvent));
      });
    });
  });

  describe('stateful', () => {
    it('should display paginated data after navigating to a different page', () => {
      const wrapper = mount(
        <DynamicTable
          rowsPerPage={2}
          defaultPage={2}
          head={head}
          rows={rows}
        />,
      );

      wrapper
        .find(Pagination)
        .find('button')
        .at(0)
        .simulate('click');

      const bodyRows = wrapper.find('tbody tr');
      expect(bodyRows.length).toBe(2);
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(0)
          .text(),
      ).toBe('Barack');
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(1)
          .text(),
      ).toBe('Obama');
      expect(
        bodyRows
          .at(1)
          .find('td')
          .at(0)
          .text(),
      ).toBe('hillary');
      expect(
        bodyRows
          .at(1)
          .find('td')
          .at(1)
          .text(),
      ).toBe('clinton');
    });

    it('should pass i18n info down correctly', () => {
      const wrapper = mount(
        <DynamicTable
          rowsPerPage={2}
          defaultPage={2}
          head={head}
          rows={rows}
          paginationi18n={{ prev: 'Before', next: 'after' }}
        />,
      );

      expect(wrapper.find(Pagination).prop('i18n')).toMatchObject({
        prev: 'Before',
        next: 'after',
      });
    });

    it('should pass i18n info down correctly to stateless component', () => {
      const wrapper = mount(
        <DynamicTableStateless
          rowsPerPage={2}
          defaultPage={2}
          head={head}
          rows={rows}
          paginationi18n={{ prev: 'Before', next: 'after' }}
        />,
      );

      expect(wrapper.find(Pagination).prop('i18n')).toMatchObject({
        prev: 'Before',
        next: 'after',
      });
    });

    it('should sort data', () => {
      const wrapper = mount(<DynamicTable head={head} rows={rows} />);
      wrapper
        .find('th')
        .at(0)
        .simulate('click');
      wrapper.update();
      const bodyRows = wrapper.find('tbody tr');
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(0)
          .text(),
      ).toBe('Barack');
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(1)
          .text(),
      ).toBe('Obama');
      expect(
        bodyRows
          .at(1)
          .find('td')
          .at(0)
          .text(),
      ).toBe('Donald');
      expect(
        bodyRows
          .at(1)
          .find('td')
          .at(1)
          .text(),
      ).toBe('Trump');
      expect(
        bodyRows
          .at(2)
          .find('td')
          .at(0)
          .text(),
      ).toBe('hillary');
      expect(
        bodyRows
          .at(2)
          .find('td')
          .at(1)
          .text(),
      ).toBe('clinton');
    });

    it('should sort numeric data correctly, listed before strings or empty values', () => {
      const wrapper = mount(
        <DynamicTable head={headNumeric} rows={rowsNumeric} />,
      );
      wrapper
        .find('th')
        .at(1)
        .simulate('click');
      wrapper.update();

      const bodyRows = wrapper.find('tbody tr');

      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(0)
          .text(),
      ).toBe('Negative One');
      expect(
        bodyRows
          .at(0)
          .find('td')
          .at(1)
          .text(),
      ).toBe('-1');
      expect(
        bodyRows
          .at(1)
          .find('td')
          .at(1)
          .text(),
      ).toBe('0');
      expect(
        bodyRows
          .at(2)
          .find('td')
          .at(1)
          .text(),
      ).toBe('1');
      expect(
        bodyRows
          .at(3)
          .find('td')
          .at(1)
          .text(),
      ).toBe('');
      expect(
        bodyRows
          .at(4)
          .find('td')
          .at(1)
          .text(),
      ).toBe(' ');
      expect(
        bodyRows
          .at(5)
          .find('td')
          .at(1)
          .text(),
      ).toBe('1');
      expect(
        bodyRows
          .at(8)
          .find('td')
          .at(1)
          .text(),
      ).toBe('a string');
    });

    it('should sort grouped numbers in strings', () => {
      const wrapper = mount(
        <DynamicTable head={headNumeric} rows={rowsNumeric} />,
      );
      wrapper
        .find('th')
        .at(1)
        .simulate('click');
      wrapper.update();
      const bodyRows = wrapper.find('tbody tr');

      expect(
        bodyRows
          .at(5)
          .find('td')
          .at(1)
          .text(),
      ).toBe('1');
      expect(
        bodyRows
          .at(6)
          .find('td')
          .at(1)
          .text(),
      ).toBe('5');
      expect(
        bodyRows
          .at(7)
          .find('td')
          .at(1)
          .text(),
      ).toBe('10');
    });
  });
});

test('should pass analytics event in setPage callback', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <DynamicTable head={head} rows={rows} rowsPerPage={1} onSetPage={spy} />,
  );
  wrapper
    .find(Pagination)
    .find(Button)
    .last()
    .simulate('click');
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(
    expect.any(Number),
    expect.any(UIAnalyticsEvent),
  );
});
