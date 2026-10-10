import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory/context-identifier-provider';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

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
		commands: { setProvider: (config: Configuration) => EditorCommand };
		pluginConfiguration: ContextIdentifierPluginOptions | undefined;
		sharedState: Configuration | undefined;
	}
>;
