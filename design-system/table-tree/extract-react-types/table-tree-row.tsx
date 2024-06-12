import { type ReactNode } from 'react';

import { type Item } from './table-tree';

/**
 * This is hard-coded here because our actual <TableTree /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
type RowProps = {
	/**
	 * Whether the row has children.
	 */
	hasChildren?: boolean;
	/**
	 * Children contained in the row. Should be one or more cell components.
	 */
	children?: React.ReactNode;
	/**
	 * ID for the row item.
	 */
	itemId?: string;
	/* eslint-disable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
	/**
    The data used to render the row and descendants. Pass down from `children` render prop.

    In addition to these props, any other data can be added to the object, and it will
    be provided as props when rendering each cell.
   */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	items?: Item[] | null;
	/**
	 * Controls the expanded state of the row.
	 */
	isExpanded?: ReactNode;
	/**
	 * Sets the default expanded state of the row.
	 */
	isDefaultExpanded?: ReactNode;
	/**
	 * This is the accessible name for the expand chevron button, used to tell assistive technology what the button is for.
	 */
	expandLabel?: string;
	/**
	 * This is the accessible name for the collapse chevron button, used to tell assistive technology what the button is for.
	 */
	collapseLabel?: string;
	/**
	 * Callback called when the row collapses.
	 */
	onCollapse?: (data: Item) => void;
	/**
	 * Callback called when the row expands.
	 */
	onExpand?: (data: Item) => void;
	/**
	 * Children to render under the row.
	 * This is normally set by the parent item component, and doesn't need to be configured.
	 */
	renderChildren?: () => React.ReactNode;
	/**
    Use this to set whether a row with children should expand when clicked anywhere within the row. If `false` or unset, a row with children will only expand when the chevron is clicked.

    If your cells contain interactive elements, always set this to `false` to avoid unexpected expanding or collapsing.
   */
	shouldExpandOnClick?: boolean;
	/**
	 * Data to render. Passed down by `item` and passed into `onExpand` and `onCollapse` callbacks.
	 * This is normally set by the parent `item` component, and doesn't need to be configured.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data?: Item;
	/**
	 * The depth used for rendering an indent.
	 * This is normally set by parent `item` component, and doesn't need to be configured.
	 */
	depth?: number;
	/**
    Adds detail to the expand and collapse row button's aria label by appending the value from the given column. If you don't set this prop, the aria label will read out "Expand `itemId` row".

    Should be a string when we pass data via `items` property in the table tree. The value should be one of the property `columns` names in the table tree.

    Should be a number  when we pass data via the `Rows` component as children in the table tree.
   */
	mainColumnForExpandCollapseLabel?: string | number;
};

const TableRow = function (props: RowProps) {
	return null;
};

TableRow.defaultProps = {
	isDefaultExpanded: false,
};

export default TableRow;
