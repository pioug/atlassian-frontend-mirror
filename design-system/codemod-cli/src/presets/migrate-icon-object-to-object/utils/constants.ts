/* eslint-disable @repo/internal/fs/filename-pattern-match */

// Entry points
export const OLD_ICON_OBJECT_ENTRY_POINT = '@atlaskit/icon-object';
export const NEW_OBJECT_ENTRY_POINT = '@atlaskit/object';
export const NEW_OBJECT_TILE_ENTRY_POINT = '@atlaskit/object/tile';

/**
 * Mappings for icon-object names that change when migrating to object.
 * Key: old icon-object name (kebab-case)
 * Value: new object name (kebab-case)
 *
 * Use this when the icon name in icon-object doesn't match the object name.
 * For example, 'issue' icon-object becomes 'work-item' object.
 *
 * Icons not listed here will use their original name (converted to PascalCase automatically).
 */
export const ICON_TO_OBJECT_NAME_MAPPINGS: Record<string, string> = {
	issue: 'work-item',
};

// Available icon names (kebab-case) - icons supported in icon-object
export const AVAILABLE_ICON_NAMES = [
	'blog',
	'branch',
	'bug',
	'calendar',
	'changes',
	'code',
	'commit',
	'epic',
	'improvement',
	'incident',
	'issue',
	'new-feature',
	'page',
	'page-live-doc',
	'problem',
	'pull-request',
	'question',
	'story',
	'subtask',
	'task',
	'whiteboard',
];

export const PRINT_SETTINGS = {
	quote: 'single' as const,
	trailingComma: true,
};
