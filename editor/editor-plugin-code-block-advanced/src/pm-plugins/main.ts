import type { Extension } from '@codemirror/state';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';
import { lazyCodeBlockView } from '../nodeviews/lazyCodeBlockAdvanced';

interface Props {
	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined;
	extensions: Extension[];
}

export const createPlugin = (props: Props) => {
	return new SafePlugin({
		props: {
			nodeViews: {
				codeBlock: lazyCodeBlockView(props),
			},
		},
	});
};
