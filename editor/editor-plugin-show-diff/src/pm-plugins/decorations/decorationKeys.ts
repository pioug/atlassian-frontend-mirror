/**
 * Shared prefix for every decoration key produced by the show-diff plugin.
 * All keys derive from this, so the full set of plugin decorations can be
 * identified by this single prefix.
 */
export const DIFF_KEY_PREFIX = 'diff';

type DiffDecorationKind = 'inline' | 'block' | 'widget';
type DiffDecorationKeyType = `${typeof DIFF_KEY_PREFIX}-${DiffDecorationKind}`;

/**
 * The kinds of decoration the show-diff plugin produces. Each value is the
 * leading segment of the generated key, so a decoration's kind can be matched
 * with `key?.startsWith(DiffDecorationKey.inline)` etc.
 */
export const DiffDecorationKey: Readonly<Record<DiffDecorationKind, DiffDecorationKeyType>> = {
	inline: `${DIFF_KEY_PREFIX}-inline`,
	block: `${DIFF_KEY_PREFIX}-block`,
	widget: `${DIFF_KEY_PREFIX}-widget`,
};

/**
 * Builds a decoration key in the form `{type}-{active|inactive}`
 * (e.g. `diff-inline-active`).
 */
export const buildDiffDecorationKey = ({
	type,
	isActive,
}: {
	isActive?: boolean;
	type: DiffDecorationKeyType;
}): string => (isActive !== undefined ? `${type}-${isActive ? 'active' : 'inactive'}` : type);
