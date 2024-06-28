import type { DocBuilder } from '@atlaskit/editor-common/types';
import {
	closestElement,
	dedupe,
	isEmptyNode,
	isSelectionInsideLastNodeInDocument,
	shallowEqual,
} from '@atlaskit/editor-common/utils';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	blockquote,
	code_block,
	decisionItem,
	decisionList,
	doc,
	h1,
	li,
	media,
	mediaGroup,
	mediaSingle,
	ol,
	p,
	panel,
	taskItem,
	taskList,
	ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';

describe('@atlaskit/editore-core/utils', () => {
	const createEditor = createEditorFactory();

	const editor = (doc: DocBuilder) =>
		createEditor({
			doc,
			editorProps: {
				media: {
					allowMediaSingle: true,
				},
				allowPanel: true,
				allowTasksAndDecisions: true,
				mentionProvider: Promise.resolve(new MockMentionResource({})),
			},
		});

	describe('#closest', () => {
		it('return first parentNode using query selector', () => {
			const divSecondary = document.createElement('div');
			divSecondary.setAttribute('id', 'secondary');

			const div = document.createElement('div');
			div.setAttribute('id', 'primary');
			div.appendChild(divSecondary);
			document.body.appendChild(div);

			const result = closestElement(divSecondary, '#primary');
			expect(result).toEqual(div);
			div.remove();
		});
	});

	describe('#isEmptyNode', () => {
		const { editorView } = editor(doc(p('')));
		const checkEmptyNode = (node: (schema: Schema<any>) => Node) =>
			isEmptyNode(editorView.state.schema)(node(editorView.state.schema));

		it('should return true for empty paragraph', () => {
			expect(checkEmptyNode(p())).toBeTruthy();
		});
		it('should return false for non-empty paragraph', () => {
			expect(checkEmptyNode(p('x'))).toBeFalsy();
		});
		it('should return false for invisible content', () => {
			expect(checkEmptyNode(p('\u200c'))).toBeFalsy();
		});

		it('should return true for empty codeBlock', () => {
			expect(checkEmptyNode(code_block()())).toBeTruthy();
		});
		it('should return false for non-empty codeBlock', () => {
			expect(checkEmptyNode(code_block()('var x = 1;'))).toBeFalsy();
		});

		it('should return true for empty heading', () => {
			expect(checkEmptyNode(h1())).toBeTruthy();
		});
		it('should return false for non-empty heading', () => {
			expect(checkEmptyNode(h1('Hello!'))).toBeFalsy();
		});

		it('should return true for empty blockquote', () => {
			expect(checkEmptyNode(blockquote(p()))).toBeTruthy();
		});
		it('should return false for non-empty blockquote', () => {
			expect(checkEmptyNode(blockquote(p('Hello! - A')))).toBeFalsy();
		});

		it('should return true for empty panel', () => {
			expect(checkEmptyNode(panel()(p('')))).toBeTruthy();
		});
		it('should return false for non-empty panel', () => {
			expect(checkEmptyNode(panel()(p('Hello! - A')))).toBeFalsy();
		});

		it('should return true for empty unordered list', () => {
			expect(checkEmptyNode(ul(li(p())))).toBeTruthy();
		});
		it('should return false for non-empty unordered', () => {
			expect(checkEmptyNode(ul(li(p('A'))))).toBeFalsy();
		});

		it('should return true for empty ordered list', () => {
			expect(checkEmptyNode(ol()(li(p())))).toBeTruthy();
		});
		it('should return false for non-empty ordered', () => {
			expect(checkEmptyNode(ol()(li(p('1'))))).toBeFalsy();
		});

		it('should return true for empty task list', () => {
			expect(checkEmptyNode(taskList()(taskItem()('')))).toBeTruthy();
		});
		it('should return false for non-empty task list', () => {
			expect(checkEmptyNode(taskList()(taskItem()('do it!')))).toBeFalsy();
		});

		it('should return true for empty decision list', () => {
			expect(checkEmptyNode(decisionList()(decisionItem()('')))).toBeTruthy();
		});
		it('should return false for non-empty decision list', () => {
			expect(checkEmptyNode(decisionList()(decisionItem()('done!')))).toBeFalsy();
		});

		it('should return false for any mediaGroup', () => {
			expect(
				checkEmptyNode(mediaGroup(media({ id: '123', type: 'file', collection: 'test' })())),
			).toBeFalsy();
		});
		it('should return false for any mediaSingle', () => {
			expect(
				checkEmptyNode(mediaSingle()(media({ id: '123', type: 'file', collection: 'test' })())),
			).toBeFalsy();
		});

		it('should return true for empty doc', () => {
			expect(checkEmptyNode(doc(p('')))).toBeTruthy();
		});
		it('should return true for empty doc with empty panel', () => {
			expect(checkEmptyNode(doc(panel()(p(''))))).toBeTruthy();
		});
		it('should return true for empty doc with empty heading', () => {
			expect(checkEmptyNode(doc(panel()(h1())))).toBeTruthy();
		});
		it('should return true for empty doc with multiple empty blocks', () => {
			expect(checkEmptyNode(doc(panel()(p('')), h1(), code_block()(), ul(li(p('')))))).toBeTruthy();
		});

		it('should return false for non-empty doc', () => {
			expect(checkEmptyNode(doc(p('hello')))).toBeFalsy();
		});
		it('should return false for non-empty doc', () => {
			expect(checkEmptyNode(doc(p(''), h1('Hey!')))).toBeFalsy();
		});
		it('should return false for non-empty doc with multiple empty blocks', () => {
			expect(
				checkEmptyNode(doc(p('?'), panel()(p('')), h1(), code_block()(), ul(li(p())))),
			).toBeFalsy();
		});

		it('should throw for unknown nodes', () => {
			expect(
				checkEmptyNode(
					(() =>
						({
							type: {
								name: 'unknown',
							},
						}) as any) as any,
				),
			).toBeTruthy();
		});
	});

	describe('#dedupe', () => {
		it('should always return a new list', () => {
			const l1: Array<string> = [];
			const l2: Array<string> = ['a'];
			const l3: Array<string> = ['a', 'a'];
			expect(dedupe(l1) !== l1).toBeTruthy();
			expect(dedupe(l2) !== l2).toBeTruthy();
			expect(dedupe(l3) !== l3).toBeTruthy();
			expect(l3.length).toEqual(2);
		});

		it('should dedupe string', () => {
			const l = ['a', 'c', 'a', 'b'];
			expect(dedupe(l)).toEqual(['a', 'c', 'b']);
		});

		it('should dedupe numbers', () => {
			const l = [1, 2, 5, 6, 3, 23, 1, 6, 2];
			expect(dedupe(l)).toEqual([1, 2, 5, 6, 3, 23]);
		});

		it('should dedupe objects', () => {
			const o1 = {};
			const o2 = {};
			const l = [o1, o1, o2, o2];
			expect(dedupe(l)).toEqual([o1, o2]);
		});

		it('should dedupe list using an iteratee', () => {
			const l = [
				{ item: 'Activity Stream', keywords: ['gadget'] },
				{ item: 'Activity Stream', keywords: ['gadget'] },
				{ item: 'Agile Wallboard Gadget', keywords: ['gadget'] },
				{ item: 'Assigned to Me', keywords: ['gadget'] },
				{ item: 'Attachments', keywords: ['attachments'] },
				{ item: 'Average Age Chart', keywords: ['gadget'] },
				{ item: 'Average Number of Times in Status', keywords: ['gadget'] },
				{ item: 'Average Time in Status', keywords: ['gadget'] },
				{
					item: 'Better Code Block',
					keywords: ['paste-code-macro', 'codebetter', 'bettercode', 'bcode'],
				},
				{
					item: 'Blog Posts',
					keywords: ['blog-posts', 'news', 'blogs', 'blogposts', 'blogpost', 'blog', 'blog-post'],
				},
				{
					item: 'Better Code Block',
					keywords: ['different'],
				},
			];

			const deduped = [
				{ item: 'Activity Stream', keywords: ['gadget'] },
				{ item: 'Agile Wallboard Gadget', keywords: ['gadget'] },
				{ item: 'Assigned to Me', keywords: ['gadget'] },
				{ item: 'Attachments', keywords: ['attachments'] },
				{ item: 'Average Age Chart', keywords: ['gadget'] },
				{ item: 'Average Number of Times in Status', keywords: ['gadget'] },
				{ item: 'Average Time in Status', keywords: ['gadget'] },
				{
					item: 'Better Code Block',
					keywords: ['paste-code-macro', 'codebetter', 'bettercode', 'bcode'],
				},
				{
					item: 'Blog Posts',
					keywords: ['blog-posts', 'news', 'blogs', 'blogposts', 'blogpost', 'blog', 'blog-post'],
				},
			];

			expect(dedupe(l, (item) => item.item)).toEqual(deduped);
		});
	});

	describe('#isSelectionInsideLastNodeInDocument', () => {
		it('should detect selection is inside last node in document', () => {
			const { editorView } = editor(doc(p('First Element'), p('{<>}Last Element')));

			expect(isSelectionInsideLastNodeInDocument(editorView.state.selection)).toBe(true);
		});
		it('should detect selection is not inside last element in the document', () => {
			const { editorView } = editor(doc(p('{<>}First Element'), p('Last Element')));

			expect(isSelectionInsideLastNodeInDocument(editorView.state.selection)).toBe(false);
		});
	});

	describe('#shallowEqual', () => {
		it('should return true if all props from obj1 equals obj2', () => {
			const objA = { test: 'ok', num: 2, prop: 'xx' };
			const objB = { test: 'ok', num: 2, prop: 'xx' };

			expect(shallowEqual(objA, objB)).toBe(true);
		});

		it('should return false if one prop from obj2 differs from obj1', () => {
			const objA = { test: 'ok', num: 2, prop: 'xx' };
			const objB = { test: 'ok', num: 2, prop: 'xx2' };

			expect(shallowEqual(objA, objB)).toBe(false);
		});

		it('should return false if obj2 has nested properties', () => {
			const objA = { test: 'ok', num: 2, prop: { sub: 'ok' } };
			const objB = { test: 'ok', num: 2, prop: { sub: 'ok' } };

			expect(shallowEqual(objA, objB)).toBe(false);
		});

		it('should return false if obj2 has different number of keys', () => {
			const objA = { test: 'ok' };
			const objB = { test: 'ok', num: 2, prop: { sub: 'ok' } };

			expect(shallowEqual(objA, objB)).toBe(false);
		});
	});
});
