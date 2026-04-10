import type { CollabEditOptions, CollabEditProvider } from '@atlaskit/editor-common/collab';
import { shouldForceTracking } from '@atlaskit/editor-common/utils';
import type { CollabEditPluginOptions } from '@atlaskit/editor-plugin-collab-edit';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface Props {
	options: {
		__livePage: boolean | undefined;
		collabEdit: CollabEditOptions | undefined;
	};
	providers: {
		collabEditProvider: Promise<CollabEditProvider> | undefined;
	};
}

export function collabEditPluginOptions({ options, providers }: Props): CollabEditPluginOptions {
	return {
		// Core options
		provider: providers.collabEditProvider,
		userId: options.collabEdit?.userId,
		useNativePlugin: options.collabEdit?.useNativePlugin,
		sanitizePrivateContent: true,
		hideTelecursorOnLoad:
			options.__livePage ||
			expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true),

		// Invite to edit related options
		inviteToEditHandler: options.collabEdit?.inviteToEditHandler,
		isInviteToEditButtonSelected: options.collabEdit?.isInviteToEditButtonSelected,
		inviteToEditComponent: options.collabEdit?.inviteToEditComponent,

		// Analytics options
		EXPERIMENTAL_allowInternalErrorAnalytics:
			options.collabEdit?.EXPERIMENTAL_allowInternalErrorAnalytics ?? shouldForceTracking(),
	};
}
