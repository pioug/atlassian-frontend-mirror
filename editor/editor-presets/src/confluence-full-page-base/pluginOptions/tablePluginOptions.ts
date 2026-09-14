import type { TablePluginOptions } from '@atlaskit/editor-plugin-table';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		__livePage?: boolean;
		editorAppearance: FullPageEditorAppearance;
		prevEditorAppearance?: FullPageEditorAppearance;
	};
}

export function tablePluginOptions({ options }: Props): TablePluginOptions {
	return {
		__livePage: options.__livePage,
		// value from next/packages/editor-features/src/hooks/useTableOptions.ts
		tableOptions: {
			allowTableResizing: true,
			allowTableAlignment: true,
			allowBackgroundColor: true,
			allowColumnResizing: true,
			allowColumnSorting: true,
			allowDistributeColumns: true,
			allowHeaderColumn: true,
			allowHeaderRow: true,
			allowMergeCells: true,
			allowNumberColumn: true,
			allowNestedTables: true,
			allowControls: true,
			stickyHeaders: true,
			allowAddColumnWithCustomStep: false,
		},
		isTableScalingEnabled: true,
		allowContextualMenu: true,
		fullWidthEnabled: options.editorAppearance === 'full-width',
		maxWidthEnabled: options.editorAppearance === 'max',
		wasFullWidthEnabled:
			options.prevEditorAppearance && options.prevEditorAppearance === 'full-width',
		getEditorFeatureFlags: () => ({
			// SECTION: From confluence/next/packages/full-page-editor/src/hooks/useEditorFullPageExperiments.ts
			tableSelector: editorExperiment('platform_editor_tables_table_selector', true),
			// END SECTION
		}),
		isCommentEditor: false,
		isChromelessEditor: false,
		allowFixedColumnWidthOption: true,
	};
}
