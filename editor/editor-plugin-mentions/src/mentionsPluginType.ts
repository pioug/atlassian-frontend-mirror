import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { MentionProvider } from '@atlaskit/mention/resource';

import type { MentionPluginOptions, MentionSharedState } from './types';

export type MentionsPlugin = NextEditorPlugin<
	'mention',
	{
		pluginConfiguration: MentionPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			TypeAheadPlugin,
			OptionalPlugin<ContextIdentifierPlugin>,
			OptionalPlugin<BasePlugin>,
		];
		sharedState: MentionSharedState | undefined;
		actions: {
			openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
			announceMentionsInsertion: (
				mentionIds: {
					type: 'added' | 'deleted';
					localId: string;
					id: string;
					taskLocalId?: string;
				}[],
			) => void;
			/**
			 * Used to update the initial provider passed to the mention plugin.
			 *
			 * @param provider Promise<MentionProvider>
			 * @returns {boolean} if setting the provider was successful or not
			 */
			setProvider: (provider: Promise<MentionProvider>) => Promise<boolean>;
		};
	}
>;
