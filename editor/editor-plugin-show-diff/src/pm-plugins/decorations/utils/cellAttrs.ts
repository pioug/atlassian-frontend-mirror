import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { getDiffableAttrNames } from './diffableAttrs';

/**
 * A cell background as it renders: absent, empty and `"null"` — the string agent payloads send for
 * no background — all mean the cell has none.
 */
export const normalizeCellBackground = (background: unknown): string | null =>
	typeof background === 'string' && background !== '' && background !== 'null' ? background : null;

/** Whether two cells render different backgrounds. */
export const isCellBackgroundChanged = (left: PMNode, right: PMNode): boolean =>
	normalizeCellBackground(left.attrs.background) !==
	normalizeCellBackground(right.attrs.background);

/**
 * Whether two cells differ by an attribute that represents a change, such as their background or
 * span, as opposed to only their content.
 */
export const isCellAttrChanged = (left: PMNode, right: PMNode): boolean =>
	(getDiffableAttrNames(left.type.name, left.attrs) ?? []).some((name) =>
		name === 'background'
			? isCellBackgroundChanged(left, right)
			: left.attrs[name] !== right.attrs[name],
	);
