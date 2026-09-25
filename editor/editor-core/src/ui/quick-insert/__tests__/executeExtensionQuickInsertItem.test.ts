import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { MenuItem } from '@atlaskit/editor-common/extensions';
import type { EditorCommand, PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { EditorState } from '@atlaskit/editor-prosemirror/state';

import type EditorActions from '../../../actions';
import { executeExtensionQuickInsertItem } from '../executeExtensionQuickInsertItem';

describe('executeExtensionQuickInsertItem', () => {
	it.each([
		['embedCard', false],
		['extension', false],
		['embedCard', true],
		['extension', true],
		['skill', false],
		['skill', true],
	] as const)(
		'inserts async %s with the API present (intervening typing: %s)',
		async (type, typing) => {
			let state = EditorState.create({ schema });
			const rawNode =
				type === 'skill'
					? [
							{
								type: 'inlineExtension',
								attrs: {
									extensionType: 'com.atlassian.rovo.skill',
									extensionKey: 'skill:skillTag',
									parameters: {
										id: 'skill-1',
										name: 'Research Insights',
										slug: 'research-insights',
									},
								},
							},
							{ type: 'text', text: ' ' },
						]
					: type === 'embedCard'
						? { type, attrs: { url: 'https://example.com/database' } }
						: {
								type,
								attrs: {
									extensionType: 'com.atlassian.confluence.macro.core',
									extensionKey: 'database',
									parameters: {},
								},
							};
			let resolveNode!: (node: typeof rawNode) => void;
			const pendingNode = new Promise<typeof rawNode>((resolve) => {
				resolveNode = resolve;
			});
			const item: MenuItem = {
				categories: [],
				extensionKey: 'database',
				extensionType: 'com.atlassian.confluence.macro.core',
				featured: false,
				icon: () => Promise.resolve({ default: () => null }),
				key: 'database',
				keywords: [],
				node: () => pendingNode,
				title: 'Database',
			};
			const replaceSelection = jest.fn();
			const execute = jest.fn((command: EditorCommand | undefined) => {
				const tr = command?.({ tr: state.tr });
				if (!tr) {
					return false;
				}
				state = state.apply(tr);
				return true;
			});
			const insert = jest.fn(() => state.tr);
			const result = executeExtensionQuickInsertItem({
				apiRef: {
					current: { core: { actions: { execute } } } as unknown as PublicPluginAPI<
						[ExtensionPlugin]
					>,
				},
				editorActions: { replaceSelection } as unknown as EditorActions,
				insert,
				item,
				state,
			});
			expect(insert).toHaveBeenCalledWith('');
			if (result) {
				state = state.apply(result);
			}
			if (typing) {
				state = state.apply(state.tr.insertText('Keep this text'));
			}
			resolveNode(rawNode);
			await new Promise((resolve) => process.nextTick(resolve));

			expect(execute).toHaveReturnedWith(true);
			expect(replaceSelection).not.toHaveBeenCalled();
			if (type === 'skill') {
				const skillTag = {
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.rovo.skill',
						extensionKey: 'skill:skillTag',
						parameters: {
							id: 'skill-1',
							name: 'Research Insights',
							slug: 'research-insights',
						},
					},
				};
				expect(state.doc).toEqualDocument(
					schema.nodeFromJSON({
						type: 'doc',
						content: [
							{
								type: 'paragraph',
								content: [
									...(typing ? [{ type: 'text', text: 'Keep this text' }] : []),
									skillTag,
									{ type: 'text', text: ' ' },
								],
							},
						],
					}),
				);
				expect(state.selection.from).toBe(state.doc.content.size - 1);
			} else {
				expect(state.doc.textContent).toBe(typing ? 'Keep this text' : '');
				const insertedNodes: string[] = [];
				state.doc.descendants((node) => {
					insertedNodes.push(node.type.name);
				});
				expect(insertedNodes.filter((name) => name === type)).toHaveLength(1);
			}
		},
	);
});
