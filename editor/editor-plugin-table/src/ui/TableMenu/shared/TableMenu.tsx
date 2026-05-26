import React, { memo, useMemo } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { ToolbarMenuContainer } from '@atlaskit/editor-toolbar/toolbar-menu-container';
import type { MenuType, RegisterComponent } from '@atlaskit/editor-ui-control-model';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';

import { canSplitCellSelection } from '../../../pm-plugins/commands/split-cell';
import { canMergeCellSelection } from '../../../pm-plugins/transforms/merge';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../../../types';

import { TableMenuProvider } from './TableMenuContext';

type TableMenuProps = {
	api: PluginInjectionAPI | undefined | null;
	editorView?: EditorView;
	surface: MenuType;
};

export const TableMenu: React.NamedExoticComponent<TableMenuProps> = memo(
	({ api, editorView, surface }: TableMenuProps): React.JSX.Element | null => {
		const components: RegisterComponent[] = useMemo(
			() => api?.uiControlRegistry?.actions.getComponents(surface.key) ?? [],
			[api, surface.key],
		);

		const { tableNode, selection } = useSharedPluginStateWithSelector(
			api ?? undefined,
			['table', 'selection'],
			(states) => ({
				tableNode: (states.tableState as TableSharedStateInternal | undefined)?.tableNode,
				selection: states.selectionState?.selection,
			}),
		);

		const tableMenuContext = useMemo(() => {
			if (!selection || !tableNode) {
				return { editorView };
			}

			const tableMap = TableMap.get(tableNode);
			const selectionRect = getSelectionRect(selection);
			const cellOps = {
				editorView,
				canMergeCells: canMergeCellSelection(selection),
				canSplitCell: canSplitCellSelection(selection),
				hasMergedCellsInTable: tableMap.hasMergedCells(),
			};

			if (!selectionRect) {
				return cellOps;
			}

			return {
				...cellOps,
				isFirstRow: selectionRect.top === 0,
				isLastRow: selectionRect.bottom === tableMap.height,
				selectedRowCount: selectionRect.bottom - selectionRect.top,
				isFirstColumn: selectionRect.left === 0,
				isLastColumn: selectionRect.right === tableMap.width,
				selectedColumnCount: selectionRect.right - selectionRect.left,
			};
		}, [editorView, selection, tableNode]);

		if (components.length === 0) {
			return null;
		}

		return (
			<TableMenuProvider value={tableMenuContext}>
				<ToolbarMenuContainer>
					<SurfaceRenderer surface={surface} components={components} />
				</ToolbarMenuContainer>
			</TableMenuProvider>
		);
	},
);

TableMenu.displayName = 'TableMenu';
