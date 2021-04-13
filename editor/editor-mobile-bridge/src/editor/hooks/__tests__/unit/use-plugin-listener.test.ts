import { renderHook } from '@testing-library/react-hooks';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { EditorActions, EventDispatcher } from '@atlaskit/editor-core';
import WebBridgeImpl from '../../../native-to-web';
import { usePluginListeners } from '../../use-plugin-listeners';
import * as PluginListeners from '../../../plugin-subscription/index';
import EditorConfiguartion from '../../../editor-configuration';

jest.mock('@atlaskit/editor-core', () => ({
  ...(jest.genMockFromModule('@atlaskit/editor-core') as object),
}));

describe('usePluginListeners Hook', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    const { editorView } = createEditor({
      doc,
    });
    return editorView;
  };
  const editorView = editor(doc(p()));

  let bridge: WebBridgeImpl;
  let privateGetEditorView: jest.SpyInstance;
  let privateGetEventDispatcher: jest.SpyInstance;

  beforeEach(() => {
    bridge = new WebBridgeImpl();
    privateGetEditorView = jest
      .spyOn(EditorActions.prototype, '_privateGetEditorView')
      .mockReturnValue(editorView);
    privateGetEventDispatcher = jest
      .spyOn(EditorActions.prototype, '_privateGetEventDispatcher')
      .mockReturnValue(new EventDispatcher());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not have called getEventDispatcher and getEditorView when editorReady is false', () => {
    const editorReady = false;
    renderHook(() =>
      usePluginListeners(editorReady, new EditorConfiguartion(), bridge),
    );
    expect(privateGetEditorView).not.toHaveBeenCalled();
    expect(privateGetEventDispatcher).not.toHaveBeenCalled();
  });

  it('should have called getEventDispatcher and getEditorView when editorReady is true', () => {
    const editorReady = true;
    renderHook(() =>
      usePluginListeners(editorReady, new EditorConfiguartion(), bridge),
    );
    expect(privateGetEditorView).toHaveBeenCalledTimes(1);
    expect(privateGetEventDispatcher).toHaveBeenCalledTimes(1);
  });

  it('should not have called configFactory & initPluginListeners when  when editorReday is set to false', () => {
    const configFactory = jest.spyOn(PluginListeners, 'configFactory');
    const initPluginListeners = jest.spyOn(
      PluginListeners,
      'initPluginListeners',
    );
    const editorReady = false;
    const defaultConfig = new EditorConfiguartion();
    renderHook(() => usePluginListeners(editorReady, defaultConfig, bridge));
    expect(configFactory).not.toHaveBeenCalled();
    expect(initPluginListeners).not.toHaveBeenCalled();
  });

  it('should have called configFactory & initPluginListeners when editorReady is set to true', () => {
    const configFactory = jest.spyOn(PluginListeners, 'configFactory');
    const initPluginListeners = jest.spyOn(
      PluginListeners,
      'initPluginListeners',
    );
    let editorReady = false;
    const defaultConfig = new EditorConfiguartion();
    const { rerender } = renderHook(() =>
      usePluginListeners(editorReady, defaultConfig, bridge),
    );
    editorReady = true;
    rerender();
    expect(configFactory).toHaveBeenCalledTimes(1);
    expect(configFactory).toHaveBeenLastCalledWith(defaultConfig);
    expect(initPluginListeners).toHaveBeenCalledTimes(1);
  });
});
