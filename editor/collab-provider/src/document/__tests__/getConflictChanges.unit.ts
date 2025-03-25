import { Step } from '@atlaskit/editor-prosemirror/transform';
import { doc, p, emoji } from '@atlaskit/editor-test-helpers/doc-builder';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ConflictChanges } from '@atlaskit/editor-common/collab';

import { getConflictChanges } from '../getConflictChanges';

import { Editor } from './_utils';

beforeEach(() => {
	jest.useFakeTimers();
});

const setupConflicts = (changes: ConflictChanges) => {
	const deletedJSON = changes.deleted?.map((d) => ({
		from: d.from,
		to: d.to,
		local: d.local.content.toJSON(),
	}));
	const insertedJSON = changes.inserted?.map((d) => ({
		from: d.from,
		to: d.to,
		local: d.local.content.toJSON(),
		remote: d.remote.content.toJSON(),
	}));
	return { changes, deleted: deletedJSON, inserted: insertedJSON };
};

const getAllHighlights = (changes: ConflictChanges, doc: PMNode) => {
	const highlights: object[] = [];
	changes.deleted?.forEach((d) => {
		highlights.push(doc.slice(d.from, d.to).toJSON());
	});

	changes.inserted?.forEach((i) => {
		highlights.push(doc.slice(i.from, i.to).toJSON());
	});
	return highlights;
};

describe('conflicting steps', () => {
	it('basic rebase with remote', () => {
		const defaultDoc = doc(p('This is Sparta{<>}'));

		const editor = new Editor(defaultDoc);
		// Delete Sparta
		editor.delete({ repeat: 6 });

		editor.insert('test here');
		const localSteps = editor.getUnconfirmed();
		expect(editor.getDoc()).toEqualDocument(doc(p('This istest here')));

		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete Sparta
		remoteEditor.delete({ repeat: 6 });

		remoteEditor.insertAsChars('hello world');

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(doc(p('This ishello worldtest here')));
		const { deleted, inserted } = setupConflicts(
			getConflictChanges({ localSteps, remoteSteps: remoteSteps as Step[], tr }),
		);
		expect(deleted).toEqual([]);
		expect(inserted).toEqual([
			{
				from: 8,
				to: 28,
				local: [
					{
						type: 'paragraph',
						attrs: { localId: null },
						content: [
							{
								type: 'text',
								text: 'test here',
							},
						],
					},
				],
				remote: [
					{
						type: 'text',
						text: 'hello world',
					},
				],
			},
		]);
	});

	it('rebase with lost content', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));

		const editor = new Editor(defaultDoc);

		editor.insert(' blah here');
		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete second paragraph
		remoteEditor.delete({ repeat: 15 });

		remoteEditor.insertAsChars('hello world');

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(
			doc(p('This is AFM'), p('hello worldThis is not Sparta')),
		);

		const { deleted, inserted, changes } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: remoteSteps as Step[],
				tr,
			}),
		);

		expect(deleted).toEqual([]);

		expect(inserted).toEqual([
			{
				from: 13,
				to: 25,
				remote: [{ type: 'text', text: 'hello world' }],
				local: [
					{
						type: 'paragraph',
						attrs: { localId: null },
						content: [
							{
								text: ' blah here',
								type: 'text',
							},
						],
					},
				],
			},
		]);
		expect(editor.applyInserted(changes.inserted![0])).toEqualDocument(
			doc(p('This is AFM'), p(' blah hereThis is not Sparta')),
		);
	});

	it('rebase with deleted paragraph', () => {
		const defaultDoc = doc(p('here is some{<>} text'));

		const editor = new Editor(defaultDoc);

		editor.delete({ repeat: 4 });
		editor.insert('another');
		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(doc(p('here is some text{<>}')));

		// Delete second paragraph
		remoteEditor.delete({ repeat: 17 });

		remoteEditor.insertAsChars('elsewhere');

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(doc(p('elsewhere')));

		const { changes, deleted, inserted } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: remoteSteps as Step[],
				tr,
			}),
		);

		expect(deleted).toEqual([]);

		expect(inserted).toEqual([
			{
				from: 0,
				to: 11,
				remote: [{ type: 'text', text: 'elsewhere' }],
				local: [
					{
						type: 'paragraph',
						attrs: { localId: null },
						content: [
							{
								text: 'another',
								type: 'text',
							},
						],
					},
				],
			},
		]);

		expect(editor.applyInserted(changes.inserted![0])).toEqualDocument(doc(p('another')));
	});

	it('multiple conflicts occuring', () => {
		const defaultDoc = doc(p('here is some{<>} text'), p('other text'));

		const editor = new Editor(defaultDoc);

		editor.delete({ repeat: 3 });
		editor.insert('another');
		editor.setSelection(28);
		editor.delete({ repeat: 5 });
		editor.insert('world');
		expect(editor.getDoc()).toEqualDocument(doc(p('here is another text'), p('world text')));

		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete second paragraph
		remoteEditor.setSelection(30);
		remoteEditor.delete({ repeat: 9 });
		remoteEditor.insertAsChars('elsewhere');
		remoteEditor.setSelection(13);
		remoteEditor.delete({ repeat: 3 });
		remoteEditor.insertAsChars('test');
		expect(remoteEditor.getDoc()).toEqualDocument(doc(p('here is test text'), p('elsewhere')));

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(
			doc(p('here is testanother text'), p('elsewhereworld')),
		);

		const { changes, deleted, inserted } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: remoteSteps as Step[],
				tr,
			}),
		);

		expect(deleted).toEqual([]);

		expect(inserted).toEqual([
			{
				from: 9,
				to: 20,
				remote: [{ type: 'text', text: 'test' }],
				local: [
					{
						type: 'paragraph',
						attrs: { localId: null },
						content: [
							{
								text: 'another',
								type: 'text',
							},
						],
					},
				],
			},
			{
				from: 27,
				to: 41,
				remote: [{ type: 'text', text: 'elsew' }],
				local: [
					{
						type: 'paragraph',
						attrs: { localId: null },
						content: [
							{
								text: 'world',
								type: 'text',
							},
						],
					},
				],
			},
		]);

		expect(getAllHighlights(changes, editor.getDoc())).toEqual([
			{
				content: [{ text: 'testanother', type: 'text' }],
			},
			{
				content: [{ text: 'elsewhereworld', type: 'text' }],
			},
		]);
	});

	it('should detect deletions', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));
		const editor = new Editor(defaultDoc);

		// Delete Sparta
		editor.delete({ repeat: 6 });

		editor.insert('test here');
		const localSteps = editor.getUnconfirmed();
		expect(editor.getDoc()).toEqualDocument(
			doc(p('This is AFM'), p('This istest here'), p('This is not Sparta')),
		);
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete paragraph
		remoteEditor.delete({ repeat: 16 });
		remoteEditor.setSelection(1);
		remoteEditor.insertAsChars('here');

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(doc(p('hereThis is AFM'), p('This is not Sparta')));
		const { deleted, inserted } = setupConflicts(
			getConflictChanges({ localSteps, remoteSteps: remoteSteps as Step[], tr }),
		);
		expect(deleted).toEqual([
			{
				from: 17,
				to: 18,
				local: [{ text: 'test here', type: 'text' }],
			},
		]);
		expect(inserted).toEqual([]);
	});

	it('should detect multiple deletions', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));
		const editor = new Editor(defaultDoc);

		// Delete Sparta and replace
		editor.delete({ repeat: 6 });
		editor.insert('test here');

		// Insert another change in the document at the end
		editor.setSelection(editor.getDoc().nodeSize - 3);
		editor.delete();
		editor.insert(' over here');

		const localSteps = editor.getUnconfirmed();
		expect(editor.getDoc()).toEqualDocument(
			doc(p('This is AFM'), p('This istest here'), p('This is not Spar over here')),
		);
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete paragraph
		remoteEditor.delete({ repeat: 16 });
		remoteEditor.setSelection(1);
		remoteEditor.insertAsChars('here');

		// Delete the last paragraph
		remoteEditor.setSelection(remoteEditor.getDoc().nodeSize - 2);
		remoteEditor.delete({ repeat: 19 });
		expect(remoteEditor.getDoc()).toEqualDocument(doc(p('hereThis is AFM')));

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(doc(p('hereThis is AFM')));
		const { deleted, inserted } = setupConflicts(
			getConflictChanges({ localSteps, remoteSteps: remoteSteps as Step[], tr }),
		);
		expect(deleted).toEqual([
			{
				from: 17,
				to: 17,
				local: [{ text: 'test here', type: 'text' }],
			},
			{
				from: 17,
				local: [
					{
						text: ' over here',
						type: 'text',
					},
				],
				to: 17,
			},
		]);
		expect(inserted).toEqual([]);
	});

	it('should detect multiple deletions (with inline nodes)', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));
		const editor = new Editor(defaultDoc);

		// Delete Sparta and replace
		editor.delete({ repeat: 6 }).insert('test ').delete().insertEmoji().insert('here');

		// Insert another change in the document at the end
		editor
			.setSelection(editor.getDoc().nodeSize - 3)
			.delete()
			.insert(' over here');

		const localSteps = editor.getUnconfirmed();
		expect(editor.getDoc()).toEqualDocument(
			doc(
				p('This is AFM'),
				p('This istes', emoji({ shortName: ':man_facepalming:', text: '🤦‍♂️' })(), 'here'),
				p('This is not Spar over here'),
			),
		);
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete paragraph
		remoteEditor.delete({ repeat: 16 });
		remoteEditor.setSelection(1);
		remoteEditor.insertAsChars('here');

		// Delete the last paragraph
		remoteEditor.setSelection(remoteEditor.getDoc().nodeSize - 2);
		remoteEditor.delete({ repeat: 19 });
		expect(remoteEditor.getDoc()).toEqualDocument(doc(p('hereThis is AFM')));

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(doc(p('hereThis is AFM')));
		const { changes, deleted, inserted } = setupConflicts(
			getConflictChanges({ localSteps, remoteSteps: remoteSteps as Step[], tr }),
		);
		expect(deleted).toEqual([
			{
				from: 17,
				to: 17,
				local: [
					{
						text: 'tes',
						type: 'text',
					},
					{
						attrs: {
							id: '',
							shortName: ':man_facepalming:',
							text: '🤦‍♂️',
						},
						type: 'emoji',
					},
					{
						text: 'here',
						type: 'text',
					},
				],
			},
			{
				from: 17,
				local: [
					{
						text: ' over here',
						type: 'text',
					},
				],
				to: 17,
			},
		]);
		expect(inserted).toEqual([]);

		expect(editor.applyDeleted(changes.deleted[0])).toEqualDocument(
			doc(
				p('hereThis is AFM'),
				p('tes', emoji({ shortName: ':man_facepalming:', text: '🤦‍♂️' })(), 'here'),
			),
		);
		expect(editor.applyDeleted(changes.deleted[1])).toEqualDocument(
			doc(p('hereThis is AFM'), p(' over here')),
		);
	});

	it('should detect deletions and insertions at the same time', () => {
		const defaultDoc = doc(
			p('This is AFM'),
			p('This is Sparta{<>}'),
			p('This is not Sparta'),
			p('This is not Sparta'),
		);
		const editor = new Editor(defaultDoc);

		// Delete Sparta and replace
		editor.delete({ repeat: 6 }).insert('test ').delete().insertEmoji().insert('here');

		// Insert another change in the document at the end
		editor
			.setSelection(editor.getDoc().nodeSize - 3)
			.delete()
			.insert(' over here');

		const localSteps = editor.getUnconfirmed();
		expect(editor.getDoc()).toEqualDocument(
			doc(
				p('This is AFM'),
				p('This istes', emoji({ shortName: ':man_facepalming:', text: '🤦‍♂️' })(), 'here'),
				p('This is not Sparta'),
				p('This is not Spar over here'),
			),
		);
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete paragraph
		remoteEditor.delete({ repeat: 16 }).insertAsChars('wow ').setSelection(1).insertAsChars('here');

		// Delete the last paragraph
		remoteEditor.setSelection(remoteEditor.getDoc().nodeSize - 2);
		remoteEditor.delete({ repeat: 19 });
		expect(remoteEditor.getDoc()).toEqualDocument(
			doc(p('hereThis is AFM'), p('wow This is not Sparta')),
		);

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(doc(p('hereThis is AFM'), p('wow This is not Sparta')));
		const { changes, deleted, inserted } = setupConflicts(
			getConflictChanges({ localSteps, remoteSteps: remoteSteps as Step[], tr }),
		);
		expect(deleted).toEqual([
			{
				from: 41,
				local: [
					{
						text: ' over here',
						type: 'text',
					},
				],
				to: 41,
			},
		]);

		expect(inserted).toEqual([
			{
				from: 17,
				local: [
					{
						attrs: {
							localId: null,
						},
						content: [
							{
								text: 'tes',
								type: 'text',
							},
							{
								attrs: {
									id: '',
									shortName: ':man_facepalming:',
									text: '🤦‍♂️',
								},
								type: 'emoji',
							},
							{
								text: 'here',
								type: 'text',
							},
						],
						type: 'paragraph',
					},
				],
				remote: [
					{
						text: 'wow ',
						type: 'text',
					},
				],
				to: 22,
			},
		]);

		expect(editor.applyDeleted(changes.deleted[0])).toEqualDocument(
			doc(p('hereThis is AFM'), p('wow This is not Sparta'), p(' over here')),
		);
		expect(editor.applyDeleted(changes.inserted[0])).toEqualDocument(
			doc(
				p('hereThis is AFM'),
				p('tes', emoji({ shortName: ':man_facepalming:', text: '🤦‍♂️' })(), 'here'),
				p('wow This is not Sparta'),
			),
		);
	});

	it('no conflicts (no local changes)', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));

		const editor = new Editor(defaultDoc);

		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		// Delete second paragraph
		remoteEditor.delete({ repeat: 15 });

		remoteEditor.insertAsChars('hello world');

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(
			doc(p('This is AFM'), p('hello worldThis is not Sparta')),
		);

		const { deleted, inserted } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: remoteSteps as Step[],
				tr,
			}),
		);

		expect({
			inserted,
			deleted,
		}).toStrictEqual({
			deleted: [],
			inserted: [],
		});
	});

	it('no conflicts (no remote changes)', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));

		const editor = new Editor(defaultDoc);

		editor.insert('hi');
		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(
			doc(p('This is AFM'), p('This is Spartahi'), p('This is not Sparta')),
		);

		const { deleted, inserted } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: (remoteSteps as Step[]) ?? [],
				tr,
			}),
		);

		expect({
			inserted,
			deleted,
		}).toStrictEqual({
			deleted: [],
			inserted: [],
		});
	});

	it('no conflicts (changes in separate paragraphs)', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));

		const editor = new Editor(defaultDoc);

		editor.insert('hi');
		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(
			doc(p('This is AFM'), p('This is Sparta'), p('This is not Sparta{<>}')),
		);
		remoteEditor.insertAsChars(' hello');

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(
			doc(p('This is AFM'), p('This is Spartahi'), p('This is not Sparta hello')),
		);

		const { deleted, inserted } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: (remoteSteps as Step[]) ?? [],
				tr,
			}),
		);

		expect({
			inserted,
			deleted,
		}).toStrictEqual({
			deleted: [],
			inserted: [],
		});
	});

	it('no conflicts (changes in separate parts of a paragraph)', () => {
		const defaultDoc = doc(p('This is AFM'), p('This is Sparta{<>}'), p('This is not Sparta'));

		const editor = new Editor(defaultDoc);

		editor.insert('hi');
		editor.setSelection(editor.getTr().doc.nodeSize - 2);
		editor.delete();
		editor.insert('here');

		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(
			doc(p('This is AFM'), p('{<>}This is Sparta'), p('This is not Spartahere')),
		);
		remoteEditor.insertAsChars('hello This really is sparta with lots of characters');
		remoteEditor.setSelection(1);
		remoteEditor.insertAsChars('wow');

		const remoteSteps = remoteEditor.getSteps();

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(
			doc(
				p('wowThis is AFM'),
				p('hello This really is sparta with lots of charactersThis is Spartahi'),
				p('This is not Sparthere'),
			),
		);

		const { deleted, inserted } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: (remoteSteps as Step[]) ?? [],
				tr,
			}),
		);

		expect({
			inserted,
			deleted,
		}).toStrictEqual({
			deleted: [],
			inserted: [],
		});
	});

	it('should have conflicts if replaces two words', () => {
		const defaultDoc = doc(p('We are typing in a live doc {<}somethingothing{>}! thereere'));

		const editor = new Editor(defaultDoc);

		editor.insert('something');
		editor.setSelection(editor.getTr().doc.nodeSize - 2);
		editor.delete({ repeat: 8 });
		editor.insert('there');

		const localSteps = editor.getUnconfirmed();
		const tr = editor.getTr();

		const remoteEditor = new Editor(defaultDoc);
		remoteEditor.insertAsChars('nothing');
		remoteEditor.setSelection(remoteEditor.getTr().doc.nodeSize - 2);
		remoteEditor.delete({ repeat: 8 });
		remoteEditor.insertAsChars('here');
		const remoteSteps = remoteEditor.getSteps();

		expect(editor.getDoc()).toEqualDocument(doc(p('We are typing in a live doc something! there')));
		expect(remoteEditor.getDoc()).toEqualDocument(
			doc(p('We are typing in a live doc nothing! here')),
		);

		editor.rebaseWithRemoteSteps(remoteSteps);
		expect(editor.getDoc()).toEqualDocument(
			doc(p('We are typing in a live doc somethingothing! herethere')),
		);

		const { changes, deleted, inserted } = setupConflicts(
			getConflictChanges({
				localSteps,
				remoteSteps: (remoteSteps as Step[]) ?? [],
				tr,
			}),
		);

		expect({
			inserted,
			deleted,
		}).toEqual({
			deleted: [],
			inserted: [
				expect.objectContaining({
					from: 29,
					to: 44,
				}),
				expect.objectContaining({
					from: 46,
					to: 55,
				}),
			],
		});

		expect(getAllHighlights(changes, editor.getDoc())).toEqual([
			{
				content: [{ text: 'somethingothing', type: 'text' }],
			},
			{
				content: [{ text: 'herethere', type: 'text' }],
			},
		]);
	});
});
