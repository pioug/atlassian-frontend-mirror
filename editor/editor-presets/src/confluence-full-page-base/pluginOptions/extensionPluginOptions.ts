import type { GetPMNodeHeight } from '@atlaskit/editor-common/extensibility/types';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions/extension-handler';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { ExtensionPluginOptions } from '@atlaskit/editor-plugin-extension/extensionPluginType';

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
