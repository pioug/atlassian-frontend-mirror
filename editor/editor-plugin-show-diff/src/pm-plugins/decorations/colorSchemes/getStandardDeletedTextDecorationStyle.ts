import { fg } from '@atlaskit/platform-feature-flags/fg';

type StandardDeletedTextDecorationStyle =
	| { textDecoration: 'line-through' }
	| { textDecorationLine: 'line-through' };

/**
 * The ADF strike parser recognises the `text-decoration` shorthand when a decorated NodeView is
 * reconciled. Use the visually equivalent longhand for AI suggestion diffs so presentation-only
 * styling cannot be retained as document content.
 */
export const getStandardDeletedTextDecorationStyle = (): StandardDeletedTextDecorationStyle =>
	fg('platform_editor_ai_show_diff_patch_1')
		? { textDecorationLine: 'line-through' }
		: { textDecoration: 'line-through' };
