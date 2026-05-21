import React, { memo, useMemo } from 'react';

import { cssMap } from '@compiled/react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { EditorToolbarProvider } from '@atlaskit/editor-common/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
	getSelectionRect,
} from '@atlaskit/editor-tables/utils';
import type { MenuType, RegisterComponent } from '@atlaskit/editor-ui-control-model';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { canSplitCellSelection } from '../../../pm-plugins/commands/split-cell';
import { canMergeCellSelection } from '../../../pm-plugins/transforms/merge';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../../../types';

import { TableMenuProvider, type TableMenuContextValue } from './TableMenuContext';

type TableMenuProps = {
	api: PluginInjectionAPI | undefined | null;
	editorView?: EditorView;
	surface: MenuType;
};

const tableMenuContainerStyles = cssMap({
	container: {
		width: '280px',
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
		backgroundColor: token('elevation.surface.overlay'),
		overflow: 'hidden',
	},
});

const EMPTY_CONTEXT: TableMenuContextValue = {};

export const TableMenu: React.NamedExoticComponent<TableMenuProps> = memo(
	({ api, editorView, surface }: TableMenuProps): React.JSX.Element | null => {
		const components: RegisterComponent[] = useMemo(
			() => api?.uiControlRegistry?.actions.getComponents(surface.key) ?? [],
			[api, surface.key],
		);
		const { tableNode, selection } = useSharedPluginStateWithSelector(api ?? undefined, ['table', 'selection'], (states) => ({
			tableNode: (states.tableState as TableSharedStateInternal | undefined)?.tableNode,
			selection: states.selectionState?.selection,
		}));

		const tableMenuContext = useMemo(() => {
			if (!selection || !tableNode) {
				return EMPTY_CONTEXT;
			}

			const tableMap = TableMap.get(tableNode);
			const selectionRect = getSelectionRect(selection);
			const cellOps = {
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
		}, [selection, tableNode]);

		if (components.length === 0) {
			return null;
		}

		return (
			<EditorToolbarProvider editorView={editorView ?? null}>
				<TableMenuProvider value={tableMenuContext}>
					<Box xcss={tableMenuContainerStyles.container} testId={surface.key}>
						<SurfaceRenderer surface={surface} components={components} />
					</Box>
				</TableMenuProvider>
			</EditorToolbarProvider>
		);
	},
);

TableMenu.displayName = 'TableMenu';
