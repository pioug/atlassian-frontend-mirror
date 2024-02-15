import React, { useCallback } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { changeAlignment } from '../commands';
import type { AlignmentPlugin } from '../plugin';
import type { AlignmentState } from '../pm-plugins/types';

import ToolbarAlignment from './ToolbarAlignment';

interface PrimaryToolbarComponentProps {
  api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
  editorView: EditorView;
  disabled: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isToolbarReducedSpacing: boolean;
}

export function PrimaryToolbarComponent({
  api,
  editorView,
  disabled,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  isToolbarReducedSpacing,
}: PrimaryToolbarComponentProps) {
  const { alignmentState } = useSharedPluginState(api, ['alignment']);
  const changeAlignmentCallback = useCallback(
    (align: AlignmentState) =>
      changeAlignment(align)(editorView.state, editorView.dispatch),
    [editorView],
  );

  return (
    <ToolbarAlignment
      pluginState={alignmentState}
      isReducedSpacing={isToolbarReducedSpacing}
      changeAlignment={changeAlignmentCallback}
      disabled={disabled || !alignmentState!.isEnabled}
      popupsMountPoint={popupsMountPoint}
      popupsBoundariesElement={popupsBoundariesElement}
      popupsScrollableElement={popupsScrollableElement}
    />
  );
}
