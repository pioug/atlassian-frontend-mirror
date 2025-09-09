/* eslint-disable @repo/internal/fs/filename-pattern-match */

// Entry points
export const OLD_ICON_OBJECT_ENTRY_POINT = '@atlaskit/icon-object';
export const NEW_OBJECT_ENTRY_POINT = '@atlaskit/object';
export const NEW_OBJECT_TILE_ENTRY_POINT = '@atlaskit/object/tile';

// Icon name mappings from kebab-case to PascalCase
export const ICON_NAME_MAPPINGS: Record<string, string> = {
	blog: 'Blog',
	branch: 'Branch',
	bug: 'Bug',
	calendar: 'Calendar',
	changes: 'Changes',
	code: 'Code',
	commit: 'Commit',
	epic: 'Epic',
	improvement: 'Improvement',
	incident: 'Incident',
	issue: 'Issue',
	'new-feature': 'NewFeature',
	page: 'Page',
	'page-live-doc': 'PageLiveDoc',
	problem: 'Problem',
	'pull-request': 'PullRequest',
	question: 'Question',
	story: 'Story',
	subtask: 'Subtask',
	task: 'Task',
	whiteboard: 'Whiteboard',
};

// Available icon names (kebab-case)
export const AVAILABLE_ICON_NAMES = Object.keys(ICON_NAME_MAPPINGS);

export const PRINT_SETTINGS = {
	quote: 'single' as const,
	trailingComma: true,
};
