import type { Mark } from '@atlaskit/editor-prosemirror/model';

const OPTIONAL_ATTRS = ['title', 'id', 'collection', 'occurrenceKey', '__confluenceMetadata'];

export const toJSON = (
	mark: Mark,
): {
	attrs: Record<string, string>;
	type: string;
} => ({
	type: mark.type.name,
	attrs: Object.keys(mark.attrs).reduce<Record<string, string>>((attrs, key) => {
		if (OPTIONAL_ATTRS.indexOf(key) === -1 || mark.attrs[key] !== null) {
			attrs[key] = mark.attrs[key];
		}
		return attrs;
	}, {}),
});
