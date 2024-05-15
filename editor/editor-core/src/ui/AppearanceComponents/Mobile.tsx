/** @jsx jsx */
import React, { forwardRef, useCallback } from 'react';

import { css, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type {
  BasePlugin,
  BasePluginState,
} from '@atlaskit/editor-plugins/base';
import type {
  MaxContentSizePlugin,
  MaxContentSizePluginState,
} from '@atlaskit/editor-plugins/max-content-size';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { usePresetContext } from '../../presets/context';
import type { FeatureFlags } from '../../types/feature-flags';
import { ClickAreaMobile as ClickArea } from '../Addon';
import { createEditorContentStyle } from '../ContentStyles';
import WithFlash from '../WithFlash';

// Only mobile bridge is using this appearance. We have some plans to decouple the appearances from editor-core. So it doesn't make sense to move this plugin to a separated package for now.
// Copied packages/editor/editor-mobile-bridge/src/editor/editor-plugins/mobile-dimensions/index.ts
type MobileDimensionsPlugin = NextEditorPlugin<
  'mobileDimensions',
  { sharedState: MobileDimensionsPluginState | undefined }
>;
// Copied from packages/editor/editor-mobile-bridge/src/editor/editor-plugins/mobile-dimensions/types.ts
type MobileDimensionsPluginState = {
  /** Current value of window.innerHeight, on Android this changes when keyboards shows/hides */
  windowHeight: number;
  /** Current value of padding top set from native (see WebBridge abstract class implementation) */
  mobilePaddingTop: number;
  /** Hybrid editor is always expanded, compact editor is collapsed or expanded */
  isExpanded: boolean;
};
const mobileEditor = css({
  minHeight: '30px',
  width: '100%',
  maxWidth: 'inherit',
  boxSizing: 'border-box',
  wordWrap: 'break-word',
  'div > .ProseMirror': {
    outline: 'none',
    whiteSpace: 'pre-wrap',
    padding: 0,
    margin: 0,
  },
});

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
