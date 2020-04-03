import React from 'react';
import { CSSProperties } from 'react';
import { CellAttributes } from '@atlaskit/adf-schema';
import { SortOrder, compose } from '@atlaskit/editor-common';
import SortingIcon from '../../ui/SortingIcon';
import { AnalyticsEventPayload, MODE, PLATFORM } from '../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { RendererCssClassName } from '../../consts';

type CellProps = CellAttributes & {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export type CellWithSortingProps = CellProps & {
  isHeaderRow?: boolean;
  allowColumnSorting?: boolean;
  onSorting?: (columnIndex?: number, currentSortOrdered?: SortOrder) => void;
  columnIndex?: number;
  sortOrdered?: SortOrder;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
};

const nextStatusOrder = (currentSortOrder?: SortOrder): SortOrder => {
  switch (currentSortOrder) {
    case SortOrder.NO_ORDER:
      return SortOrder.ASC;
    case SortOrder.ASC:
      return SortOrder.DESC;
    case SortOrder.DESC:
      return SortOrder.NO_ORDER;
  }

  return SortOrder.NO_ORDER;
};

const getDataAttributes = (colwidth?: number[]): any => {
  const attrs: any = {};
  if (colwidth) {
    attrs['data-colwidth'] = colwidth.join(',');
  }

  return attrs;
};

const getStyle = (background?: string): CSSProperties => {
  const style: CSSProperties = {};
  if (background) {
    style.backgroundColor = background;
  }

  return style;
};

const withCellProps = (WrapperComponent: React.ElementType) => {
  return class WithCellProps extends React.Component<CellProps> {
    render() {
      const {
        children,
        className,
        onClick,
        colwidth,
        rowspan,
        colspan,
        background,
      } = this.props;

      return (
        <WrapperComponent
          rowSpan={rowspan}
          colSpan={colspan}
          style={getStyle(background)}
          onClick={onClick}
          className={className}
          {...getDataAttributes(colwidth)}
        >
          {children}
        </WrapperComponent>
      );
    }
  };
};

export const withSortableColumn = (WrapperComponent: React.ElementType) => {
  return class WithSortableColumn extends React.Component<
    CellWithSortingProps
  > {
    constructor(props: CellWithSortingProps) {
      super(props);
    }

    render() {
      const {
        allowColumnSorting,
        onSorting,
        children,
        sortOrdered,
        isHeaderRow,
      } = this.props;
      const sortOrderedClassName =
        sortOrdered === SortOrder.NO_ORDER
          ? RendererCssClassName.SORTABLE_COLUMN_NO_ORDER
          : '';

      if (!allowColumnSorting || !isHeaderRow) {
        return <WrapperComponent {...this.props} />;
      }

      let className = RendererCssClassName.SORTABLE_COLUMN;

      if (!onSorting) {
        className = `${className} ${RendererCssClassName.SORTABLE_COLUMN_NOT_ALLOWED}`;
      }

      return (
        <WrapperComponent
          {...this.props}
          className={className}
          onClick={this.onClick}
        >
          <>
            {children}
            <figure
              className={`${RendererCssClassName.SORTABLE_COLUMN_ICON} ${sortOrderedClassName}`}
            >
              <SortingIcon
                isSortingAllowed={!!onSorting}
                sortOrdered={sortOrdered}
              />
            </figure>
          </>
        </WrapperComponent>
      );
    }

    onClick = () => {
      const {
        fireAnalyticsEvent,
        onSorting,
        columnIndex,
        sortOrdered,
      } = this.props;

      if (onSorting && columnIndex != null) {
        const sortOrder = nextStatusOrder(sortOrdered);

        onSorting(columnIndex, sortOrder);
        fireAnalyticsEvent &&
          fireAnalyticsEvent({
            action: ACTION.SORT_COLUMN,
            actionSubject: ACTION_SUBJECT.TABLE,
            attributes: {
              platform: PLATFORM.WEB,
              mode: MODE.RENDERER,
              columnIndex,
              sortOrder,
            },
            eventType: EVENT_TYPE.TRACK,
          });
      } else {
        fireAnalyticsEvent &&
          fireAnalyticsEvent({
            action: ACTION.SORT_COLUMN_NOT_ALLOWED,
            actionSubject: ACTION_SUBJECT.TABLE,
            attributes: {
              platform: PLATFORM.WEB,
              mode: MODE.RENDERER,
            },
            eventType: EVENT_TYPE.TRACK,
          });
      }
    };
  };
};

export const TableHeader = compose(withSortableColumn, withCellProps)('th');
export const TableCell = withCellProps('td');
