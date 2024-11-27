import { type AutoformattingProvider } from '@atlaskit/editor-common/provider-factory';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
export type {
	AutoformatHandler,
	AutoformatReplacement,
	AutoformattingProvider,
	AutoformatRuleset as Ruleset,
} from '@atlaskit/editor-common/provider-factory';

import type { CustomAutoformatPluginOptions, CustomAutoformatPluginSharedState } from './types';

export type CustomAutoformatPlugin = NextEditorPlugin<
	'customAutoformat',
	{
		sharedState: CustomAutoformatPluginSharedState | undefined;
		pluginConfiguration: CustomAutoformatPluginOptions;
		actions: {
			setProvider: (provider: Promise<AutoformattingProvider>) => Promise<boolean>;
		};
	}
>;
