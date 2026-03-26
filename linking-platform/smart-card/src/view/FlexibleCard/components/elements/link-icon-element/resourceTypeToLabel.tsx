const excludedResourceTypes = ['0', 'unknown', 'unsupported', 'REDACTED'];

const manualMapping: Record<string, string> = {
	jswBoard: 'Jira Software Board',
	calendarJsw: 'Jira Software Calendar',
	kbArticle: 'Knowledge Base Article',
	pull: 'Pull Request',
	repo: 'Repository',
};

/**
 * Splits a resolver `resourceType` token into human-oriented words.
 * Prefers kebab-case (`-`) when present; otherwise splits camelCase / PascalCase.
 */
function splitIntoWords(resourceType: string): string[] {
	if (resourceType.includes('-')) {
		return resourceType
			.split('-')
			.map((w) => w.trim())
			.filter(Boolean);
	}

	const spaced = resourceType
		.replace(/([a-z\d])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

	return spaced.split(/\s+/).filter(Boolean);
}

function titleCaseWord(word: string): string {
	if (!word) {
		return word;
	}
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function resourceTypeToLabel(resourceType?: string): string | undefined {
	const trimmed = resourceType?.trim();
	if (!trimmed) {
		return undefined;
	}

	if (excludedResourceTypes.includes(trimmed)) {
		return undefined;
	}

	const manual = manualMapping[trimmed];
	if (manual !== undefined) {
		return manual;
	}

	const words = splitIntoWords(trimmed);
	if (words.length === 0) {
		return undefined;
	}

	return words.map(titleCaseWord).join(' ');
}

// Following are unique resourceType values for the past week (at the the time of writing) for reference:
// page
// issue
// 0
// (none)
// unknown
// file
// space
// message
// jswBoard
// video
// card
// project
// board
// repository
// whiteboard
// channel
// pull-request
// mergeRequest
// database
// pullRequest
// singlePortalPage
// folder
// dashboard
// requestCreateForm
// commit
// jql
// blog
// version
// backlog
// undefinedLink
// branch
// report
// planTimeline
// sharepointFile
// comment
// roadmap
// idea
// case
// opportunity
// account
// list
// issues
// view
// workItem
// link
// block
// kbArticle
// form
// summary
// task
// search
// visitor
// public-link
// user
// playlist
// prototype
// deal
// screen
// pipeline
// contact
// incident
// sheet
// featureFlag
// release
// switcheroo-flag
// single-calendar
// repo
// formBuilder
// proformaForm
// object
// tiny
// document
// sharedFile
// campaign
// table
// compassComponent
// timeline
// boardInvite
// action
// embed
// objectType
// calendar
// calendarJsw
// publishedView
// template
// gist
// recording
// plan
// planDependencies
// epic
// oneDriveFile
// chart
// capability
// artboard
// planCalendar
// planSummary
// projectTeamTag
// planProgram
// compassComponentSearchQuery
// feature
// workspace
// company
// insight
// customer
// Page
// schema
// dependency
// note
// article
// snippet
// tag
// goal
// security
// collaborationGroup
// envelope
// code
// boardView
// compassScorecard
// invoice
// theme
// customWorkspaceView
// risk
// reel
// deployments
// objective
// ask
// compassMetricDefinition
// compassComponentAnnouncement
// portals
// asks
// breadcrumbChart
// Chart
// slide
// unsupported
// remote-link
// pull
// REDACTED
// compassComponentScorecard
// forms
// sante
// zoom
