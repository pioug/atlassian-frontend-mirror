import type { InsertBlockPluginOptions } from '@atlaskit/editor-plugin-insert-block/types';

import type { FullPageEditorAppearance } from '../types';

interface Props {
	options: {
		disableOptimisticToolbar?: InsertBlockPluginOptions['disableOptimisticToolbar'];
		editorAppearance: FullPageEditorAppearance;
		toolbarButtons: InsertBlockPluginOptions['toolbarButtons'];
	};
}

export function insertBlockPluginOptions({ options }: Props): InsertBlockPluginOptions {
	return {
		disableOptimisticToolbar: options.disableOptimisticToolbar,
		allowTables: true,
		allowExpand: true,
		horizontalRuleEnabled: true,
		tableSelectorSupported: true,
		nativeStatusSupported: true,
		showElementBrowserLink: true,
		appearance: options.editorAppearance,
		toolbarButtons: options.toolbarButtons,
	};
}
