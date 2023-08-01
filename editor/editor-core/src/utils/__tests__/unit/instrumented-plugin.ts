import type { Plugin, Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { createSchema } from '@atlaskit/adf-schema';
import { defaultSchemaConfig } from '@atlaskit/adf-schema/schema-default';
import { InstrumentedPlugin } from '../../performance/instrumented-plugin';
import { TransactionTracker } from '../../performance/track-transactions';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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
    const oldState = {} as EditorState;
    const newState = {} as EditorState;

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

  describe('uiTracking performance', () => {
    it('should call performance.mark twice when view.update is called once', () => {
      const apply = jest.fn();
      const update = (view: EditorView, state: EditorState) => jest.fn();
      const mark = performance.mark as jest.Mock;
      const thing = {} as any;

      const plugin = new InstrumentedPlugin(
        {
          key: new PluginKey('test-key'),
          state: { init: jest.fn(), apply },
          view: (view: EditorView) => ({
            update,
          }),
        },
        {
          uiTracking: { enabled: true },
        },
      );
      const key = (plugin as any).key;
      const view = plugin.spec.view!(thing);
      new Array<number>(1).fill(0).forEach(() => {
        view.update!(thing, thing);
      });
      // performance.mark is called in startMeasure and stopMeasure
      // check that it's been called twice (once in each startMeasure and stopMeasure)
      expect(performance.mark).toHaveBeenCalledTimes(2);
      expect(mark.mock.calls).toEqual([
        [`🦉${key}::view::update::start`],
        [`🦉${key}::view::update::end`],
      ]);
    });
    it('should call performance.mark four times if view.update was called 101 times', () => {
      const apply = jest.fn();
      const update = (view: EditorView, state: EditorState) => jest.fn();
      const mark = performance.mark as jest.Mock;
      const thing = {} as any;

      const plugin = new InstrumentedPlugin(
        {
          key: new PluginKey('test-key'),
          state: { init: jest.fn(), apply },
          view: (view: EditorView) => ({
            update,
          }),
        },
        {
          uiTracking: { enabled: true },
        },
      );
      const key = (plugin as any).key;
      const view = plugin.spec.view!(thing);
      new Array<number>(101).fill(0).forEach(() => {
        view.update!(thing, thing);
      });
      // performance.mark is called in startMeasure and stopMeasure
      // check that it's been called four times (twice in each startMeasure and stopMeasure)
      expect(performance.mark).toHaveBeenCalledTimes(4);
      expect(mark.mock.calls).toEqual([
        [`🦉${key}::view::update::start`],
        [`🦉${key}::view::update::end`],
        [`🦉${key}::view::update::start`],
        [`🦉${key}::view::update::end`],
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
      plugins: [plugin as Plugin],
    });

    state.apply(state.tr);

    expect(apply).toHaveBeenCalledTimes(1);
  });
});
