import { adfMark } from '@atlaskit/adf-schema-generator';

/**
 * fontSize mark - applies size styling to block-level content
 *
 * This mark is used to apply size styling to entire paragraph nodes,
 * enabling features like "small text" in the full-page editor.
 *
 * @example
 * ```json
 * {
 *   "type": "paragraph",
 *   "marks": [{ "type": "fontSize", "attrs": { "fontSize": "small" }}],
 *   "content": [...]
 * }
 * ```
 */
export const fontSize = adfMark('fontSize').define({
	spanning: false,
	inclusive: false,
	attrs: {
		fontSize: { type: 'enum', values: ['small'] },
	},
});
