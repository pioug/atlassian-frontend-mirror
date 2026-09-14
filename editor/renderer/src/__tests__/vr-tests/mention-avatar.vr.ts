import { snapshot } from '@af/visual-regression';

import { RendererMentionAvatar } from './mention-avatar.fixture.vr.ap';

snapshot(RendererMentionAvatar, {
	description: 'Renderer mentions display user and agent avatars in place of the at-sign',
	featureFlags: {
		platform_editor_mention_node_avatar: true,
	},
});
