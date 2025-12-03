import React from 'react';

import { MentionItem } from '../src/item';
import { generateMentionItem, onSelection, sampleAvatarUrl as avatarUrl } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

export default function Example() {
	const agentMention = {
		// SSR workaround Avatar not 1:1 between server and client (rest to avatarUrl when fixed)
		avatarUrl: typeof jest === 'undefined' ? avatarUrl : undefined,
		id: 'agent-123',
		name: 'AI Agent',
		mentionName: 'ai-agent',
		appType: 'agent',
		presence: {
			status: 'online',
		},
		accessLevel: 'SITE',
	};

	const regularMention = {
		avatarUrl: typeof jest === 'undefined' ? avatarUrl : undefined,
		id: 'user-456',
		name: 'Regular User',
		mentionName: 'regular-user',
		presence: {
			status: 'online',
		},
		accessLevel: 'SITE',
	};

	const description =
		'Agent mention (appType="agent") and regular user mention - agent shows hexagon avatar when jira_ai_agent_avatar_issue_view_comment_mentions feature gate is enabled';
	const component = (
		<IntlProvider locale="en">
			<div data-testid="vr-tested">
				<MentionItem mention={agentMention} onSelection={onSelection} />
				<MentionItem mention={regularMention} onSelection={onSelection} />
			</div>
		</IntlProvider>
	);

	return generateMentionItem(component, description);
}
