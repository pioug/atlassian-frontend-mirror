/**
 * Action Group: browseAgents
 *
 * Registered UI events for the shared Browse Agents modal and its agent cards.
 */
export type BrowseAgentsEventPayload =
	| {
			eventType: 'ui';
			actionSubject: 'button';
			actionSubjectId: 'browseAgentsCloseModalButton';
			action: 'clicked';
			attributes: {
				modalEntrypointSource?: string;
			};
	  }
	| {
			eventType: 'ui';
			actionSubject: 'input';
			actionSubjectId: 'browseAgentsSearchInput';
			action: 'searched';
			attributes: {
				searchValueLength: number;
				viewContext: 'agents-modal' | 'agents-fullscreen';
				category: string;
				interactionSource: string;
				modalEntrypointSource?: string;
			};
	  }
	| {
			eventType: 'ui';
			actionSubject: 'button';
			actionSubjectId: 'viewAgentButton';
			action: 'clicked';
			attributes: {
				agentId: string;
				category: string;
				source: 'agentCard';
				interactionSource: string;
				modalEntrypointSource?: string;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/69243
			eventType: 'ui';
			actionSubject: 'browseAgentModal';
			action: 'viewed';
			attributes: {
				tabId: string;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/93884
			eventType: 'ui';
			actionSubject: 'browseAgentModal';
			action: 'dismissed';
			attributes: {
				touchpointSource: string;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/93883
			eventType: 'ui';
			actionSubject: 'button';
			actionSubjectId: 'agentCard';
			action: 'clicked';
			attributes: {
				agentId: string;
				interactionSource: string;
				category: string;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/69221
			eventType: 'ui';
			actionSubject: 'button';
			actionSubjectId: 'browseAgentsFilterButton';
			action: 'clicked';
			attributes: {
				browseCategory: string;
			};
	  }
	| {
			// https://data-portal.internal.atlassian.com/analytics/registry/99535
			eventType: 'ui';
			actionSubject: 'link';
			actionSubjectId: 'browseAgentsCreateAgentButtonRefresh';
			action: 'clicked';
			attributes: {
				interactionSource: 'browse-agents-fullscreen-header' | 'browse-agents-modal-header';
			};
	  };
