import { type ElementType, type ReactNode } from 'react';

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
   * The contents of the table.
   * Use this when composing `Cell`, `Header`, `Headers`, `Row`, and `Rows` components.
   * For basic usage, it's simpler to specify table contents with the `items` prop instead.
   */
  children?: ReactNode;
  /**
   * Each column component is used to render the cells in that column.
   * A cell's `content` value, specified in the data passed to `items`, is provided as props.
   */
  columns?: ElementType<Content>[];
  /**
   * The widths of the columns in the table.
   */
  columnWidths?: (string | number)[];
  /**
   * The header text of the columns of the table.
   */
  headers?: string[];
  /* eslint-disable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
  /**
    Use this to set whether a row with children should expand when clicked anywhere within the row. If `false` or unset, a row with children will only expand when the chevron is clicked.

    If your cells contain interactive elements, always set this to `false` to avoid unexpected expanding or collapsing.

    If you aren’t using the `items` prop, `shouldExpandOnClick` should be used on the row component instead.
   */
  shouldExpandOnClick?: boolean;
  /**
    The data used to render the table. If you’re creating a basic table, use this prop instead of composing cell, header, headers, row, and rows components.

    In addition to the `items` props, any other data can be added, and it will
    be provided as props when rendering each cell.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items?: Item[] | null;
  /**
   * The value used to extend the expand or collapse button label in cases where `row` has child rows.
   * It should be a string when we pass data via the `items` property, the value should be one of the `columns` names.
   * It should be a number when we pass data via the `rows` component as children in the table tree.
   */
  mainColumnForExpandCollapseLabel?: string | number;
  /**
   * This is an `aria-label` attribute. Use the label to describe the table for assistive technologies.
   * Usage of either this, or the `labelId` attribute is strongly recommended.
   */
  label?: string;
  /**
   * This is an `aria-labelledby` attribute. Pass an ID for the element which should define an accessible name for the table.
   * Usage of either this, or the `label` attribute is strongly recommended.
   */
  referencedLabel?: string;
};

export default function (props: TableTreeProps) {
  return null;
}
