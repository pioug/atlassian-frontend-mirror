import type { AutoformattingProvider } from '@atlaskit/editor-common/provider-factory/autoformatting-provider';
import type { CustomAutoformatPluginOptions } from '@atlaskit/editor-plugin-custom-autoformat/types';

interface Props {
	options: never;
	providers: {
		autoformattingProvider: Promise<AutoformattingProvider> | undefined;
	};
}

export function customAutoformatPluginOptions({ providers }: Props): CustomAutoformatPluginOptions {
	return {
		autoformattingProvider: providers.autoformattingProvider,
	};
}
