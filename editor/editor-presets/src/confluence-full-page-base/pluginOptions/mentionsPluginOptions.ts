import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	MentionsChangedHandler,
	MentionsPluginOptions,
} from '@atlaskit/editor-plugin-mentions';
import type { MentionProvider } from '@atlaskit/mention/types';

interface Props {
	options: {
		currentUserId?: string;
		handleMentionsChanged: MentionsChangedHandler;
	};
	providers: {
		mentionProvider: Promise<MentionProvider> | undefined;
		profilecardProvider: Promise<ProfilecardProvider> | undefined;
	};
}

export function mentionsPluginOptions({ options, providers }: Props): MentionsPluginOptions {
	return {
		sanitizePrivateContent: true,
		insertDisplayName: true,
		allowZeroWidthSpaceAfter: true,
		profilecardProvider: providers.profilecardProvider,
		handleMentionsChanged: options.handleMentionsChanged,
		mentionProvider: providers.mentionProvider,
		currentUserId: options.currentUserId,
	};
}
