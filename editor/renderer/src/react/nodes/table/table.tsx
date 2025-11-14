import React from 'react';

import { Colgroup, colWidthSum } from './colgroup';
import type { SharedTableProps } from './types';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';

type TableProps = SharedTableProps & {
	children: React.ReactNode[];
	fixTableSSRResizing?: boolean;
	innerRef?: React.RefObject<HTMLTableElement>;
	isPresentational?: boolean;
};

export const Table = React.memo(
	({
		innerRef,
		isNumberColumnEnabled,
		columnWidths,
		layout,
		renderWidth,
		children,
		tableNode,
		rendererAppearance,
		isInsideOfBlockNode,
		isInsideOfTable,
		isinsideMultiBodiedExtension,
		allowTableResizing,
		isPresentational,
		fixTableSSRResizing = false,
	}: TableProps) => {
		let tableWidth: number | 'inherit' = tableNode
			? getTableContainerWidth(tableNode)
			: akEditorDefaultLayoutWidth;

		let tableColumnWidths = columnWidths;
		if (
			rendererAppearance === 'comment' &&
			allowTableResizing &&
			tableNode &&
			!tableNode.attrs?.width
		) {
			tableWidth = 'inherit';
		}
		if (rendererAppearance === 'comment' && !allowTableResizing) {
			// in the case we have css container stylings,
			// we don't need to calculate width here as this
			// is done via css
			if (!fg('platform-ssr-table-resize')) {
				tableWidth = renderWidth;
			}
		}

		// for columns that are evenly distributed, do not return `colgroup` since existing table containerQuery
		// scales up the columns width. This ensures columns always have 42px.
		if (rendererAppearance === 'comment') {
			if (fg('platform-ssr-table-resize')) {
				tableColumnWidths = columnWidths && colWidthSum(columnWidths) ? columnWidths : undefined;
			}
		}

		const tableLayout = tableNode?.attrs.layout;
		const tableDisplayMode = tableNode?.attrs.displayMode;

		return (
			<table
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...(fg('platform_renderer_isPresentational') && {
					role: isPresentational ? 'presentation' : undefined,
				})}
				data-testid="renderer-table"
				data-number-column={isNumberColumnEnabled}
				data-table-width={tableWidth}
				data-layout={tableLayout}
				data-table-display-mode={tableDisplayMode}
				ref={innerRef}
				style={{ marginTop: fixTableSSRResizing ? '0px' : '' }}
			>
				<Colgroup
					columnWidths={tableColumnWidths}
					layout={layout}
					isNumberColumnEnabled={isNumberColumnEnabled}
					renderWidth={renderWidth}
					tableNode={tableNode}
					rendererAppearance={rendererAppearance}
					isInsideOfBlockNode={isInsideOfBlockNode}
					isInsideOfTable={isInsideOfTable}
					isinsideMultiBodiedExtension={isinsideMultiBodiedExtension}
					allowTableResizing={allowTableResizing}
				/>
				<tbody>{children}</tbody>
			</table>
		);
	},
);
