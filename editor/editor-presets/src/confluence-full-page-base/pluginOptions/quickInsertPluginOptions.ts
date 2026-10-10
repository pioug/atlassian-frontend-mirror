import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type { QuickInsertOptions } from '@atlaskit/editor-common/types/quick-insert';
import type { QuickInsertPluginOptions } from '@atlaskit/editor-plugin-quick-insert/quick-insert-plugin-type';

interface Props {
	options: {
		emptyStateHandler?: EmptyStateHandler | undefined;
		quickInsert?: QuickInsertOptions;
	};
}

export function quickInsertPluginOptions({ options }: Props): QuickInsertPluginOptions {
	return {
		enableElementBrowser: true,
		elementBrowserHelpUrl: '', // Value never set in full-page editor.
		disableDefaultItems: false,
		headless: false,
		emptyStateHandler: options?.emptyStateHandler,
		prioritySortingFn:
			typeof options.quickInsert === 'object' ? options.quickInsert.prioritySortingFn : undefined,
		onInsert: typeof options.quickInsert === 'object' ? options.quickInsert.onInsert : undefined,
	};
}
