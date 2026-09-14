import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Matches only the editor drag and drop anchors. This is the pre-gate behaviour.
 */
const isDnDAnchorNameDeclaration = (declaration: string): boolean => {
	return declaration.startsWith('anchor-name: --node-anchor');
};

/**
 * Matches any `anchor-name` declaration.
 *
 * `anchor-name` (CSS Anchor Positioning) only names an element so that _other_
 * elements can position themselves against it. It never changes how the named
 * element itself renders, so adding or removing it is never a visual change.
 *
 * `@atlaskit/top-layer` writes `anchor-name` onto a popover's trigger as soon as
 * the popover host element exists, which for `Popover`-based consumers is first
 * open (for example, hovering an `@atlaskit/tooltip` trigger). Without this
 * exclusion that write is recorded as a repaint of the trigger at hover time,
 * which shifts TTVC in sessions where a user hovers a trigger before the page
 * has settled. See COPPER-1736.
 */
const isAnyAnchorNameDeclaration = (declaration: string): boolean => {
	return declaration.startsWith('anchor-name:');
};

const parseStyleSet = (style?: string | null | undefined): Set<string> | null => {
	if (!style) {
		return null;
	}

	const set = new Set<string>();

	for (const part of style.split(';')) {
		const t = part.trim();
		if (t) {
			set.add(t);
		}
	}

	return set;
};

/**
 * Checks if a mutation record represents a `style` change that consists only
 * of `anchor-name` declarations being added or removed.
 *
 * Without `platform_ufo_exclude_anchor_name_from_ttvc` this is limited to the
 * editor's drag and drop anchors (`--node-anchor…`), which is where the check
 * originated. With the gate on, every `anchor-name` is treated as non-visual,
 * because the property never affects the rendering of the element it is set on.
 *
 * @param mutation - The mutation record to check
 * @returns boolean indicating if this is an anchor-name-only style mutation
 */
function isAnchorNameStyleMutation({
	target,
	attributeName,
	oldValue,
	newValue,
}: {
	target?: Node | null;
	attributeName?: string | null;
	oldValue?: string | undefined | null;
	newValue?: string | undefined | null;
}): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	return containsAnchorNameMutationInStyle({ attributeName, oldValue, newValue });
}

function containsAnchorNameMutationInStyle({
	attributeName,
	oldValue,
	newValue,
}: {
	attributeName?: string | null;
	oldValue?: string | undefined | null;
	newValue?: string | undefined | null;
}): boolean {
	if (attributeName !== 'style') {
		return false;
	}

	// Resolved once per mutation rather than once per declaration: this runs
	// inside the MutationObserver callback.
	const isIgnoredDeclaration = fg('platform_ufo_exclude_anchor_name_from_ttvc')
		? isAnyAnchorNameDeclaration
		: isDnDAnchorNameDeclaration;

	const oldStyles = parseStyleSet(oldValue);
	const newStyles = parseStyleSet(newValue);

	let isAnchorNameMutation = false;

	for (const s of oldStyles ?? []) {
		if (!newStyles?.has(s)) {
			if (!isIgnoredDeclaration(s)) {
				return false;
			}
			isAnchorNameMutation = true;
		}
	}

	for (const s of newStyles ?? []) {
		if (!oldStyles?.has(s)) {
			if (!isIgnoredDeclaration(s)) {
				return false;
			}
			isAnchorNameMutation = true;
		}
	}

	return isAnchorNameMutation;
}

export default isAnchorNameStyleMutation;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export { isAnchorNameStyleMutation, containsAnchorNameMutationInStyle };
