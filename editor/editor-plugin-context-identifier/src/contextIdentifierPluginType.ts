import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type Configuration = {
	contextIdentifierProvider?: ContextIdentifierProvider;
};

export type ContextIdentifierPluginOptions = {
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

/**
 * @private
 * @deprecated Use {@link ContextIdentifierPluginOptions} instead
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type PluginConfiguration = ContextIdentifierPluginOptions;

export type ContextIdentifierPlugin = NextEditorPlugin<
	'contextIdentifier',
	{
		pluginConfiguration: ContextIdentifierPluginOptions | undefined;
		sharedState: Configuration | undefined;
		commands: { setProvider: (config: Configuration) => EditorCommand };
	}
>;
