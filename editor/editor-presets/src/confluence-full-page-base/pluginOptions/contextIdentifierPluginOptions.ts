import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory/context-identifier-provider';
import type { ContextIdentifierPluginOptions } from '@atlaskit/editor-plugin-context-identifier/contextIdentifierPluginType';

interface Props {
	options: never;
	providers: {
		contextIdentifierProvider: Promise<ContextIdentifierProvider> | undefined;
	};
}

export function contextIdentifierPluginOptions({
	providers,
}: Props): ContextIdentifierPluginOptions {
	return { contextIdentifierProvider: providers.contextIdentifierProvider };
}
