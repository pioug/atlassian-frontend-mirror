/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, type ReactNode, useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';

import toItemId from '../utils/to-item-id';

import Chevron from './internal/chevron';
import { TreeRowContainer } from './internal/styled';

const treeRowClickableStyles = css({
	cursor: 'pointer',
});

const getExtendedLabel = (
	cellContent: any,
	cellIndex: number,
	mainColumnForExpandCollapseLabel?: string | number,
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

export interface RowProps<Item> {
	/**
	 * Whether the row has children.
	 */
	hasChildren?: boolean;
	/**
	 * Children contained in the row. Should be one or more cell components.
	 */
	children?: ReactNode;
	/**
	 * ID for the row item.
	 */
	itemId?: string;
	/* eslint-disable jsdoc/require-asterisk-prefix */
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
	isExpanded?: boolean;
	/**
	 * Sets the default expanded state of the row.
	 */
	isDefaultExpanded?: boolean;
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
	onCollapse?: (data: Item, analytics?: UIAnalyticsEvent) => void | Promise<void>;
	/**
	 * Callback called when the row expands.
	 */
	onExpand?: (data: Item, analytics?: UIAnalyticsEvent) => void | Promise<void>;
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
}

function Row<Item extends { id: string }>({
	shouldExpandOnClick,
	hasChildren,
	depth,
	renderChildren,
	isDefaultExpanded,
	data,
	onExpand: providedOnExpand,
	onCollapse: providedOnCollapse,
	mainColumnForExpandCollapseLabel,
	expandLabel,
	collapseLabel,
	itemId,
	children,
	isExpanded: isProvidedExpanded,
}: RowProps<Item>) {
	const [isExpandedState, setIsExpandedState] = useState(isDefaultExpanded || false);

	useEffect(() => {
		if (isProvidedExpanded === undefined && isDefaultExpanded !== undefined) {
			setIsExpandedState(isDefaultExpanded);
		}
	}, [isDefaultExpanded, isProvidedExpanded]);

	const onExpand = usePlatformLeafEventHandler<Item>({
		fn: (value) => providedOnExpand && providedOnExpand(value),
		action: 'expanded',
		actionSubject: 'tableTree',
		componentName: 'row',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
	});

	const onCollapse = usePlatformLeafEventHandler<Item>({
		fn: (value) => providedOnCollapse && providedOnCollapse(value),
		action: 'collapsed',
		actionSubject: 'tableTree',
		componentName: 'row',
		packageName: process.env._PACKAGE_NAME_ as string,
		packageVersion: process.env._PACKAGE_VERSION_ as string,
	});

	/**
	 * This ensures a user won't trigger a click event and expand the accordion
	 * when making a text selection.
	 */
	const onClickHandler = (e: React.MouseEvent) => {
		const selection = window.getSelection()?.toString() || '';
		if (selection?.length === 0) {
			onExpandToggle(e);
		}
	};

	const onExpandStateChange = (isExpanded: boolean) => {
		if (data) {
			if (isExpanded && onExpand) {
				onExpand(data);
			} else if (!isExpanded && onCollapse) {
				onCollapse(data);
			}
		}
	};

	const onExpandToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isProvidedExpanded !== undefined) {
			onExpandStateChange(!isProvidedExpanded);
		} else {
			setIsExpandedState((prevState) => {
				onExpandStateChange(!prevState);
				return !prevState;
			});
		}
	};

	const renderCell = (cell: any, cellIndex: number) => {
		const isFirstCell = cellIndex === 0;
		const indentLevel = isFirstCell ? depth : 0;
		let cellContent = cell.props.children || [];
		const extendedLabel = getExtendedLabel(
			cellContent,
			cellIndex,
			mainColumnForExpandCollapseLabel,
		);

		if (isFirstCell && hasChildren) {
			cellContent = [
				<Chevron
					key="chevron"
					expandLabel={expandLabel}
					collapseLabel={collapseLabel}
					extendedLabel={extendedLabel}
					isExpanded={isProvidedExpanded !== undefined ? isProvidedExpanded : isExpandedState}
					onExpandToggle={onExpandToggle}
					ariaControls={!!itemId ? toItemId(itemId) : undefined}
					rowId={!!itemId ? itemId : ''}
				/>,
			].concat(cellContent);
		}
		// eslint-disable-next-line @repo/internal/react/no-clone-element
		return React.cloneElement(
			cell,
			{
				key: cellIndex,
				columnIndex: cellIndex,
				indentLevel,
			},
			cellContent,
		);
	};

	return (
		<Fragment>
			<TreeRowContainer
				css={[hasChildren && shouldExpandOnClick ? treeRowClickableStyles : undefined]}
				onClick={hasChildren && shouldExpandOnClick ? onClickHandler : undefined}
				aria-expanded={hasChildren ? isExpandedState : undefined}
				aria-level={depth ? depth : undefined}
			>
				{React.Children.map(children, (cell, index) => renderCell(cell, index))}
			</TreeRowContainer>
			{hasChildren &&
				(isProvidedExpanded !== undefined ? isProvidedExpanded : isExpandedState) &&
				renderChildren &&
				renderChildren()}
		</Fragment>
	);
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Row;
