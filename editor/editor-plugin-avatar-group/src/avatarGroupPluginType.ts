import type { CollabEditOptions, CollabInviteToEditProps } from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

export type AvatarGroupPluginOptions = {
	collabEdit?: CollabEditOptions;
	showAvatarGroup?: boolean;
	takeFullWidth: boolean;
};

export type AvatarGroupPluginDependencies = [
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<CollabEditPlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
];

export type AvatarGroupPlugin = NextEditorPlugin<
	'avatarGroup',
	{
		actions: {
			getToolbarItem: ({
				inviteToEditHandler,
				isInviteToEditButtonSelected,
				inviteToEditComponent,
			}: CollabInviteToEditProps) => JSX.Element | null;
		};
		dependencies: AvatarGroupPluginDependencies;
		pluginConfiguration: AvatarGroupPluginOptions;
	}
>;
