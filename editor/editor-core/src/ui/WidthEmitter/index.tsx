import React, { useContext, useEffect, useState } from 'react';

import { EditorView } from 'prosemirror-view';

import { ContextPanel, WidthContext } from '@atlaskit/editor-common/ui';

import { PluginKey, EditorState } from 'prosemirror-state';

// TODO: ED-17870 This workaround will be removed here.
// @ts-ignore
const widthPluginKey = {
  key: 'widthPlugin$',
  getState: (state: EditorState) => {
    return (state as any)['widthPlugin$'];
  },
} as PluginKey;

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
