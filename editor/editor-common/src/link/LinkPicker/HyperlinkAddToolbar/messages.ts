import { defineMessages } from 'react-intl-next';

export const utilMessages = defineMessages({
	hyperlinkIconIssueLabel: {
		id: 'fabric.editor.headingLink.hyperlinkIconIssueLabel',
		defaultMessage: 'Issue',
		description:
			'Accessible label for the Jira issue icon displayed in the hyperlink add toolbar when users search for or insert a link to a Jira issue.',
	},
	hyperlinkIconBugLabel: {
		id: 'fabric.editor.headingLink.hyperlinkIconBugLabel',
		defaultMessage: 'Bug',
		description:
			'Accessible label for the Jira bug icon displayed in the hyperlink add toolbar when users search for or insert a link to a Jira bug.',
	},
	hyperlinkIconStoryLabel: {
		id: 'fabric.editor.headingLink.hyperlinkIconStoryLabel',
		defaultMessage: 'Story',
		description:
			'Accessible label for the Jira story icon displayed in the hyperlink add toolbar when users search for or insert a link to a Jira story.',
	},
	hyperlinkIconTaskLabel: {
		id: 'fabric.editor.headingLink.hyperlinkIconTaskLabel',
		defaultMessage: 'Task',
		description:
			'Accessible label for the Jira task icon displayed in the hyperlink add toolbar when users search for or insert a link to a Jira task.',
	},
	hyperlinkIconPageLabel: {
		id: 'fabric.editor.headingLink.hyperlinkIconPageLabel',
		defaultMessage: 'Page',
		description:
			'The text is shown as an icon label in the hyperlink toolbar to identify Confluence pages. Displayed next to the page icon when users are linking to Confluence pages in the editor.',
	},
	hyperlinkIconBlogLabel: {
		id: 'fabric.editor.headingLink.hyperlinkIconBlogLabel',
		defaultMessage: 'Blog',
		description:
			'The text is shown as an icon label in the hyperlink toolbar to identify Confluence blog posts. Displayed next to the blog icon when users are linking to Confluence blogs in the editor.',
	},
	hyperlinkIconIssueLabelIssueTermRefresh: {
		id: 'fabric.editor.headingLink.hyperlinkIconIssueLabel.issue-term-refresh',
		defaultMessage: 'Work Item',
		description:
			'Accessible label for the Jira issue icon displayed in the hyperlink add toolbar when users search for or insert a link to a Jira work item. This is the refreshed terminology used instead of "Issue".',
	},
});
