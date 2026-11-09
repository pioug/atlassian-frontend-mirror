import type { ProfilecardProvider } from '@atlaskit/editor-common/provider-factory/profile-card-provider';
import type {
	MentionsChangedHandler,
	MentionsPluginOptions,
} from '@atlaskit/editor-plugin-mentions/types';
import type { MentionProvider } from '@atlaskit/mention/types';

interface Props {
	options: {
		agentSectionLozenge?: MentionsPluginOptions['agentSectionLozenge'];
		currentUserId?: string;
		disableOptimisticToolbar?: MentionsPluginOptions['disableOptimisticToolbar'];
		enableAgentSectioning?: boolean;
		getIsRovoPanelOpen?: () => boolean;
		handleMentionsChanged: MentionsChangedHandler;
		onAgentMentionChatClick?: MentionsPluginOptions['onAgentMentionChatClick'];
		showAgentMentionsLabsLozenge?: boolean;
	};
	providers: {
		mentionProvider: Promise<MentionProvider> | undefined;
		profilecardProvider: Promise<ProfilecardProvider> | undefined;
	};
}

export function mentionsPluginOptions({ options, providers }: Props): MentionsPluginOptions {
	return {
		disableOptimisticToolbar: options.disableOptimisticToolbar,
		agentSectionLozenge: options.agentSectionLozenge,
		sanitizePrivateContent: true,
		insertDisplayName: true,
		allowZeroWidthSpaceAfter: true,
		profilecardProvider: providers.profilecardProvider,
		handleMentionsChanged: options.handleMentionsChanged,
		mentionProvider: providers.mentionProvider,
		currentUserId: options.currentUserId,
		enableAgentSectioning: options.enableAgentSectioning,
		showAgentMentionsLabsLozenge: options.showAgentMentionsLabsLozenge,
		getIsRovoPanelOpen: options.getIsRovoPanelOpen,
		onAgentMentionChatClick: options.onAgentMentionChatClick,
	};
}
