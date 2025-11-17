import { fg } from '@atlaskit/platform-feature-flags';

const isDnDStyleChange = (style: string): boolean => {
	return style.startsWith('anchor-name: --node-anchor');
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
 * Checks if a mutation record represents a style change from Editor's
 * drag and drop feature, which don't cause visual shifts.
 * This should be removed once DnD has been fixed.
 * @param mutation - The mutation record to check
 * @returns boolean indicating if this is a DnD style mutation
 */
function isDnDStyleMutation({
	target,
	attributeName,
	oldValue,
	newValue,
}: {
	target?: Node | null;
	attributeName?: string | null;
	oldValue?: string | undefined | null;
	newValue?: string | undefined | null;
}) {
	if (!fg('platform_editor_exclude_dnd_anchor_name_from_ttvc')) {
		return false;
	}

	if (!(target instanceof Element)) {
		return false;
	}

	return containsDnDMutationInStyle({ attributeName, oldValue, newValue });
}

function containsDnDMutationInStyle({
	attributeName,
	oldValue,
	newValue,
}: {
	attributeName?: string | null;
	oldValue?: string | undefined | null;
	newValue?: string | undefined | null;
}) {
	if (attributeName !== 'style') {
		return false;
	}

	const oldStyles = parseStyleSet(oldValue);
	const newStyles = parseStyleSet(newValue);

	let isDnDMutation = false;

	for (const s of oldStyles ?? []) {
		if (!newStyles?.has(s)) {
			if (!isDnDStyleChange(s)) {
				return false;
			}
			isDnDMutation = true;
		}
	}

	for (const s of newStyles ?? []) {
		if (!oldStyles?.has(s)) {
			if (!isDnDStyleChange(s)) {
				return false;
			}
			isDnDMutation = true;
		}
	}

	return isDnDMutation;
}

export default isDnDStyleMutation;

export { isDnDStyleMutation, containsDnDMutationInStyle };
