import React from 'react';
import {
  TableHeader,
  withSortableColumn,
  CellWithSortingProps,
} from '../../../../react/nodes/tableCell';
import { MODE, PLATFORM } from '../../../../analytics/events';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '../../../../analytics/enums';
import { RendererCssClassName } from '../../../../consts';
import { SortOrder } from '@atlaskit/editor-common/types';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';

const MOCK_SORTING_ICON_ID = 'mock-sort-icon';

jest.mock('../../../../ui/SortingIcon', () => ({
  __esModule: true,
  default: (props: any) => <div id={MOCK_SORTING_ICON_ID} {...props} />,
}));

describe('Renderer - React/Nodes/TableHeader', () => {
  const baseProps = {
    colspan: 6,
    rowspan: 3,
    background: '#fab',
    colwidth: [10],
  };

  describe('withCellProps', () => {
    it('should create a <th>-tag', () => {
      const intlTableHeader = mountWithIntl(<TableHeader />);
      const tableHeader = intlTableHeader.find('th');
      expect(tableHeader.length).toEqual(1);
    });

    it('should render the <th> props', () => {
      const intlTableHeader = mountWithIntl(<TableHeader {...baseProps} />);
      const tableHeader = intlTableHeader.find('th');
      expect(tableHeader.length).toEqual(1);

      expect(tableHeader.prop('rowSpan')).toEqual(3);
      expect(tableHeader.prop('colSpan')).toEqual(6);
      expect(tableHeader.prop('data-colwidth')).toEqual('10');

      expect(tableHeader.prop('style')).toEqual({
        backgroundColor: '#fab',
      });
    });

    it('should render the colwidths', () => {
      const colwidth = [10, 12, 14];
      const intlTableHeader = mountWithIntl(
        <TableHeader colwidth={colwidth} />,
      );
      const tableRow = intlTableHeader.find('th');

      expect(tableRow.length).toEqual(1);
      expect(tableRow.prop('data-colwidth')).toEqual('10,12,14');
    });
  });

  describe('withSortableColumn', () => {
    let WithSortableColumn: React.ComponentType<
      Omit<CellWithSortingProps, 'intl'>
    >;
    const TestComp = ({ children }: CellWithSortingProps) => (
      <th>{children}</th>
    );

    beforeEach(() => {
      const O = withSortableColumn(TestComp);

      WithSortableColumn = (props) => <O {...props} isHeaderRow />;
    });

    describe('when allowColumnSorting is the default value', () => {
      it('should not add sortable class name', () => {
        const wrapper = mountWithIntl(<WithSortableColumn />);

        expect(
          wrapper
            .find(TestComp)
            .hasClass(RendererCssClassName.SORTABLE_COLUMN_WRAPPER),
        ).toBeFalsy();
      });
    });

    describe('when allowColumnSorting is false', () => {
      it('should not add sortable class name', () => {
        const wrapper = mountWithIntl(
          <WithSortableColumn allowColumnSorting={false} />,
        );

        expect(
          wrapper
            .find(TestComp)
            .hasClass(RendererCssClassName.SORTABLE_COLUMN_WRAPPER),
        ).toBeFalsy();
      });
    });

    describe('when allowColumnSorting is true', () => {
      it('should add sortable class name', () => {
        const wrapper = mountWithIntl(
          <WithSortableColumn allowColumnSorting />,
        );
        expect(
          wrapper
            .find(TestComp)
            .hasClass(RendererCssClassName.SORTABLE_COLUMN_WRAPPER),
        ).toBeTruthy();
      });

      describe('when onSorting function exist', () => {
        let onSorting: any;
        let wrapper: any;
        const mountWrapper = (children?: React.ReactNode) =>
          mountWithIntl(
            <WithSortableColumn
              allowColumnSorting
              columnIndex={0}
              onSorting={onSorting}
            >
              {children}
            </WithSortableColumn>,
          );
        beforeEach(() => {
          onSorting = jest.fn();
        });

        it('should call onSorting when clicking the sort button', () => {
          wrapper = mountWrapper();
          wrapper.find(`[id="${MOCK_SORTING_ICON_ID}"]`).simulate('click');
          expect(onSorting).toHaveBeenCalled();
        });

        it('should not call onSorting when clicking the wrapper', () => {
          wrapper = mountWrapper();
          wrapper
            .find(`.${RendererCssClassName.SORTABLE_COLUMN_WRAPPER}`)
            .simulate('click');
          expect(onSorting).not.toHaveBeenCalled();
        });

        const keys = [' ', 'Enter', 'Spacebar'];

        it.each(keys)(
          'should call onSorting when %s key is pressed and the sort button is the target',
          (key) => {
            wrapper = mountWrapper();
            wrapper
              .find(`[id="${MOCK_SORTING_ICON_ID}"]`)
              .simulate('keydown', { key });
            expect(onSorting).toHaveBeenCalled();
          },
        );

        it.each(keys)(
          'should not call onSorting when %s key is pressed and the wrapper is the target',
          (key) => {
            wrapper = mountWrapper();
            wrapper
              .find(`.${RendererCssClassName.SORTABLE_COLUMN_WRAPPER}`)
              .simulate('keydown', { key });
            expect(onSorting).not.toHaveBeenCalled();
          },
        );
      });

      describe('call onSorting changing the sort order', () => {
        let onSorting: any;
        beforeEach(() => {
          onSorting = jest.fn();
        });

        it.each<{ from?: SortOrder; to: SortOrder }>([
          { from: SortOrder.NO_ORDER, to: SortOrder.ASC },
          { from: SortOrder.ASC, to: SortOrder.DESC },
          { from: SortOrder.DESC, to: SortOrder.NO_ORDER },
          { from: undefined, to: SortOrder.NO_ORDER },
        ])('should change %o ', ({ from, to }) => {
          const wrapper = mountWithIntl(
            <WithSortableColumn
              sortOrdered={from}
              allowColumnSorting
              columnIndex={0}
              onSorting={onSorting}
            />,
          );

          wrapper.find(`[id="${MOCK_SORTING_ICON_ID}"]`).simulate('click');

          expect(onSorting).toBeCalledWith(0, to);
        });
      });
    });
  });

  describe('#fireAnalyticsEvent', () => {
    describe('when onSorting and columnIndex is available', () => {
      it('should call the function with SORT_COLUMN_NOT_ALLOWED', () => {
        const fireAnalyticsEvent = jest.fn();
        const tableCell = mountWithIntl(
          <TableHeader
            fireAnalyticsEvent={fireAnalyticsEvent}
            columnIndex={1}
            allowColumnSorting
            isHeaderRow
          />,
        );

        tableCell.find(`[id="${MOCK_SORTING_ICON_ID}"]`).simulate('click');

        expect(fireAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.SORT_COLUMN_NOT_ALLOWED,
          actionSubject: ACTION_SUBJECT.TABLE,
          attributes: {
            platform: PLATFORM.WEB,
            mode: MODE.RENDERER,
          },
          eventType: EVENT_TYPE.TRACK,
        });
      });
    });

    describe('when onSorting is not available', () => {
      it('should call the function with SORT_COLUMN_NOT_ALLOWED', () => {
        const fireAnalyticsEvent = jest.fn();
        const onSorting = jest.fn();
        const tableCell = mountWithIntl(
          <TableHeader
            fireAnalyticsEvent={fireAnalyticsEvent}
            onSorting={onSorting}
            columnIndex={1}
            allowColumnSorting
            isHeaderRow
          />,
        );

        tableCell.find(`[id="${MOCK_SORTING_ICON_ID}"]`).simulate('click');

        expect(fireAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.SORT_COLUMN,
          actionSubject: ACTION_SUBJECT.TABLE,
          attributes: {
            platform: PLATFORM.WEB,
            mode: MODE.RENDERER,
            columnIndex: 1,
            sortOrder: SortOrder.NO_ORDER,
          },
          eventType: EVENT_TYPE.TRACK,
        });
      });
    });

    describe('when columnIndex is null', () => {
      it('should call the function with SORT_COLUMN_NOT_ALLOWED', () => {
        const fireAnalyticsEvent = jest.fn();
        const onSorting = jest.fn();
        const tableCell = mountWithIntl(
          <TableHeader
            onSorting={onSorting}
            fireAnalyticsEvent={fireAnalyticsEvent}
            allowColumnSorting
            isHeaderRow
          />,
        );

        tableCell.find(`[id="${MOCK_SORTING_ICON_ID}"]`).simulate('click');

        expect(fireAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.SORT_COLUMN_NOT_ALLOWED,
          actionSubject: ACTION_SUBJECT.TABLE,
          attributes: {
            platform: PLATFORM.WEB,
            mode: MODE.RENDERER,
          },
          eventType: EVENT_TYPE.TRACK,
        });
      });
    });
  });
});
