import React from 'react';

import { Colgroup, colWidthSum } from './colgroup';
import type { SharedTableProps } from './types';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { isTableInContentMode } from '@atlaskit/editor-common/table';
import { isContentModeSupported } from './content-mode';

type TableProps = SharedTableProps & {
	children: React.ReactNode[];
	fixTableSSRResizing?: boolean;
	innerRef?: React.RefObject<HTMLTableElement>;
	isPresentational?: boolean;
};

export const Table: React.MemoExoticComponent<
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
		isInsideOfNestedRenderer,
		isInsideOfTable,
		isinsideMultiBodiedExtension,
		allowTableResizing,
		isPresentational,
		fixTableSSRResizing,
		allowFixedColumnWidthOption,
	}: TableProps) => React.JSX.Element
> = React.memo(
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
		isInsideOfNestedRenderer,
		isInsideOfTable,
		isinsideMultiBodiedExtension,
		allowTableResizing,
		isPresentational,
		fixTableSSRResizing = false,
		allowFixedColumnWidthOption = false,
	}: TableProps): React.JSX.Element => {
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
		// for columns that are evenly distributed, do not return `colgroup` since existing table containerQuery
		// scales up the columns width. This ensures columns always have 42px.
		if (rendererAppearance === 'comment') {
			tableColumnWidths = columnWidths && colWidthSum(columnWidths) ? columnWidths : undefined;
		}

		const tableLayout = tableNode?.attrs.layout;
		const tableDisplayMode = tableNode?.attrs.displayMode;

		const isContentMode = isTableInContentMode({
			tableNode,
			isSupported: isContentModeSupported({ allowTableResizing, rendererAppearance }),
			isTableNested: isInsideOfBlockNode || isInsideOfNestedRenderer || isInsideOfTable,
		});

		return (
			<table
				// eslint-disable-next-line react/jsx-props-no-spreading, @atlaskit/platform/valid-gate-name
				{...(fg('platform_renderer_isPresentational') && {
					role: isPresentational ? 'presentation' : undefined,
				})}
				data-testid="renderer-table"
				data-number-column={isNumberColumnEnabled}
				data-table-width={tableWidth}
				data-layout={tableLayout}
				data-table-display-mode={tableDisplayMode}
				data-initial-width-mode={isContentMode ? 'content' : undefined}
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
					allowFixedColumnWidthOption={allowFixedColumnWidthOption}
				/>
				<tbody>{children}</tbody>
			</table>
		);
	},
);
