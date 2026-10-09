import { Schema } from '@atlaskit/editor-prosemirror/model';

import { resolveAnnotatableTargetFromLocalId } from '../../resolve-annotatable-target';

/**
 * A minimal, controlled schema so we can exercise every branch of the shared "Core rule"
 * deterministically. This is intentionally IDENTICAL to the schema used by the editor's
 * `resolveAnnotatableTargetFromLocalId` test
 * (`editor-plugin-annotation-tests/src/__tests__/jest/resolve-annotatable-target.ts`) so the two
 * implementations can be shown to behave identically for the media / block case.
 *
 * - `container`  -> allows the annotation mark (accepts via `allowsMarkType`)
 * - `media`      -> disallows all marks (accepts only via `isSupportedBlockNode` when in the list)
 * - `mediaSingle`-> disallows all marks (accepts via the `mediaSingle` -> `media` special case)
 * - `widget`     -> disallows all marks and is never a supported block node (never accepts)
 * - `doc`        -> disallows all marks (never accepts)
 */
const schema = new Schema({
	nodes: {
		doc: { content: 'block+', marks: '' },
		container: {
			group: 'block',
			content: 'block*',
			marks: 'annotation',
			attrs: { localId: { default: null } },
			toDOM: () => ['div', 0],
		},
		media: {
			group: 'block',
			marks: '',
			attrs: { localId: { default: null }, id: { default: null } },
			toDOM: () => ['div'],
		},
		mediaSingle: {
			group: 'block',
			marks: '',
			attrs: { localId: { default: null } },
			toDOM: () => ['div'],
		},
		widget: {
			group: 'block',
			marks: '',
			attrs: { localId: { default: null } },
			toDOM: () => ['div'],
		},
		text: { group: 'inline' },
	},
	marks: {
		annotation: {
			attrs: { id: { default: '' }, annotationType: { default: '' } },
			toDOM: () => ['span', 0],
		},
	},
});

describe('renderer resolveAnnotatableTargetFromLocalId', () => {
	it('resolves a media node directly when it is a supported block node (media localId)', () => {
		const mediaNode = schema.nodes.media.createChecked({ localId: 'media-1', id: 'file-1' });
		const doc = schema.nodes.doc.createChecked({}, [mediaNode]);

		const result = resolveAnnotatableTargetFromLocalId(doc, 'media-1', {
			supportedBlockNodes: ['media'],
		});

		expect(result).toBeDefined();
		expect(result?.node.type.name).toBe('media');
		// media is the first child of the doc, so the position before it is 0
		expect(result?.pos).toBe(0);
	});

	it('resolves a mediaSingle via the mediaSingle -> media special case', () => {
		const mediaSingleNode = schema.nodes.mediaSingle.createChecked({ localId: 'ms-1' });
		const doc = schema.nodes.doc.createChecked({}, [mediaSingleNode]);

		const result = resolveAnnotatableTargetFromLocalId(doc, 'ms-1', {
			supportedBlockNodes: ['media'],
		});

		expect(result).toBeDefined();
		expect(result?.node.type.name).toBe('mediaSingle');
		expect(result?.pos).toBe(0);
	});

	it('climbs to the closest accepting ancestor when the found node does not accept', () => {
		const widget = schema.nodes.widget.createChecked({ localId: 'w-1' });
		const container = schema.nodes.container.createChecked({ localId: 'c-1' }, [widget]);
		const doc = schema.nodes.doc.createChecked({}, [container]);

		// The widget does not accept (no marks, not a supported block node), but its ancestor
		// `container` allows the annotation mark.
		const result = resolveAnnotatableTargetFromLocalId(doc, 'w-1', {
			supportedBlockNodes: [],
		});

		expect(result).toBeDefined();
		expect(result?.node.type.name).toBe('container');
		expect(result?.pos).toBe(0);
	});

	it('returns undefined for an unknown localId', () => {
		const mediaNode = schema.nodes.media.createChecked({ localId: 'media-1' });
		const doc = schema.nodes.doc.createChecked({}, [mediaNode]);

		const result = resolveAnnotatableTargetFromLocalId(doc, 'does-not-exist', {
			supportedBlockNodes: ['media'],
		});

		expect(result).toBeUndefined();
	});

	it('returns undefined when neither the node nor any ancestor accepts', () => {
		const widget = schema.nodes.widget.createChecked({ localId: 'w-1' });
		const doc = schema.nodes.doc.createChecked({}, [widget]);

		// widget rejects, and its only ancestor (doc) also rejects.
		const result = resolveAnnotatableTargetFromLocalId(doc, 'w-1', {
			supportedBlockNodes: [],
		});

		expect(result).toBeUndefined();
	});
});

describe('renderer block node parity with the editor predicate', () => {
	// The editor predicate (`editor-plugin-annotation/src/pm-plugins/utils.ts` ->
	// `isSupportedBlockNode`) accepts a node whose type name is in supportedBlockNodes, OR a
	// mediaSingle when 'media' is in the list. These assertions pin the same semantics.
	const resolve = (localId: string, supportedBlockNodes?: string[]) => {
		const doc = schema.nodes.doc.createChecked({}, [
			schema.nodes.media.createChecked({ localId: 'media-1', id: 'file-1' }),
			schema.nodes.mediaSingle.createChecked({ localId: 'ms-1' }),
			schema.nodes.widget.createChecked({ localId: 'w-1' }),
		]);
		return resolveAnnotatableTargetFromLocalId(doc, localId, { supportedBlockNodes });
	};

	it('accepts media only when media is in the supported list', () => {
		expect(resolve('media-1', ['media'])?.node.type.name).toBe('media');
		expect(resolve('media-1', [])).toBeUndefined();
		expect(resolve('media-1')).toBeUndefined();
	});

	it('accepts mediaSingle via the mediaSingle -> media mapping', () => {
		expect(resolve('ms-1', ['media'])?.node.type.name).toBe('mediaSingle');
		expect(resolve('ms-1', [])).toBeUndefined();
	});

	it('never accepts a node that is not in the supported list', () => {
		expect(resolve('w-1', ['media'])).toBeUndefined();
	});
});
