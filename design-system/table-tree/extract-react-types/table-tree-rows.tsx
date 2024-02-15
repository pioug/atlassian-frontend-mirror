import { Item } from './table-tree';

/**
 * This is hard-coded here because our actual <Rows /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
type RowsProps = {
  /* eslint-disable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
  /**
    The data used to render the set of rows. Will be passed down via the `children` render prop.

    In addition to these props, any other data can be added to the object, and it will
    be provided as props when rendering each cell.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items?: Item[] | null;
  /* eslint-enable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
  /**
   * Accessible name for loading states spinner. Can be used for internationalization.
   * Default is "Loading".
   */
  loadingLabel?: string | null;
  /**
   * Render function for child rows. Render props will contain an item from the
   * `items` prop above.
   */
  render?: (item: Item) => React.ReactNode;
};

const TableRows = function (props: RowsProps) {
  return null;
};

TableRows.defaultProps = {};

export default TableRows;
