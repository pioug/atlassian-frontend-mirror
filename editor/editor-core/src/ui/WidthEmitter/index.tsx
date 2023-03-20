import React, { useEffect, useContext, useState } from 'react';
import { EditorView } from 'prosemirror-view';
import { pluginKey as widthPluginKey } from '../../plugins/width';
import { WidthContext } from '@atlaskit/editor-common/ui';
import { ContextPanel } from '../ContextPanel/context';

export interface Props {
  editorView?: EditorView;
}

// Why do we need this? Why not just use the width from the context directly rather than this?
// Well my friend - some of the VR tests break, seemingly due to the fact that existing behaviour
// assumes the initial value is 0, the width from context may not start from 0 however.
// We should investigate further if we can remove this entirely but for now we'll do this
// awkward workaround to keep the behaviour consistent.
const useListener = (contextValue: number) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(contextValue);
  }, [contextValue]);
  return value;
};

const WidthEmitter = ({ editorView }: Props) => {
  const { width: contextPanelWidthContext } = useContext(ContextPanel);
  const { width: containerWidthContext } = useContext(WidthContext);

  const containerWidth = useListener(containerWidthContext);
  const contextPanelWidth = useListener(contextPanelWidthContext);

  useEffect(() => {
    const width = containerWidth - contextPanelWidth;
    if (width <= 0 || isNaN(width) || !editorView) {
      return;
    }

    const {
      dom,
      state: { tr },
      dispatch,
    } = editorView;

    tr.setMeta(widthPluginKey, {
      width,
      containerWidth,
      lineLength: dom ? dom.clientWidth : undefined,
    });

    dispatch(tr);

    return () => {};
  }, [editorView, contextPanelWidth, containerWidth]);

  return <></>;
};

export default WidthEmitter;
