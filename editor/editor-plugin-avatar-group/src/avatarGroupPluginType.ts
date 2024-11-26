import type { CollabEditOptions, CollabInviteToEditProps } from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

type Config = {
	collabEdit?: CollabEditOptions;
	takeFullWidth: boolean;
	showAvatarGroup?: boolean;
};

export type AvatarGroupPlugin = NextEditorPlugin<
	'avatarGroup',
	{
		pluginConfiguration: Config;
		dependencies: [
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<CollabEditPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
		];
		actions: {
			getToolbarItem: ({
				inviteToEditHandler,
				isInviteToEditButtonSelected,
				inviteToEditComponent,
			}: CollabInviteToEditProps) => JSX.Element | null;
		};
	}
>;
