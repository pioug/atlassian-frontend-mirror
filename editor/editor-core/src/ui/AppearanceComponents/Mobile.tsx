import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  pluginKey as maxContentSizePluginKey,
  MaxContentSizePluginState,
} from '../../plugins/max-content-size';
import WithPluginState from '../WithPluginState';
import WithFlash from '../WithFlash';
import ContentStyles from '../ContentStyles';
import { ClickAreaMobile as ClickArea } from '../Addon';
import { EditorView } from 'prosemirror-view';

export interface MobileEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

const MobileEditor: any = styled.div`
  min-height: 30px;
  width: 100%;
  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
MobileEditor.displayName = 'MobileEditor';

const ContentArea = styled(ContentStyles)``;
ContentArea.displayName = 'ContentArea';

export type MobileAppearanceProps = {
  editorView: EditorView | null;
  maxHeight?: number;
  children: React.ReactChild;
};

export function MobileAppearance({
  editorView,
  maxHeight,
  children,
}: MobileAppearanceProps) {
  const render = useCallback(
    ({ maxContentSize }: { maxContentSize: MaxContentSizePluginState }) => {
      const maxContentSizeReached =
        maxContentSize && maxContentSize.maxContentSizeReached;
      return (
        <WithFlash animate={maxContentSizeReached}>
          <MobileEditor
            isMaxContentSizeReached={maxContentSizeReached}
            maxHeight={maxHeight}
          >
            <ClickArea editorView={editorView || undefined}>
              <ContentArea>{children}</ContentArea>
            </ClickArea>
          </MobileEditor>
        </WithFlash>
      );
    },
    [editorView, maxHeight, children],
  );

  return (
    <WithPluginState
      plugins={{ maxContentSize: maxContentSizePluginKey }}
      render={render}
    />
  );
}
