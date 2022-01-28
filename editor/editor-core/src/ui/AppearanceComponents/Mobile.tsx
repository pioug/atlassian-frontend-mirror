import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  pluginKey as maxContentSizePluginKey,
  MaxContentSizePluginState,
} from '../../plugins/max-content-size';
import { MobileDimensionsPluginState } from '../../plugins/mobile-dimensions/types';
import { mobileDimensionsPluginKey } from '../../plugins/mobile-dimensions/plugin-factory';
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

export type MobileAppearanceProps = React.PropsWithChildren<{
  editorView: EditorView | null;
  maxHeight?: number;
  persistScrollGutter?: boolean;
}>;

export function MobileAppearance({
  editorView,
  maxHeight,
  persistScrollGutter,
  children,
}: MobileAppearanceProps) {
  const render = useCallback(
    ({
      maxContentSize,
      mobileDimensions,
    }: {
      maxContentSize?: MaxContentSizePluginState;
      mobileDimensions?: MobileDimensionsPluginState;
    }) => {
      const maxContentSizeReached = Boolean(
        maxContentSize?.maxContentSizeReached,
      );

      let minHeight = 100;
      let currentIsExpanded = true; // isExpanded prop should always be true for Hybrid Editor
      if (mobileDimensions) {
        const {
          keyboardHeight,
          windowHeight,
          mobilePaddingTop,
          isExpanded,
        } = mobileDimensions;
        /*
          We calculate the min-height based on the windowHeight - keyboardHeight - paddingTop.
          This is needed due to scrolling issues when there is no content to scroll (like, only having 1 paragraph),
          but if the clickable area is bigger than the windowHeight - keyboard (including toolbar) then the view
          is scrolled nevertheless, and it gives the sensation that the content was lost.
        */

        if (!persistScrollGutter) {
          // in iOS Hybrid Editor windowHeight doesn't exclude keyboardHeight
          // in Android keyboardHeight is always set to -1;
          minHeight = windowHeight - keyboardHeight - 2 * mobilePaddingTop;
        } else {
          // in iOS Compact Editor windowHeight excludes keyboardHeight
          minHeight = windowHeight - mobilePaddingTop;
          // isExpanded can be true of false for Compact editor
          currentIsExpanded = isExpanded;
        }
      }
      return (
        <WithFlash animate={maxContentSizeReached}>
          <MobileEditor
            isMaxContentSizeReached={maxContentSizeReached}
            maxHeight={maxHeight}
          >
            <ClickArea
              editorView={editorView || undefined}
              minHeight={minHeight}
              persistScrollGutter={persistScrollGutter}
              isExpanded={currentIsExpanded}
            >
              <ContentArea>
                <div className="ak-editor-content-area">{children}</div>
              </ContentArea>
            </ClickArea>
          </MobileEditor>
        </WithFlash>
      );
    },
    [children, maxHeight, editorView, persistScrollGutter],
  );

  return (
    <WithPluginState
      plugins={{
        maxContentSize: maxContentSizePluginKey,
        mobileDimensions: mobileDimensionsPluginKey,
      }}
      render={render}
    />
  );
}
