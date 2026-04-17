import type { TablePluginOptions } from '@atlaskit/editor-plugin-table';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		editorAppearance: FullPageEditorAppearance;
		prevEditorAppearance?: FullPageEditorAppearance;
	};
}

export function tablePluginOptions({ options }: Props): TablePluginOptions {
	return {
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
			// SECTION: From confluence/next/packages/editor-features/src/hooks/useEditorFeatureFlags.ts
			tableWithFixedColumnWidthsOption: fg('platform_editor_table_fixed_column_width_prop')
				? undefined
				: true,
			// END SECTION
			// SECTION: From confluence/next/packages/full-page-editor/src/hooks/useEditorFullPageExperiments.ts
			tableSelector: editorExperiment('platform_editor_tables_table_selector', true),
			// END SECTION
		}),
		isCommentEditor: false,
		isChromelessEditor: false,
		allowFixedColumnWidthOption: fg('platform_editor_table_fixed_column_width_prop')
			? true
			: undefined,
	};
}
