import type { InsertBlockPluginOptions } from '@atlaskit/editor-plugin-insert-block';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		editorAppearance: FullPageEditorAppearance;
		toolbarButtons: InsertBlockPluginOptions['toolbarButtons'];
	};
}

export function insertBlockPluginOptions({ options }: Props): InsertBlockPluginOptions {
	return {
		allowTables: true,
		allowExpand: true,
		horizontalRuleEnabled: true,
		tableSelectorSupported: editorExperiment('platform_editor_tables_table_selector', true),
		nativeStatusSupported: true,
		showElementBrowserLink: true,
		appearance: options.editorAppearance,
		toolbarButtons: options.toolbarButtons,
	};
}
