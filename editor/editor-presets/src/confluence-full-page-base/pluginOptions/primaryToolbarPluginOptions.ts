import type { PrimaryToolbarPluginOptions } from '@atlaskit/editor-plugin-primary-toolbar';

interface Props {
	options: {
		contextualFormattingEnabled: boolean;
	};
}

export function primaryToolbarPluginOptions({ options }: Props): PrimaryToolbarPluginOptions {
	return {
		contextualFormattingEnabled: options.contextualFormattingEnabled,
	};
}
