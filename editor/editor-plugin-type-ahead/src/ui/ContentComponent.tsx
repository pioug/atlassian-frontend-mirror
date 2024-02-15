import React from 'react';

import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { PopupMountPointReference, TypeAheadPlugin } from '../types';

import { TypeAheadMenu } from './TypeAheadMenu';

interface ContentComponentProps {
  api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
  editorView: EditorView;
  popupMountRef: PopupMountPointReference;
  fireAnalyticsCallback: FireAnalyticsCallback;
}

export function ContentComponent({
  api,
  editorView,
  popupMountRef,
  fireAnalyticsCallback,
}: ContentComponentProps) {
  const { typeAheadState } = useSharedPluginState(api, ['typeAhead']);
  if (!typeAheadState) {
    return null;
  }
  return (
    <TypeAheadMenu
      editorView={editorView}
      popupMountRef={popupMountRef}
      typeAheadState={typeAheadState}
      fireAnalyticsCallback={fireAnalyticsCallback}
    />
  );
}
