import React from 'react';

import { Colgroup } from './colgroup';
import type { SharedTableProps } from './types';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

type TableProps = SharedTableProps & {
	innerRef?: React.RefObject<HTMLTableElement>;
	children: React.ReactNode[];
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
	}: TableProps) => {
		let tableWidth: number | 'inherit' = tableNode
			? getTableContainerWidth(tableNode)
			: akEditorDefaultLayoutWidth;

		if (
			rendererAppearance === 'comment' &&
			allowTableResizing &&
			tableNode &&
			!tableNode.attrs?.width
		) {
			tableWidth = 'inherit';
		}
		if (rendererAppearance === 'comment' && !allowTableResizing) {
			tableWidth = renderWidth;
		}

		const tableLayout = tableNode?.attrs.layout;
		const tableDisplayMode = tableNode?.attrs.displayMode;

		return (
			<table
				data-testid="renderer-table"
				data-number-column={isNumberColumnEnabled}
				data-table-width={tableWidth}
				data-layout={tableLayout}
				data-table-display-mode={tableDisplayMode}
				ref={innerRef}
			>
				<Colgroup
					columnWidths={columnWidths}
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
