import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, PluginKey, Selection } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	createPMPlugins,
	fixExcludes,
	processPluginsList,
	sortByRank,
} from '../../../create-editor/create-editor';
import type { EditorConfig } from '../../../types';
import { name } from '../../../version-wrapper';

describe(name, () => {
	describe('create-editor', () => {
		describe('#sortByRank', () => {
			it('should correctly sort object with rank property', () => {
				const list = [
					{ rank: 10 },
					{ rank: 1 },
					{ rank: 1000 },
					{ rank: 30 },
					{ rank: 100 },
					{ rank: 40 },
				];

				const result = [
					{ rank: 1 },
					{ rank: 10 },
					{ rank: 30 },
					{ rank: 40 },
					{ rank: 100 },
					{ rank: 1000 },
				];

				list.sort(sortByRank);

				expect(list.sort(sortByRank)).toEqual(result);
			});
		});

		describe('#fixExcludes', () => {
			it('should remove all unused marks from exclude', () => {
				const marks = {
					code: {
						excludes: 'textStyle typeAheadQuery',
						group: 'code',
					},
					em: {
						excludes: 'code',
						group: 'textStyle',
					},
				};
				const result = {
					code: {
						excludes: 'textStyle',
						group: 'code',
					},
					em: {
						excludes: 'code',
						group: 'textStyle',
					},
				};

				expect(fixExcludes(marks)).toEqual(result);
			});
		});

		describe('#createPMPlugins', () => {
			it('should not add plugin if its factory returns falsy value', () => {
				const editorConfig: Partial<EditorConfig> = {
					pmPlugins: [
						{ name: 'skipped', plugin: () => undefined },
						{
							name: 'mocked',
							plugin: () =>
								({
									spec: {},
									props: {},
									getState() {},
								}) as unknown as SafePlugin,
						},
					],
				};
				expect(
					createPMPlugins({
						editorConfig: editorConfig as EditorConfig,
						schema: {} as any,
						dispatch: () => {},
						eventDispatcher: {} as any,
						providerFactory: {} as any,
						errorReporter: {} as any,
						portalProviderAPI: { render() {}, remove() {} } as any,
						nodeViewPortalProviderAPI: { render() {}, remove() {} } as any,
						dispatchAnalyticsEvent: () => {},
						featureFlags: {},
						getIntl: () => ({}) as any,
						onEditorStateUpdated: undefined,
					}).length,
				).toEqual(1);
			});
		});
	});

	describe('#processPluginsList', () => {
		it('should pass plugin options to a corresponding plugin', () => {
			const spy = jest.fn(() => []);
			const options = { foo: 'bar' };
			const plugins = [
				{
					name: 'test',
					pmPlugins: spy,
				},
				{
					name: 'test2',
					pluginsOptions: {
						test: options,
					},
				},
			];
			processPluginsList(plugins);
			expect(spy).toHaveBeenCalledWith([options]);
		});
	});

	describe('onChange', () => {
		it('should call onChange only when document changes', () => {
			const onChange = jest.fn();
			const createEditor = createEditorFactory();
			const editor = createEditor({ editorProps: { onChange } });
			const { editorView } = editor;
			editorView.dispatch(editorView.state.tr.insertText('hello'));
			expect(onChange).toHaveBeenCalledTimes(1);
			const { tr } = editorView.state;
			editorView.dispatch(tr.setSelection(Selection.near(tr.doc.resolve(1))));
			expect(onChange).toHaveBeenCalledTimes(1);
		});
	});

	describe('onEditorStateUpdated should be called with editor states in order', () => {
		const pluginAKey = new PluginKey('pluginAKey');
		const pluginBKey = new PluginKey('pluginBKey');
		const editorConfig: Partial<EditorConfig> = {
			pmPlugins: [
				{
					name: 'pluginA',
					plugin: () =>
						new SafePlugin({
							key: pluginAKey,
							state: {
								init: () => {
									return { count: 0, updating: 0 };
								},
								apply: (tr, pluginState) => {
									const meta = tr.getMeta(pluginAKey);
									// Capture that we've pushed an update from the update plugin
									const newCount = pluginState?.count + 1;
									return {
										count: newCount,
										updating: meta ? meta : pluginState?.updating,
									};
								},
							},

							view: () => {
								return {
									update: (view) => {
										const currentState = pluginAKey.getState(view.state);
										if (currentState?.count === 2) {
											view.dispatch(view.state.tr.setMeta(pluginAKey, 1));
										}
									},
								};
							},
						}),
				},
				{
					name: 'pluginB',
					plugin: () =>
						new SafePlugin({
							key: pluginBKey,
							state: {
								init: () => {
									return { count: 0, updating: 0 };
								},
								apply: (tr, pluginState) => {
									const meta = tr.getMeta(pluginBKey);
									// Capture that we've pushed an update from the update plugin
									const newCount = pluginState?.count + 1;
									return {
										count: newCount,
										updating: meta ? meta : pluginState?.updating,
									};
								},
							},
							view: () => {
								return {
									update: (view) => {
										const currentState = pluginBKey.getState(view.state);
										if (currentState?.count === 4) {
											view.dispatch(view.state.tr.setMeta(pluginBKey, 1));
										}
									},
								};
							},
						}),
				},
			],
			onEditorViewStateUpdatedCallbacks: [],
		};

		describe('should update state in order', () => {
			ffTest(
				'platform_editor_migrate_state_updates',
				() => {
					const onEditorStateUpdated = jest.fn();
					const plugins = createPMPlugins({
						editorConfig: editorConfig as EditorConfig,
						schema: {} as any,
						dispatch: () => {},
						eventDispatcher: {} as any,
						providerFactory: {} as any,
						errorReporter: {} as any,
						portalProviderAPI: { render() {}, remove() {} } as any,
						nodeViewPortalProviderAPI: { render() {}, remove() {} } as any,
						dispatchAnalyticsEvent: () => {},
						featureFlags: {},
						getIntl: () => ({}) as any,
						onEditorStateUpdated: ({ newEditorState, oldEditorState }) =>
							onEditorStateUpdated({
								pluginAState: {
									new: pluginAKey.getState(newEditorState),
									old: pluginAKey.getState(oldEditorState),
								},
								pluginBState: {
									new: pluginBKey.getState(newEditorState),
									old: pluginBKey.getState(oldEditorState),
								},
							}),
					});

					const state = EditorState.create({
						doc: defaultSchema.nodes.doc.create(defaultSchema.nodes.paragraph.create()),
						plugins,
					});

					const editorView = new EditorView(null, {
						state,
					});

					expect(onEditorStateUpdated).toHaveBeenCalledTimes(0);

					editorView.dispatch(editorView.state.tr.insertText('hello'));

					expect(onEditorStateUpdated).toHaveBeenCalledTimes(1);
					editorView.dispatch(editorView.state.tr.insertText('world'));
					expect(onEditorStateUpdated).toHaveBeenCalledTimes(3);

					editorView.dispatch(editorView.state.tr.insertText('!'));
					expect(onEditorStateUpdated).toHaveBeenCalledTimes(5);
					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(1, {
						pluginAState: {
							new: {
								count: 1,
								updating: 0,
							},
							old: {
								count: 0,
								updating: 0,
							},
						},
						pluginBState: {
							new: {
								count: 1,
								updating: 0,
							},
							old: {
								count: 0,
								updating: 0,
							},
						},
					});
					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(2, {
						pluginAState: {
							new: {
								count: 2,
								updating: 0,
							},
							old: {
								count: 1,
								updating: 0,
							},
						},
						pluginBState: {
							new: {
								count: 2,
								updating: 0,
							},
							old: {
								count: 1,
								updating: 0,
							},
						},
					});
					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(3, {
						pluginAState: {
							new: {
								count: 3,
								updating: 1,
							},
							old: {
								count: 2,
								updating: 0,
							},
						},
						pluginBState: {
							new: {
								count: 3,
								updating: 0,
							},
							old: {
								count: 2,
								updating: 0,
							},
						},
					});

					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(4, {
						pluginAState: {
							new: {
								count: 4,
								updating: 1,
							},
							old: {
								count: 3,
								updating: 1,
							},
						},
						pluginBState: {
							new: {
								count: 4,
								updating: 0,
							},
							old: {
								count: 3,
								updating: 0,
							},
						},
					});

					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(5, {
						pluginAState: {
							new: {
								count: 5,
								updating: 1,
							},
							old: {
								count: 4,
								updating: 1,
							},
						},
						pluginBState: {
							new: {
								count: 5,
								updating: 1,
							},
							old: {
								count: 4,
								updating: 0,
							},
						},
					});
				},
				() => {
					const onEditorStateUpdated = jest.fn();
					const plugins = createPMPlugins({
						editorConfig: editorConfig as EditorConfig,
						schema: {} as any,
						dispatch: () => {},
						eventDispatcher: {} as any,
						providerFactory: {} as any,
						errorReporter: {} as any,
						portalProviderAPI: { render() {}, remove() {} } as any,
						nodeViewPortalProviderAPI: { render() {}, remove() {} } as any,
						dispatchAnalyticsEvent: () => {},
						featureFlags: {},
						getIntl: () => ({}) as any,
						onEditorStateUpdated: ({ newEditorState, oldEditorState }) =>
							onEditorStateUpdated({
								pluginAState: {
									new: pluginAKey.getState(newEditorState),
									old: pluginAKey.getState(oldEditorState),
								},
								pluginBState: {
									new: pluginBKey.getState(newEditorState),
									old: pluginBKey.getState(oldEditorState),
								},
							}),
					});

					const state = EditorState.create({
						doc: defaultSchema.nodes.doc.create(defaultSchema.nodes.paragraph.create()),
						plugins,
					});

					const editorView = new EditorView(null, {
						state,
					});

					expect(onEditorStateUpdated).toHaveBeenCalledTimes(0);

					editorView.dispatch(editorView.state.tr.insertText('hello'));

					expect(onEditorStateUpdated).toHaveBeenCalledTimes(1);
					editorView.dispatch(editorView.state.tr.insertText('world'));
					expect(onEditorStateUpdated).toHaveBeenCalledTimes(3);

					editorView.dispatch(editorView.state.tr.insertText('!'));
					expect(onEditorStateUpdated).toHaveBeenCalledTimes(5);
					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(1, {
						pluginAState: {
							new: {
								count: 1,
								updating: 0,
							},
							old: {
								count: 0,
								updating: 0,
							},
						},
						pluginBState: {
							new: {
								count: 1,
								updating: 0,
							},
							old: {
								count: 0,
								updating: 0,
							},
						},
					});
					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(2, {
						pluginAState: {
							new: {
								count: 2,
								updating: 0,
							},
							old: {
								count: 1,
								updating: 0,
							},
						},
						pluginBState: {
							new: {
								count: 2,
								updating: 0,
							},
							old: {
								count: 1,
								updating: 0,
							},
						},
					});
					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(3, {
						pluginAState: {
							new: {
								count: 3,
								updating: 1,
							},
							old: {
								count: 2,
								updating: 0,
							},
						},
						pluginBState: {
							new: {
								count: 3,
								updating: 0,
							},
							old: {
								count: 2,
								updating: 0,
							},
						},
					});

					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(4, {
						pluginAState: {
							new: {
								count: 4,
								updating: 1,
							},
							old: {
								count: 3,
								updating: 1,
							},
						},
						pluginBState: {
							new: {
								count: 4,
								updating: 0,
							},
							old: {
								count: 3,
								updating: 0,
							},
						},
					});

					expect(onEditorStateUpdated).toHaveBeenNthCalledWith(5, {
						pluginAState: {
							new: {
								count: 5,
								updating: 1,
							},
							old: {
								count: 4,
								updating: 1,
							},
						},
						pluginBState: {
							new: {
								count: 5,
								updating: 1,
							},
							old: {
								count: 4,
								updating: 0,
							},
						},
					});
				},
			);
		});
	});
});
