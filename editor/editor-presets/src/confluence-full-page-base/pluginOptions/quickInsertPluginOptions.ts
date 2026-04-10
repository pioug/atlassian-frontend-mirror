import type { EmptyStateHandler, QuickInsertOptions } from '@atlaskit/editor-common/types';
import type { QuickInsertPluginOptions } from '@atlaskit/editor-plugin-quick-insert';

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
