import type { EditorDisabledPluginOptions } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';

interface Props {
	options: {
		disabled: boolean | undefined;
	};
}

export function editorDisabledPluginOptions({ options }: Props): EditorDisabledPluginOptions {
	return {
		initialDisabledState: options?.disabled,
	};
}
