/** @jsx jsx */
import React, { useCallback, forwardRef } from 'react';
import { css, jsx } from '@emotion/react';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { BasePlugin, BasePluginState } from '@atlaskit/editor-plugin-base';
import type {
  MaxContentSizePluginState,
  MaxContentSizePlugin,
} from '@atlaskit/editor-plugin-max-content-size';
import type { MobileDimensionsPluginState } from '../../plugins/mobile-dimensions/types';
import type { MobileDimensionsPlugin } from '../../plugins/mobile-dimensions';
import WithFlash from '../WithFlash';
import { createEditorContentStyle } from '../ContentStyles';
import { ClickAreaMobile as ClickArea } from '../Addon';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { FeatureFlags } from '../../types/feature-flags';
import { usePresetContext } from '../../presets/context';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';

const mobileEditor = css`
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

const ContentArea = createEditorContentStyle();
ContentArea.displayName = 'ContentArea';

type MobileAppearanceProps = React.PropsWithChildren<{
  editorView: EditorView | null;
  maxHeight?: number;
  persistScrollGutter?: boolean;
  editorDisabled?: boolean;
  children?: React.ReactNode;
  featureFlags?: FeatureFlags;
}>;

export const MobileAppearance = forwardRef<
  HTMLDivElement,
  MobileAppearanceProps
>(function MobileAppearance(
  { editorView, persistScrollGutter, children, editorDisabled, featureFlags },
  ref,
) {
  const api =
    usePresetContext<
      [
        OptionalPlugin<BasePlugin>,
        OptionalPlugin<MobileDimensionsPlugin>,
        OptionalPlugin<MaxContentSizePlugin>,
      ]
    >();
  const { maxContentSizeState, mobileDimensionsState } = useSharedPluginState(
    api,
    ['maxContentSize', 'mobileDimensions'],
  );
  const render = useCallback(
    ({ maxContentSize, mobileDimensions }: PluginStates) => {
      const maxContentSizeReached = Boolean(
        maxContentSize?.maxContentSizeReached,
      );

      let minHeight = 100;
      let currentIsExpanded = true; // isExpanded prop should always be true for Hybrid Editor
      if (mobileDimensions) {
        const { windowHeight, mobilePaddingTop, isExpanded } = mobileDimensions;
        const basePluginState = api?.base?.sharedState.currentState() as
          | BasePluginState
          | undefined;
        const keyboardHeight = basePluginState?.keyboardHeight ?? -1;

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
          <div css={mobileEditor} ref={ref}>
            <ClickArea
              editorView={editorView || undefined}
              minHeight={minHeight}
              persistScrollGutter={persistScrollGutter}
              isExpanded={currentIsExpanded}
              editorDisabled={editorDisabled}
            >
              <ContentArea featureFlags={featureFlags}>
                <div className="ak-editor-content-area">{children}</div>
              </ContentArea>
            </ClickArea>
          </div>
        </WithFlash>
      );
    },
    [
      children,
      editorView,
      persistScrollGutter,
      editorDisabled,
      ref,
      featureFlags,
      api?.base?.sharedState,
    ],
  );
  return render({
    maxContentSize: maxContentSizeState,
    mobileDimensions: mobileDimensionsState,
  });
});

interface PluginStates {
  mobileDimensions?: MobileDimensionsPluginState;
  maxContentSize?: MaxContentSizePluginState;
}
