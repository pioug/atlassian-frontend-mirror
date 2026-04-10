import type { SelectionExtensionPluginOptions } from '@atlaskit/editor-plugin-selection-extension';

interface Props {
	options: SelectionExtensionPluginOptions | undefined;
}

export function selectionExtensionPluginOptions({
	options,
}: Props): SelectionExtensionPluginOptions | undefined {
	return options;
}
