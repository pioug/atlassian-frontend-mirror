/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @repo/internal/react/no-clone-element */
import React, { Component, Fragment, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import toItemId from '../utils/to-item-id';

import Chevron from './internal/chevron';
import type Item from './internal/item';
import { TreeRowContainer } from './internal/styled';

const treeRowClickableStyles = css({
	cursor: 'pointer',
});

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

/**
 * This is hard-coded here because our actual <TableTree /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
export type RowProps = {
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

class RowComponent extends Component<any, any> {
	state = { isExpanded: this.props.isDefaultExpanded || false };

	componentDidUpdate(prevProps: any) {
		const { isDefaultExpanded, isExpanded } = this.props;

		if (
			isExpanded === undefined &&
			isDefaultExpanded !== undefined &&
			prevProps.isDefaultExpanded !== isDefaultExpanded &&
			this.state.isExpanded !== isDefaultExpanded
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({ isExpanded: isDefaultExpanded });
		}
	}

	onExpandStateChange(isExpanded: boolean) {
		if (this.props.data) {
			if (isExpanded && this.props.onExpand) {
				this.props.onExpand(this.props.data);
			} else if (!isExpanded && this.props.onCollapse) {
				this.props.onCollapse(this.props.data);
			}
		}
	}

	/**
	 * This ensures a user won't trigger a click event and expand the accordion
	 * when making a text selection.
	 */
	onClickHandler = (e: React.MouseEvent) => {
		const selection = window.getSelection()?.toString() || '';
		if (selection?.length === 0) {
			this.onExpandToggle();
		}
	};

	onExpandToggle = () => {
		const { isExpanded } = this.props;

		if (isExpanded !== undefined) {
			this.onExpandStateChange(!isExpanded);
		} else {
			this.setState({ isExpanded: !this.state.isExpanded });
			this.onExpandStateChange(!this.state.isExpanded);
		}
	};

	isExpanded() {
		const { isExpanded } = this.props;

		return isExpanded !== undefined ? isExpanded : this.state.isExpanded;
	}

	getExtendedLabel = (
		cellContent: any,
		cellIndex: number,
		mainColumnForExpandCollapseLabel: string | number,
	) => {
		/**
		 * First condition - when we pass data via `items` property in `<TableTree />`
		 * Second condition - when we pass data via `<Rows />` as children in `<TableTree />`.
		 */
		if (cellContent.hasOwnProperty('props')) {
			return cellContent?.props[(mainColumnForExpandCollapseLabel as string)?.toLowerCase()];
		} else if (cellIndex === mainColumnForExpandCollapseLabel) {
			return cellContent;
		}

		return undefined;
	};

	renderCell(cell: any, cellIndex: number) {
		const { props } = this;
		const isExpanded = this.isExpanded();
		const { hasChildren, depth, mainColumnForExpandCollapseLabel } = props;
		const isFirstCell = cellIndex === 0;
		const indentLevel = isFirstCell ? depth : 0;
		let cellContent = cell.props.children || [];
		const extendedLabel = this.getExtendedLabel(
			cellContent,
			cellIndex,
			mainColumnForExpandCollapseLabel,
		);

		if (isFirstCell && hasChildren) {
			cellContent = [
				<Chevron
					key="chevron"
					expandLabel={props.expandLabel}
					collapseLabel={props.collapseLabel}
					extendedLabel={extendedLabel}
					isExpanded={isExpanded}
					onExpandToggle={this.onExpandToggle}
					ariaControls={isExpanded ? toItemId(props.itemId) : undefined}
					rowId={props.itemId}
				/>,
			].concat(cellContent);
		}
		return React.cloneElement(
			cell,
			{
				key: cellIndex,
				columnIndex: cellIndex,
				indentLevel,
			},
			cellContent,
		);
	}

	render() {
		const { shouldExpandOnClick, hasChildren, depth, renderChildren } = this.props;
		const isExpanded = this.isExpanded();
		const ariaAttrs = {} as any;
		if (hasChildren) {
			ariaAttrs['aria-expanded'] = isExpanded;
		}
		if (depth !== undefined) {
			ariaAttrs['aria-level'] = depth;
		}
		return (
			<Fragment>
				<TreeRowContainer
					css={hasChildren && shouldExpandOnClick ? treeRowClickableStyles : undefined}
					onClick={hasChildren && shouldExpandOnClick ? this.onClickHandler : undefined}
					{...ariaAttrs}
				>
					{React.Children.map(this.props.children, (cell, index) => this.renderCell(cell, index))}
				</TreeRowContainer>
				{hasChildren && isExpanded && renderChildren && renderChildren()}
			</Fragment>
		);
	}
}

export { RowComponent as RowWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

const Row = withAnalyticsContext({
	componentName: 'row',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onExpand: createAndFireEventOnAtlaskit({
			action: 'expanded',
			actionSubject: 'tableTree',

			attributes: {
				componentName: 'row',
				packageName,
				packageVersion,
			},
		}),

		onCollapse: createAndFireEventOnAtlaskit({
			action: 'collapsed',
			actionSubject: 'tableTree',

			attributes: {
				componentName: 'row',
				packageName,
				packageVersion,
			},
		}),
	})(RowComponent),
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Row;
