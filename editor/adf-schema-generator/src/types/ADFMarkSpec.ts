import type { ADFMark } from '../adfMark';
import type { TransformerNames } from '../transforms/transformerNames';
import type { ADFAttributes } from './ADFAttribute';
import type { ADFMarkGroup } from './ADFMarkGroup';

export const MarkExcludesAll = '_' as const;
export const MarkExcludesNone = '' as const;

export type ADFMarkSpec = {
	/**
	 * The attributes that the mark can have.
	 */
	attrs?: ADFAttributes;

	/**
	 * https://prosemirror.net/docs/ref/#model.MarkSpec.excludes
	 *
	 * Determines which other marks this mark can coexist with.
	 */
	excludes?:
		| Array<ADFMark<ADFMarkSpec> | ADFMarkGroup>
		| typeof MarkExcludesAll
		| typeof MarkExcludesNone;

	/**
	 * https://prosemirror.net/docs/ref/#model.MarkSpec.group
	 *
	 * The group that the mark belongs to.
	 */
	group?: ADFMarkGroup;

	/**
	 * A list of transformers that should ignore this mark.
	 */
	ignore?: Array<TransformerNames>;

	/**
	 * https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive
	 *
	 * Whether this mark should be active when the cursor is positioned at its end
	 * (or at its start when that is also the start of the parent node). Defaults to true.
	 */
	inclusive?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.MarkSpec.spanning
	 *
	 * Determines whether marks of this type can span multiple adjacent nodes when serialized to DOM/HTML.
	 * Defaults to true.
	 */
	spanning?: boolean;
};
