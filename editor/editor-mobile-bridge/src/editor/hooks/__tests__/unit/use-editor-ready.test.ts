import { InjectedIntl } from 'react-intl';
import { renderHook } from '@testing-library/react-hooks';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { EditorActions, EventDispatcher } from '@atlaskit/editor-core';
import { useEditorReady } from '../../../hooks/use-editor-ready';
import { toNativeBridge } from '../../../web-to-native';
import WebBridgeImpl from '../../../native-to-web';

describe('useEditorReady hook', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) => {
    const { editorView } = createEditor({
      doc,
    });
    return editorView;
  };
  const editorView = editor(doc(p()));

  let bridge: WebBridgeImpl;
  const intlMock = ({
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown) as InjectedIntl;

  beforeEach(() => {
    bridge = new WebBridgeImpl();
    EditorActions.prototype._privateGetEditorView = jest
      .fn()
      .mockReturnValue(editorView);
    EditorActions.prototype._privateGetEventDispatcher = jest
      .fn()
      .mockReturnValue(new EventDispatcher());
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should have initialised bridge with the passed editorView', () => {
    expect(bridge.editorView).toBeNull();

    const { result } = renderHook(() => useEditorReady(bridge, intlMock));
    result.current(new EditorActions());

    expect(bridge.editorView).not.toBeNull();
    expect(bridge.editorView).toEqual(editorView);
  });

  it('should have called GetEventDispatcher and GetEditorView', () => {
    const { result } = renderHook(() => useEditorReady(bridge, intlMock));
    result.current(new EditorActions());

    expect(EditorActions.prototype._privateGetEditorView).toHaveBeenCalledTimes(
      1,
    );
    expect(
      EditorActions.prototype._privateGetEventDispatcher,
    ).toHaveBeenCalledTimes(1);
  });

  it('should have called the editorReady bridge method', () => {
    const editorReady = jest
      .spyOn(toNativeBridge, 'editorReady')
      .mockImplementation(jest.fn());

    const { result } = renderHook(() => useEditorReady(bridge, intlMock));
    result.current(new EditorActions());

    expect(editorReady).toHaveBeenCalledTimes(1);
  });
});
