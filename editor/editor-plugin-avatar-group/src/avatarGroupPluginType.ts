import type { CollabEditOptions, CollabInviteToEditProps } from '@atlaskit/editor-common/collab';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit/collabEditPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';

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
