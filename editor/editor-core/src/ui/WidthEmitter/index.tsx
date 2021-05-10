import React from 'react';
import { EditorView } from 'prosemirror-view';
import { pluginKey as widthPluginKey } from '../../plugins/width';
import { WidthConsumerContext, WidthConsumer } from '@atlaskit/editor-common';
import {
  ContextPanelConsumer,
  ContextPanelContext,
} from '../ContextPanel/context';

export interface Props {
  editorView?: EditorView;
}

type CallbacksType = {
  setContextPanelWidth: React.Dispatch<React.SetStateAction<number>>;
  setContainerWidth: React.Dispatch<React.SetStateAction<number>>;
};

type CallbacksReturn = [
  (props: ContextPanelContext) => null,
  (props: WidthConsumerContext) => null,
];

function useCreateWidthCallbacks({
  setContextPanelWidth,
  setContainerWidth,
}: CallbacksType): CallbacksReturn {
  const contextPanelWidthCallback = React.useCallback(
    ({ width }: ContextPanelContext) => {
      setContextPanelWidth(width);
      return null;
    },
    [setContextPanelWidth],
  );

  const containerWidthCallback = React.useCallback(
    ({ width }: WidthConsumerContext) => {
      setContainerWidth(width);
      return null;
    },
    [setContainerWidth],
  );

  return [contextPanelWidthCallback, containerWidthCallback];
}

const WidthEmitter = ({ editorView }: Props) => {
  const [contextPanelWidth, setContextPanelWidth] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [
    contextPanelWidthCallback,
    containerWidthCallback,
  ] = useCreateWidthCallbacks({ setContextPanelWidth, setContainerWidth });

  React.useEffect(() => {
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

  return (
    <>
      <ContextPanelConsumer>{contextPanelWidthCallback}</ContextPanelConsumer>
      <WidthConsumer>{containerWidthCallback}</WidthConsumer>
    </>
  );
};

export default WidthEmitter;
