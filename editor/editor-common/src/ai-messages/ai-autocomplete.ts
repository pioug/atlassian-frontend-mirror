import { defineMessages } from 'react-intl-next';

/**
 * Default keyword lists omit longer phrases when a shorter phrase in the same list already
 * matches as a whole word within them (case-insensitive), e.g. drop `in summary` when `summary`
 * is present.
 */

export const aiAutocompleteMessages: {
	conclusionKeywords: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	nextStepsKeywords: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	summaryKeywords: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	summaryKeywords: {
		id: 'fabric.editor.ai.autocomplete.summary.trigger.keywords.non-final',
		defaultMessage:
			'summary, tldr, tl;dr, tl dr, overview, synopsis, recap, abstract, brief, outline, quick, in short, rundown, review, roundup, highlights, key points, snapshot, at a glance, in essence, takeaways, to summarize, to summarise',
		description:
			'Comma-separated heading phrases that trigger AI autocomplete when the user finishes typing one as a whole token at the cursor. Translators may reorder or localize phrases; keep comma separation.',
	},
	conclusionKeywords: {
		id: 'fabric.editor.ai.autocomplete.conclusion.trigger.keywords.non-final',
		defaultMessage:
			'conclusion, conclusions, findings, results, outcome, outcomes, final thoughts, takeaway, takeaways, verdict, determination, resolution, final analysis, deduction, judgment, decision, culmination, end result, bottom line, final word, closing, to conclude, final notes, learnings, what we learned, overall',
		description:
			'Comma-separated phrases that trigger AI autocomplete for a conclusion-style completion when typed in the last lines of the document. Translators may reorder or localize; keep comma separation.',
	},
	nextStepsKeywords: {
		id: 'fabric.editor.ai.autocomplete.next.steps.trigger.keywords.non-final',
		defaultMessage:
			"recommendations, follow-through, implementation, moving forward, going forward, deliverables, path forward, what is next, way forward, what's next, next steps, priorities, whats next, task list, follow-up, follow up, next step, followup, priority, next up, up next, roadmap, actions, action, tasks, todos, to do, to-do, todo, plan",
		description:
			'Comma-separated phrases that trigger AI autocomplete for a next-steps-style completion when typed in the last lines of the document. Translators may reorder or localize; keep comma separation. Prefer longer phrases before shorter ones that are suffixes.',
	},
});
