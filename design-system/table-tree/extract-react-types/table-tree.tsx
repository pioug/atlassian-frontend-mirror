import { ElementType, ReactNode } from 'react';

class Content extends Object {}

export type Item = {
  id: string;
  hasChildren: boolean;
  children?: Item[];
};

/**
 * This is hard-coded here because our actual <TableTree /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
type TableTreeProps = {
  /**
   * The contents of the table,
   * used when composing `Cell`, `Header`, `Headers`, `Row`, and `Rows` components.
   * For basic usage, you can instead specify table contents with the `items` prop.
   */
  children?: ReactNode;
  /**
   * Each column component is used to render the cells in that column.
   * A cell's `content` value, specified in the data passed to `items`, is provided as props.
   */
  columns?: ElementType<Content>[];
  /**
   * The widths of the respective columns in the table.
   */
  columnWidths?: (string | number)[];
  /**
   * The header text of the respective columns of the table.
   */
  headers?: string[];
  /* eslint-disable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
  /**
    Whether a row with children should expand when clicked anywhere within the row. If false or unset, a row with children will only expand when the chevron is clicked.

    If your cells contain interactive elements, this can cause unexpected expanding or collapsing.

    If not using the `items` prop, `shouldExpandOnClick` should be used on the row component instead.
   */
  shouldExpandOnClick?: boolean;
  /**
    The data used to render the table.

    In addition to these props, any other data can be added, and it will
    be provided as props when rendering each cell.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items?: Item[] | null;
  /* eslint-enable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
  /**
   * The value used to extend the expand or collapse button label in cases where `Row` has child rows.
   *
   * Should be a string when we pass data via `items` property, value should be one of the `columns` names.
   * Should be a number when we pass data via `<Rows />` component as children in `<TableTree />`.
   */
  mainColumnForExpandCollapseLabel?: string | number;
  /**
   * Refers to an `aria-label` attribute. Use label to describe the table for assistive technologies.
   * Usage of either this, or the `labelId` attribute is strongly recommended.
   */
  label?: string;
  /**
   * Refers to an `aria-labelledby` attribute. Pass an id of the element which should define an accessible name for the table.
   * Usage of either this, or the `label` attribute is strongly recommended.
   */
  referencedLabel?: string;
};

export default function (props: TableTreeProps) {
  return null;
}
