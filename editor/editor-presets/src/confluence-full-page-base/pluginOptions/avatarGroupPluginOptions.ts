import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { AvatarGroupPluginOptions } from '@atlaskit/editor-plugin-avatar-group';

interface Props {
	options: {
		collabEdit: CollabEditOptions | undefined;
	};
}

export function avatarGroupPluginOptions({ options }: Props): AvatarGroupPluginOptions {
	return {
		// Avatars are moved to Confluence codebase for Edit in Context
		// When Edit in Context is enabled primaryToolbarComponents is undefined
		// For more details please check
		// https://hello.atlassian.net/wiki/spaces/PCG/pages/2851572180/Editor+toolbar+for+live+pages+and+edit+in+context+projects
		collabEdit: options.collabEdit,
		// originally depends on !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
		takeFullWidth: true,
		showAvatarGroup: false,
	};
}
