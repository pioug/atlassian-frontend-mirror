import { Transaction, EditorState, PluginKey } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { defaultSchemaConfig, createSchema } from '@atlaskit/adf-schema';
import { InstrumentedPlugin } from '../../performance/instrumented-plugin';
import { TransactionTracker } from '../../performance/track-transactions';

beforeEach(() => {
  performance.measure = jest.fn();
  performance.clearMeasures = jest.fn();
  performance.clearMarks = jest.fn();
  performance.getEntriesByName = jest.fn(() => []);
  performance.getEntriesByType = jest.fn(() => []);
  performance.mark = jest.fn();
});

describe('InstrumentedPlugin.prototype.apply', () => {
  it('bubbles errors from state.apply', () => {
    const thing = {} as any;
    const apply = jest.fn(() => {
      throw new Error('this was intended');
    });

    const plugin = new InstrumentedPlugin({
      state: { init: jest.fn(), apply },
    });

    expect(() =>
      plugin.spec.state!.apply(thing, thing, thing, thing),
    ).toThrowError('this was intended');
  });

  it('calls original apply with same arguments', () => {
    const apply = jest.fn();
    const tr = {} as Transaction;
    const pluginState = {} as any;
    const oldState = {} as EditorState<Schema<any, any>>;
    const newState = {} as EditorState<Schema<any, any>>;

    const plugin = new InstrumentedPlugin({
      state: { init: jest.fn(), apply },
    });

    plugin.spec.state!.apply(tr, pluginState, oldState, newState);

    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith(tr, pluginState, oldState, newState);
  });

  describe('tracking transaction performance', () => {
    it('does not call performance.mark before sampling threshold', () => {
      const apply = jest.fn();
      const thing = {} as any;

      const plugin = new InstrumentedPlugin(
        {
          key: new PluginKey('test-key'),
          state: { init: jest.fn(), apply },
        },
        {
          transactionTracking: { enabled: true },
        },
        new TransactionTracker(),
      );

      plugin.spec.state!.apply(thing, thing, thing, thing);
      expect(performance.mark).toHaveBeenCalledTimes(0);
    });

    it('calls performance.mark twice with appropriate arguments after 100 calls', () => {
      const apply = jest.fn();
      const thing = {} as any;
      const mark = performance.mark as jest.Mock;
      const tracker = new TransactionTracker();
      const options = {
        enabled: true,
        usePerformanceMarks: true,
      };

      const plugin = new InstrumentedPlugin(
        {
          key: new PluginKey('test-key'),
          state: { init: jest.fn(), apply },
        },
        {
          transactionTracking: options,
        },
        tracker,
      );
      const key = (plugin as any).key;

      // call to increment counter
      new Array<number>(100).fill(0).forEach(() => {
        tracker.bumpDispatchCounter(options);
        plugin.spec.state!.apply(thing, thing, thing, thing);
      });

      expect(performance.mark).toHaveBeenCalledTimes(2);
      expect(mark.mock.calls).toEqual([
        [`🦉${key}::apply::start`],
        [`🦉${key}::apply::end`],
      ]);
    });
  });

  it('propagates return value of spec.apply', () => {
    const value = Math.random();
    const apply = jest.fn(() => value);
    const thing = {} as any;

    const plugin = new InstrumentedPlugin({
      key: new PluginKey('test-key'),
      state: { init: jest.fn(), apply },
    });

    const result = plugin.spec.state!.apply(thing, thing, thing, thing);
    expect(result).toBe(value);
  });

  it('is used when dispatching a transaction on EditorState', async () => {
    const apply = jest.fn();

    const plugin = new InstrumentedPlugin({
      key: new PluginKey('test-key'),
      state: { init: jest.fn(), apply },
    });

    const schema = createSchema(defaultSchemaConfig);

    const state = EditorState.create({
      doc: schema.nodes.doc.create(schema.nodes.paragraph.create()),
      plugins: [plugin],
    });

    state.apply(state.tr);

    expect(apply).toHaveBeenCalledTimes(1);
  });
});
