import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar/types';
import type { ToolbarPluginOptions } from '@atlaskit/editor-plugin-toolbar/types';

interface Props {
	options: {
		contextualFormattingEnabled?: ContextualFormattingEnabledOptions;
	};
}

export function toolbarPluginOptions({ options }: Props): ToolbarPluginOptions {
	return {
		contextualFormattingEnabled: options.contextualFormattingEnabled,
	};
}
