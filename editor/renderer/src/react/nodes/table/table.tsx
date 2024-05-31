import React from 'react';

import { Colgroup } from './colgroup';
import type { SharedTableProps } from './types';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

export type TableProps = SharedTableProps & {
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
		isinsideMultiBodiedExtension,
	}: TableProps) => {
		const tableWidth = tableNode ? getTableContainerWidth(tableNode) : akEditorDefaultLayoutWidth;

		return (
			<table
				data-testid="renderer-table"
				data-number-column={isNumberColumnEnabled}
				data-table-width={tableWidth}
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
					isinsideMultiBodiedExtension={isinsideMultiBodiedExtension}
				/>
				<tbody>{children}</tbody>
			</table>
		);
	},
);
