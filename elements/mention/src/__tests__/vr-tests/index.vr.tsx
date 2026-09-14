import { snapshot } from '@af/visual-regression';

import SimpleMentionItem from '../../../examples/00-simple-mention-item.vr.ap';
import MentionItem from '../../../examples/01-mention-item.vr.ap';
import ErrorMentionList from '../../../examples/03-error-mention-list.vr.ap';
import SimpleMention from '../../../examples/07-simple-mention.vr.ap';
import SimpleMentionList from '../../../examples/simple-mention-list.vr.ap';
import MentionItemWithAgent from '../../../examples/11-mention-item-with-agent.vr.ap';

// Simple mention item
snapshot(SimpleMentionItem);

// Mention item with avatar and details
snapshot(MentionItem);

// Mention list
snapshot(SimpleMentionList);

// Error mention list
snapshot(ErrorMentionList);

// // Simple mention
snapshot(SimpleMention);

snapshot(MentionItemWithAgent, {
	featureFlags: {
		jira_ai_agent_avatar_issue_view_comment_mentions: [true],
		platform_editor_agent_mentions: true,
		platform_editor_agent_mentions_drop_one_fixes: true,
	},
});
