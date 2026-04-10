import type { GetPMNodeHeight } from '@atlaskit/editor-common/extensibility';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import type { ExtensionPluginOptions } from '@atlaskit/editor-plugin-extension';

interface Props {
	options: {
		__rendererExtensionOptions?: ExtensionPluginOptions['__rendererExtensionOptions'];
		editorAppearance?: EditorAppearance;
		extensionHandlers?: ExtensionHandlers;
		getExtensionHeight?: GetPMNodeHeight;
		getUnsupportedContent?: ExtensionPluginOptions['getUnsupportedContent'];
	};
}

export function extensionPluginOptions({ options }: Props): ExtensionPluginOptions {
	return {
		breakoutEnabled: options.editorAppearance === 'full-page',
		extensionHandlers: options.extensionHandlers,
		useLongPressSelection: false,
		appearance: options.editorAppearance,
		__rendererExtensionOptions: options.__rendererExtensionOptions,
		getExtensionHeight: options.getExtensionHeight,
		getUnsupportedContent: options.getUnsupportedContent,
	};
}
