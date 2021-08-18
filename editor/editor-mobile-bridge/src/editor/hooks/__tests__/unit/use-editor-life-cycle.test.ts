import { act, renderHook } from '@testing-library/react-hooks';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { EditorActions, EventDispatcher } from '@atlaskit/editor-core';
import { useEditorLifecycle } from '../../../hooks/use-editor-life-cycle';
import { toNativeBridge } from '../../../web-to-native';
import WebBridgeImpl from '../../../native-to-web';

describe('useEditorLifecycle hook', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    const { editorView } = createEditor({
      doc,
    });
    return editorView;
  };
  const editorView = editor(doc(p()));

  let bridge: WebBridgeImpl;
  let privateUnregisterEditor: jest.SpyInstance;

  beforeEach(() => {
    bridge = new WebBridgeImpl();
    jest
      .spyOn(EditorActions.prototype, '_privateGetEditorView')
      .mockReturnValue(editorView);
    jest
      .spyOn(EditorActions.prototype, '_privateGetEventDispatcher')
      .mockReturnValue(new EventDispatcher());
    privateUnregisterEditor = jest.spyOn(
      EditorActions.prototype,
      '_privateUnregisterEditor',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bridge.editorView to be undefined by default', () => {
    renderHook(() => useEditorLifecycle(bridge));
    expect(bridge.editorView).toBe(undefined);
  });

  it('should have initialised bridge.editorView when handleEditorReady is called', () => {
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorReady(new EditorActions()));

    expect(bridge.editorView).not.toBeNull();
    expect(bridge.editorView).toEqual(editorView);
  });

  it('should have called brdige.registerEditor when handleEditorReady is called', () => {
    const registerEditorMock = jest.spyOn(bridge, 'registerEditor');
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorReady(new EditorActions()));

    expect(registerEditorMock).toHaveBeenCalledTimes(1);
  });

  it('should unset bridge.editorView when handleEditorDestroyed is called', () => {
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorDestroyed());

    expect(bridge.editorView).toBe(undefined);
  });

  it('should have called brdige.unregisterEditor when handleEditorDestroyed is called', () => {
    const unregisterEditorMock = jest.spyOn(bridge, 'unregisterEditor');
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorDestroyed());

    expect(unregisterEditorMock).toHaveBeenCalledTimes(1);
  });

  it('should have set editorReady flag to false by default', () => {
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    expect(result.current.editorReady).toBe(false);
  });

  it('should have set editorReady flag to true when handleEditorReady is called and editoView is set', () => {
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorReady(new EditorActions()));

    expect(result.current.editorReady).toBe(true);
  });

  it('should have set editorReady flag to false when handleEditorDestroyed is called and editoView is unset', () => {
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorReady(new EditorActions()));
    act(() => result.current.handleEditorDestroyed());

    expect(result.current.editorReady).toBe(false);
  });

  it('should have called the editorReady bridge method', () => {
    const editorReady = jest
      .spyOn(toNativeBridge, 'editorReady')
      .mockImplementation(jest.fn());

    const { result, rerender } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorReady(new EditorActions()));
    rerender();
    expect(editorReady).toHaveBeenCalledTimes(1);
  });

  it('should have called the editorDestroyed bridge method', () => {
    const editorDestroyed = jest
      .spyOn(toNativeBridge, 'editorDestroyed')
      .mockImplementation(jest.fn());

    const { result, rerender } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorReady(new EditorActions()));
    rerender();
    act(() => result.current.handleEditorDestroyed());
    rerender();
    expect(editorDestroyed).toHaveBeenCalledTimes(1);
  });

  it('should have called unregisterEditor when editor is destroyed', () => {
    const { result } = renderHook(() => useEditorLifecycle(bridge));
    act(() => result.current.handleEditorReady(new EditorActions()));
    act(() => result.current.handleEditorDestroyed());

    expect(privateUnregisterEditor).toHaveBeenCalledTimes(1);
  });
});
