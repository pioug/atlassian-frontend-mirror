import { snapshot } from '@af/visual-regression';

import SimpleMentionItem from '../../../examples/00-simple-mention-item';
import MentionItem from '../../../examples/01-mention-item';
import ErrorMentionList from '../../../examples/03-error-mention-list';
import SimpleMention from '../../../examples/07-simple-mention';
import SimpleMentionList from '../../../examples/simple-mention-list';

// Simple mention item
snapshot(SimpleMentionItem, {
	featureFlags: {
		'team-avatar-in-mention-picker': [false, true],
	},
});

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
