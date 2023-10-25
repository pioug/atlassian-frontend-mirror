import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { EditorPluginInjectionAPI } from '../plugin-injection-api';

describe('core plugin focus', () => {
  const getEditorStateFake = jest.fn().mockReturnValue(() => {
    return undefined;
  }) as () => EditorState;
  it('should return false for focus if there is no editor view', () => {
    const getEditorViewFake = () => {
      return undefined;
    };

    const coreAPI = new EditorPluginInjectionAPI({
      getEditorState: getEditorStateFake,
      getEditorView: getEditorViewFake,
    });
    const api = coreAPI.api();
    expect(api.core?.actions?.focus()).toBe(false);
  });

  it('should return false if already has focus', () => {
    const getEditorViewFake = jest.fn().mockImplementation(() => {
      return {
        hasFocus: () => true,
      };
    }) as () => EditorView;

    const coreAPI = new EditorPluginInjectionAPI({
      getEditorState: getEditorStateFake,
      getEditorView: getEditorViewFake,
    });
    const api = coreAPI.api();
    expect(api.core?.actions?.focus()).toBe(false);
  });

  it('should return true if able to focus', () => {
    const mockScrollIntoView = jest.fn();
    const mockFocus = jest.fn();
    const getEditorViewFake = jest.fn().mockImplementation(() => {
      return {
        hasFocus: () => false,
        focus: mockFocus,
        dispatch: jest.fn(),
        state: { tr: { scrollIntoView: mockScrollIntoView } },
      };
    }) as () => EditorView;

    const coreAPI = new EditorPluginInjectionAPI({
      getEditorState: getEditorStateFake,
      getEditorView: getEditorViewFake,
    });
    const api = coreAPI.api();
    expect(api.core?.actions?.focus()).toBe(true);
    expect(mockScrollIntoView).toBeCalled();
    expect(mockFocus).toBeCalled();
  });
});
describe('core plugin blur', () => {
  const getEditorStateFake = jest.fn().mockReturnValue(() => {
    return undefined;
  }) as () => EditorState;
  it('should return false for blur if there is no editor view', () => {
    const getEditorViewFake = () => {
      return undefined;
    };

    const coreAPI = new EditorPluginInjectionAPI({
      getEditorState: getEditorStateFake,
      getEditorView: getEditorViewFake,
    });
    const api = coreAPI.api();
    expect(api.core?.actions?.blur()).toBe(false);
  });

  it('should return false if already doesnt have focus', () => {
    const getEditorViewFake = jest.fn().mockImplementation(() => {
      return {
        hasFocus: () => false,
      };
    }) as () => EditorView;

    const coreAPI = new EditorPluginInjectionAPI({
      getEditorState: getEditorStateFake,
      getEditorView: getEditorViewFake,
    });
    const api = coreAPI.api();
    expect(api.core?.actions?.blur()).toBe(false);
  });

  it('should return true if able to focus', () => {
    const mockBlur = jest.fn();
    const getEditorViewFake = jest.fn().mockImplementation(() => {
      return {
        hasFocus: () => true,
        dom: { blur: mockBlur },
      };
    }) as () => EditorView;

    const coreAPI = new EditorPluginInjectionAPI({
      getEditorState: getEditorStateFake,
      getEditorView: getEditorViewFake,
    });
    const api = coreAPI.api();
    expect(api.core?.actions?.blur()).toBe(true);
    expect(mockBlur).toBeCalled();
  });
});
