import { useEffect } from 'react';

import { EditorView } from 'prosemirror-view';

import { pluginKey } from './plugin-key';
import type { WidthPluginState } from './types';

const setEditorWidth =
  (props: Partial<WidthPluginState>) => (editorView: EditorView) => {
    const {
      dispatch,
      state: { tr },
    } = editorView;

    tr.setMeta(pluginKey, props);

    dispatch(tr);
  };

export const useResizeWidthObserver = ({
  editorView,
  containerElement,
}: {
  editorView: EditorView;
  containerElement: HTMLElement | null;
}) => {
  useEffect(() => {
    const newState: Partial<WidthPluginState> = {
      lineLength: editorView.dom.clientWidth,
      width: containerElement?.offsetWidth,
    };
    setEditorWidth(newState)(editorView);
  }, [editorView, editorView.dom.clientWidth, containerElement]);

  useEffect(() => {
    const resizeWidth: ResizeObserverCallback = entries => {
      if (entries.length !== 1) {
        return;
      }
      const [fullAreaSize] = entries;

      if (!fullAreaSize || !Array.isArray(fullAreaSize.borderBoxSize)) {
        return;
      }

      const width = fullAreaSize.borderBoxSize[0].inlineSize;

      const lineLength = editorView.dom.clientWidth;

      setEditorWidth({
        width,
        lineLength,
      })(editorView);
    };

    const resizeObserver = new ResizeObserver(resizeWidth);
    if (containerElement) {
      resizeObserver.observe(containerElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerElement, editorView]);
};
