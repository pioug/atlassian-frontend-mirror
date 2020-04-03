import { EditorState } from 'prosemirror-state';
import { pluginFactory } from '../../../utils/plugin-state-factory';

describe('@atlaskit/editor-core utils/plugin-state-factory', () => {
  const getTransactionMock = () =>
    ({
      setMeta: jest.fn(),
      getMeta: jest.fn(),
    } as any);

  const getPluginKeyMock = () => ({
    getState: jest.fn(),
    get: jest.fn(),
  });

  describe('state', () => {
    describe('initialState', () => {
      it('state.init should return an empty object if initialState is not provided', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const pluginKey = getPluginKeyMock();
        const { createPluginState } = pluginFactory(pluginKey, reducer);
        const pluginState = createPluginState(dispatch, {});
        expect((pluginState as any).init()).toEqual({});
      });

      it('state.init should return initialState if provided', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const pluginKey = getPluginKeyMock();
        const initialState = {
          pos: 1,
          name: 'aaa',
        };
        const { createPluginState } = pluginFactory(pluginKey, reducer);
        const pluginState = createPluginState(dispatch, initialState);
        expect((pluginState as any).init()).toEqual(initialState);
      });
    });

    describe('mapping', () => {
      it('should call mapping if provided', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const mapping = jest.fn();
        const pluginKey = getPluginKeyMock();
        const { createPluginState } = pluginFactory(pluginKey, reducer, {
          mapping,
        });
        const state = createPluginState(dispatch, {});
        const tr = getTransactionMock();
        const pluginState = { pos: 3 };
        state.apply(tr, pluginState, {} as EditorState, {} as EditorState);
        expect(mapping).toHaveBeenCalledWith(tr, pluginState);
      });
    });

    describe('reducer', () => {
      it('should not call reducer if meta is not set', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const pluginKey = getPluginKeyMock();
        const { createPluginState } = pluginFactory(pluginKey, reducer);
        const state = createPluginState(dispatch, {});
        state.apply(
          getTransactionMock(),
          {},
          {} as EditorState,
          {} as EditorState,
        );
        expect(reducer).not.toHaveBeenCalled();
      });

      it('should call reducer if meta is set on a transaction', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const pluginKey = getPluginKeyMock();
        const { createPluginState } = pluginFactory(pluginKey, reducer);
        const state = createPluginState(dispatch, {});
        const meta = { someProp: '123123' };
        const tr = getTransactionMock();
        tr.getMeta = () => meta;
        const pluginState = { pos: 3 };

        state.apply(tr, pluginState, {} as EditorState, {} as EditorState);
        expect(reducer).toHaveBeenCalledWith(pluginState, meta);
      });
    });

    describe('dispatch', () => {
      it('should not call dispatch if reducer returns the same pluginState', () => {
        const dispatch = jest.fn();
        const pluginKey = getPluginKeyMock();
        const reducer = jest.fn();
        const { createPluginState } = pluginFactory(pluginKey, reducer);
        const state = createPluginState(dispatch, {});
        state.apply(
          getTransactionMock(),
          {},
          {} as EditorState,
          {} as EditorState,
        );
        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should call dispatch if reducer returns a new pluginState', () => {
        const dispatch = jest.fn();
        const pluginKey = getPluginKeyMock();
        const pluginState = { pos: 3 };
        const newPluginState = { pos: 4 };
        const reducer = () => newPluginState;
        const { createPluginState } = pluginFactory(pluginKey, reducer);
        const state = createPluginState(dispatch, pluginState);
        const meta = { someProp: '123123' };
        const tr = getTransactionMock();
        tr.getMeta = () => meta;

        state.apply(tr, pluginState, {} as EditorState, {} as EditorState);
        expect(dispatch).toHaveBeenCalledWith(pluginKey, newPluginState);
      });
    });

    describe('onDocChanged', () => {
      it('should not call onDocChanged if tr.docChanged === false', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const pluginKey = getPluginKeyMock();
        const onDocChanged = jest.fn();
        const { createPluginState } = pluginFactory(pluginKey, reducer, {
          onDocChanged,
        });
        const state = createPluginState(dispatch, {});
        state.apply(
          getTransactionMock(),
          {},
          {} as EditorState,
          {} as EditorState,
        );
        expect(onDocChanged).not.toHaveBeenCalled();
      });

      it('should call onDocChanged if tr.docChanged === true', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const pluginKey = getPluginKeyMock();
        const onDocChanged = jest.fn();
        const { createPluginState } = pluginFactory(pluginKey, reducer, {
          onDocChanged,
        });
        const state = createPluginState(dispatch, {});
        const tr = getTransactionMock();
        tr.docChanged = true;
        const pluginState = { pos: 11 };
        state.apply(tr, pluginState, {} as EditorState, {} as EditorState);
        expect(onDocChanged).toHaveBeenCalledWith(tr, pluginState);
      });
    });

    describe('onSelectionChanged', () => {
      it('should not call onSelectionChanged if tr.selectionSet === false', () => {
        const dispatch = jest.fn();
        const reducer = jest.fn();
        const pluginKey = getPluginKeyMock();
        const onSelectionChanged = jest.fn();
        const { createPluginState } = pluginFactory(pluginKey, reducer, {
          onSelectionChanged,
        });
        const state = createPluginState(dispatch, {});

        state.apply(
          getTransactionMock(),
          {},
          {} as EditorState,
          {} as EditorState,
        );
        expect(onSelectionChanged).not.toHaveBeenCalled();
      });
    });

    it('should call onSelectionChanged if tr.selectionSet === true', () => {
      const dispatch = jest.fn();
      const reducer = jest.fn();
      const pluginKey = getPluginKeyMock();
      const onSelectionChanged = jest.fn();
      const { createPluginState } = pluginFactory(pluginKey, reducer, {
        onSelectionChanged,
      });
      const state = createPluginState(dispatch, {});
      const tr = getTransactionMock();
      tr.selectionSet = true;
      const pluginState = { pos: 12 };
      state.apply(tr, pluginState, {} as EditorState, {} as EditorState);
      expect(onSelectionChanged).toHaveBeenCalledWith(tr, pluginState);
    });
  });

  describe('#createCommand', () => {
    it('should set "meta" on a transaction', () => {
      const reducer = jest.fn();
      const dispatch = jest.fn();
      const action = { type: 'hello' };
      const pluginKey = getPluginKeyMock();
      const tr = getTransactionMock();
      const state = { tr } as EditorState;

      const { createCommand } = pluginFactory(pluginKey, reducer);

      createCommand(action)(state, dispatch);
      expect(tr.setMeta).toHaveBeenCalledWith(pluginKey, action);
    });
  });

  describe('#getPluginState', () => {
    it('should return plugin state', () => {
      const reducer = jest.fn();
      const state = {} as EditorState;
      const pluginKey = getPluginKeyMock();
      const { getPluginState } = pluginFactory(pluginKey, reducer);
      getPluginState(state);
      expect(pluginKey.getState).toHaveBeenCalledWith(state);
    });
  });
});
