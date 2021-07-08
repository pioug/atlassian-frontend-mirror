import React, { CSSProperties } from 'react';
import {
  CellAttributes,
  tableBackgroundColorPalette,
} from '@atlaskit/adf-schema';
import { compose, SortOrder } from '@atlaskit/editor-common';
import SortingIcon from '../../ui/SortingIcon';
import { AnalyticsEventPayload, MODE, PLATFORM } from '../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { RendererCssClassName } from '../../consts';

type CellProps = CellAttributes & {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  colGroupWidth?: string;
  offsetTop?: number;
  ariaSort?: string;
};
const IgnoreSorting = ['LABEL', 'INPUT'];

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

const getSortOrderLabel = (currentSortOrder?: SortOrder): string => {
  switch (currentSortOrder) {
    case SortOrder.NO_ORDER:
      return 'none';
    case SortOrder.ASC:
      return 'ascending';
    case SortOrder.DESC:
      return 'descending';
    default:
      return 'none';
  }
};

const getDataAttributes = (colwidth?: number[]): any => {
  const attrs: any = {};
  if (colwidth) {
    attrs['data-colwidth'] = colwidth.join(',');
  }

  return attrs;
};

const getStyle = (
  background?: string,
  colGroupWidth?: string,
  offsetTop?: number,
): CSSProperties => {
  const style: CSSProperties = {};
  if (background) {
    style.backgroundColor = background;
  }

  if (colGroupWidth) {
    style.width = colGroupWidth;
    style.minWidth = colGroupWidth;
  }

  if (offsetTop !== undefined) {
    style.top = offsetTop;
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
        colGroupWidth,
        rowspan,
        colspan,
        background,
        offsetTop,
        ariaSort,
      } = this.props;

      const colorName = background
        ? tableBackgroundColorPalette.get(background)
        : '';

      return (
        <WrapperComponent
          rowSpan={rowspan}
          colSpan={colspan}
          style={getStyle(background, colGroupWidth, offsetTop)}
          colorname={colorName}
          onClick={onClick}
          className={className}
          {...getDataAttributes(colwidth)}
          aria-sort={ariaSort}
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
          ariaSort={getSortOrderLabel(sortOrdered)}
        >
          <div
            className={RendererCssClassName.SORTABLE_COLUMN_BUTTON}
            role="button"
            tabIndex={onSorting ? 0 : -1}
            onClick={this.onClick}
            onKeyDown={this.onKeyPress}
            aria-disabled={!onSorting}
          >
            {children}
            <figure
              aria-hidden
              className={`${RendererCssClassName.SORTABLE_COLUMN_ICON} ${sortOrderedClassName}`}
            >
              <SortingIcon
                isSortingAllowed={!!onSorting}
                sortOrdered={sortOrdered}
              />
            </figure>
          </div>
        </WrapperComponent>
      );
    }

    onKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
      const keys = [' ', 'Enter', 'Spacebar'];
      if (keys.includes(event.key)) {
        event.preventDefault();
        this.onClick(event);
      }
    };

    onClick = (
      event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ) => {
      // ignore sorting when specific elements are clicked
      const { tagName } = event.target as HTMLElement;
      if (IgnoreSorting.includes(tagName)) {
        return;
      }
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
