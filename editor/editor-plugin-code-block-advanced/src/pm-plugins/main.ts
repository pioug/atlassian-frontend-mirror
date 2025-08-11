import type { Extension } from '@codemirror/state';
import type { IntlShape } from 'react-intl-next';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';
import { lazyCodeBlockView } from '../nodeviews/lazyCodeBlockAdvanced';

import { shiftArrowDownWorkaround, shiftArrowUpWorkaround } from './shiftArrowKeyWorkaround';

interface Props {
	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined;
	extensions: Extension[];
	getIntl: () => IntlShape;
	allowCodeFolding: boolean;
}

export const createPlugin = (props: Props) => {
	return new SafePlugin({
		props: {
			nodeViews: {
				codeBlock: lazyCodeBlockView(props),
			},
			// Custom selection behaviour to fix issues with codeblocks with Shift + Arrow{Up || Down}
			// These issues are also present in the prosemirror codemirror example and @marijnh suggests to
			// use custom event handlers: https://github.com/ProseMirror/website/issues/83
			handleKeyDown(view: EditorView, event: KeyboardEvent) {
				if (!(event instanceof KeyboardEvent)) {
					return false;
				}

				if (event.key === 'ArrowUp' && event.shiftKey) {
					return shiftArrowUpWorkaround(view, event);
				} else if (event.key === 'ArrowDown' && event.shiftKey) {
					return shiftArrowDownWorkaround(view, event);
				}
			},
		},
	});
};
