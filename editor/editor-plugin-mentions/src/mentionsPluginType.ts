import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

import type { MentionPluginOptions, MentionSharedState } from './types';

export type MentionsPlugin = NextEditorPlugin<
	'mention',
	{
		pluginConfiguration: MentionPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			TypeAheadPlugin,
			OptionalPlugin<ContextIdentifierPlugin>,
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
		};
	}
>;
