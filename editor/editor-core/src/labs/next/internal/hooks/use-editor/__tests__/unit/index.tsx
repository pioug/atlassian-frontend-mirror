import { EditorView } from 'prosemirror-view';
import EditorActions from '../../../../../../../actions';
import { useHandleEditorLifecycle } from '../../';
import { createMountUseEffect } from './__hookHelpers';
import { analyticsEventKey } from '../../../../../../../plugins/analytics/consts';

describe('useHandleEditorLifecycle', () => {
  let mockEditorView: EditorView;
  let mockEditorActions: EditorActions;
  const mountUseEffect = createMountUseEffect();

  beforeEach(() => {
    mockEditorView = ({
      destroy: jest.fn(),
      setProps: jest.fn(),
      state: {
        plugins: [],
      },
    } as unknown) as EditorView;

    mockEditorActions = ({
      _privateRegisterEditor: () => {},
      _privateUnregisterEditor: () => {},
    } as unknown) as EditorActions;
  });

  test('should invoke on mount', () => {
    const onMount = jest.fn();
    mountUseEffect(() => {
      useHandleEditorLifecycle(({
        editorView: mockEditorView,
        editorActions: mockEditorActions,
        dispatch: () => {},
        onMount,
      } as unknown) as any);
    });
    expect(onMount).toBeCalledTimes(1);
  });

  test('should fire ACTION.STARTED analytics event', () => {
    const dispatch = jest.fn();
    mountUseEffect(() => {
      useHandleEditorLifecycle(({
        editorView: mockEditorView,
        editorActions: mockEditorActions,
        dispatch,
      } as unknown) as any);
    });

    expect(dispatch).toHaveBeenCalledWith(analyticsEventKey, {
      payload: {
        action: 'started',
        actionSubject: 'editor',
        attributes: {
          platform: 'web',
          featureFlags: [],
        },
        eventType: 'ui',
      },
    });
  });

  test('should invoke on destroy', () => {
    const onDestroy = jest.fn();
    const testRenderer = mountUseEffect(() => {
      useHandleEditorLifecycle(({
        editorView: mockEditorView,
        editorActions: mockEditorActions,
        dispatch: () => {},
        onDestroy,
      } as unknown) as any);
    });
    testRenderer!.unmount();
    expect(onDestroy).toBeCalledTimes(1);
  });
});
