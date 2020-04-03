import { name } from '../../../version.json';
import { mount } from 'enzyme';
import React from 'react';
import { Plugin, PluginKey } from 'prosemirror-state';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import WithPluginState from '../../../ui/WithPluginState';
import { EditorPlugin } from '../../../types/editor-plugin';
import {
  EventDispatcher,
  createDispatch,
  Dispatch,
} from '../../../event-dispatcher';
import EditorActions from '../../../actions';
import EditorContext from '../../../ui/EditorContext';

describe(name, () => {
  const createEditor = createEditorFactory();

  const pluginKey = new PluginKey('plugin');
  const pluginKey2 = new PluginKey('plugin2');

  const setTimeoutPromise = (cb: Function, delay: number) =>
    new Promise(resolve => window.setTimeout(() => resolve(cb()), delay));
  const createPlugin = (state: any, key: PluginKey): EditorPlugin => {
    return {
      name: 'withPluginState',

      pmPlugins() {
        return [
          {
            name: '',
            plugin: () =>
              new Plugin({
                key,
                state: {
                  init() {
                    return state;
                  },
                  apply() {
                    return state;
                  },
                },
              }),
          },
        ];
      },
    };
  };

  let eventDispatcher: EventDispatcher;
  let dispatch: Dispatch;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
    dispatch = createDispatch(eventDispatcher);
  });

  describe('WithPluginState', () => {
    it('should call render with current plugin state', () => {
      const pluginState = {};
      const plugin = createPlugin(pluginState, pluginKey);
      const { editorView } = createEditor({
        doc: doc(p()),
        editorPlugins: [plugin],
      });
      const wrapper = mount(
        <WithPluginState
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          plugins={{ currentPluginState: pluginKey }}
          render={({ currentPluginState }) => {
            expect(currentPluginState).toEqual(pluginState);
            return null;
          }}
        />,
      );
      wrapper.unmount();
      editorView.destroy();
    });

    it('should call render once after changes in several plugins', async () => {
      const pluginState = {};
      const plugin = createPlugin(pluginState, pluginKey);
      const plugin2 = createPlugin(pluginState, pluginKey2);
      const { editorView } = createEditor({
        doc: doc(p()),
        editorPlugins: [plugin, plugin2],
      });

      const renderMock = jest.fn().mockReturnValue(null);

      const wrapper = mount(
        <WithPluginState
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          plugins={{ pluginState: pluginKey, plugin2State: pluginKey2 }}
          render={renderMock}
        />,
      );

      await Promise.all([
        setTimeoutPromise(() => dispatch(pluginKey, {}), 0),
        setTimeoutPromise(() => dispatch(pluginKey2, {}), 8),
        setTimeoutPromise(() => dispatch(pluginKey, {}), 5),
        setTimeoutPromise(() => dispatch(pluginKey, {}), 0),
        setTimeoutPromise(() => dispatch(pluginKey2, {}), 8),
        setTimeoutPromise(() => dispatch(pluginKey, {}), 5),
      ]);

      expect(renderMock.mock.calls.length).toBeLessThan(6);
      wrapper.unmount();
      editorView.destroy();
    });
  });

  it('should clean all listeners after unmount', () => {
    const pluginState = {};
    const plugin = createPlugin(pluginState, pluginKey);
    const plugin2 = createPlugin(pluginState, pluginKey2);
    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin, plugin2],
    });
    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey, plugin2State: pluginKey2 }}
        render={() => null}
      />,
    );
    const wpsInstance = (wrapper.find(WithPluginState) as any)
      .first()
      .instance();

    wrapper.unmount();
    editorView.destroy();
    expect(wpsInstance.listeners).toEqual([]);
  });

  it('should support old plugins with subscribe/unsubscribe methods', () => {
    const pluginState = {
      cb(_param?: any) {},

      update() {
        this.cb({ a: 1 });
      },

      subscribe(cb: (param?: any) => {}) {
        this.cb = cb;
      },
      unsubscribe: jest.fn(),
    };
    const plugin = createPlugin(pluginState, pluginKey);
    const { editorView } = createEditor({
      editorPlugins: [plugin],
    });

    const renderMock = jest.fn(() => null);
    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey }}
        render={renderMock}
      />,
    );

    return setTimeoutPromise(() => pluginState.update(), 10)
      .then(() => setTimeoutPromise(() => {}, 50))
      .then(() => {
        wrapper.unmount();
        editorView.destroy();
        expect(renderMock).toHaveBeenLastCalledWith({ pluginState: { a: 1 } });
      });
  });

  it('should unsubscribe after unmount for old plugins with subscribe/unsubscribe methods', () => {
    const unsubscribeMock = jest.fn();
    const pluginState = {
      subscribe: () => {},
      unsubscribe: unsubscribeMock,
    };
    const plugin = createPlugin(pluginState, pluginKey);
    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin],
    });

    const render = jest.fn(() => null);
    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey }}
        render={render}
      />,
    );

    wrapper.unmount();
    editorView.destroy();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('should support getting EditorView and EventDispatcher from the context', () => {
    const pluginState = {};
    const plugin = createPlugin(pluginState, pluginKey);
    const editorActions = new EditorActions();
    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin],
    });
    editorActions._privateRegisterEditor(editorView, eventDispatcher);
    const wrapper = mount(
      <EditorContext editorActions={editorActions}>
        <WithPluginState
          plugins={{ currentPluginState: pluginKey }}
          render={({ currentPluginState }) => {
            expect(currentPluginState).toEqual(pluginState);
            return null;
          }}
        />
      </EditorContext>,
    );
    wrapper.unmount();
    editorView.destroy();
  });
});
