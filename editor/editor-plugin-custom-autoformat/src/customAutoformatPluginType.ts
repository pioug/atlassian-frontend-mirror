import type { AutoformattingProvider } from '@atlaskit/editor-common/provider-factory/autoformatting-provider';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

import type { CustomAutoformatPluginOptions, CustomAutoformatPluginSharedState } from './types';

export type CustomAutoformatPlugin = NextEditorPlugin<
	'customAutoformat',
	{
		actions: {
			setProvider: (provider: Promise<AutoformattingProvider>) => Promise<boolean>;
		};
		pluginConfiguration: CustomAutoformatPluginOptions;
		sharedState: CustomAutoformatPluginSharedState | undefined;
	}
>;
