import { createSchema } from '@atlaskit/adf-schema';
import { defaultSchemaConfig } from '@atlaskit/adf-schema/schema-default';
import type { Plugin, Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';

import { SafeApplyPlugin } from '../../safe-apply-plugin';

describe('SafeApplyPlugin.prototype.apply', () => {
	it('bubbles errors from state.apply', () => {
		const thing = {} as any;
		const apply = jest.fn(() => {
			throw new Error('this was intended');
		});

		const plugin = new SafeApplyPlugin({
			state: { init: jest.fn(), apply },
		});

		expect(() => plugin.spec.state!.apply(thing, thing, thing, thing)).toThrowError(
			'this was intended',
		);
	});

	it('calls original apply with same arguments', () => {
		const apply = jest.fn();
		const tr = {} as Transaction;
		const pluginState = {} as any;
		const oldState = {} as EditorState;
		const newState = {} as EditorState;

		const plugin = new SafeApplyPlugin({
			state: { init: jest.fn(), apply },
		});

		plugin.spec.state!.apply(tr, pluginState, oldState, newState);

		expect(apply).toHaveBeenCalledTimes(1);
		expect(apply).toHaveBeenCalledWith(tr, pluginState, oldState, newState);
	});

	it('propagates return value of spec.apply', () => {
		const value = Math.random();
		const apply = jest.fn(() => value);
		const thing = {} as any;

		const plugin = new SafeApplyPlugin({
			key: new PluginKey('test-key'),
			state: { init: jest.fn(), apply },
		});

		const result = plugin.spec.state!.apply(thing, thing, thing, thing);
		expect(result).toBe(value);
	});

	it('is used when dispatching a transaction on EditorState', async () => {
		const apply = jest.fn();

		const plugin = new SafeApplyPlugin({
			key: new PluginKey('test-key'),
			state: { init: jest.fn(), apply },
		});

		const schema = createSchema(defaultSchemaConfig);

		const state = EditorState.create({
			doc: schema.nodes.doc.create(schema.nodes.paragraph.create()),
			plugins: [plugin as Plugin],
		});

		state.apply(state.tr);

		expect(apply).toHaveBeenCalledTimes(1);
	});
});
