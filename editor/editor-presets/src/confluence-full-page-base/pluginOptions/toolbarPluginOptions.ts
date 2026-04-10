import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar';
import type { ToolbarPluginOptions } from '@atlaskit/editor-plugin-toolbar';

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
