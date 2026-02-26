import { snapshot } from '@af/visual-regression';

import SimpleMentionItem from '../../../examples/00-simple-mention-item';
import MentionItem from '../../../examples/01-mention-item';
import ErrorMentionList from '../../../examples/03-error-mention-list';
import SimpleMention from '../../../examples/07-simple-mention';
import SimpleMentionList from '../../../examples/simple-mention-list';
import MentionItemWithAgent from '../../../examples/11-mention-item-with-agent';

// Simple mention item
snapshot(SimpleMentionItem);

// Mention item with avatar and details
snapshot(MentionItem);

// Mention list
snapshot(SimpleMentionList, {
	featureFlags: {
		'mentions-migrate-react-dom': [false, true],
	},
});

// Error mention list
snapshot(ErrorMentionList);

// // Simple mention
snapshot(SimpleMention);

snapshot(MentionItemWithAgent, {
	featureFlags: {
		jira_ai_agent_avatar_issue_view_comment_mentions: [true],
	},
});
