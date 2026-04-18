import { adfMark, type ADFMark, type ADFMarkSpec } from '@atlaskit/adf-schema-generator';

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
export const fontSize: ADFMark<ADFMarkSpec> = adfMark('fontSize').define({
	attrs: {
		fontSize: { type: 'enum', values: ['small'] },
	},
	stage0: true,
});
