import React, { useCallback, useMemo } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { DomAtPos } from '@atlaskit/editor-prosemirror/utils';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { commitStatusPicker, updateStatus } from '../actions';
import type { StatusPlugin } from '../plugin';
import type { ClosingPayload } from '../pm-plugins/plugin';
import type { StatusType } from '../types';

import StatusPicker from './statusPicker';

interface ContentComponentProps {
  api: ExtractInjectionAPI<StatusPlugin> | undefined;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  editorView: EditorView;
  domAtPos: DomAtPos;
}

export function ContentComponent({
  api,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  editorView,
  domAtPos,
}: ContentComponentProps) {
  const { statusState } = useSharedPluginState(api, ['status']);
  const { showStatusPickerAt } = statusState ?? {};

  const target = useMemo(
    () =>
      showStatusPickerAt
        ? (findDomRefAtPos(showStatusPickerAt, domAtPos) as HTMLElement)
        : null,
    [showStatusPickerAt, domAtPos],
  );

  const statusNode = useMemo(
    () =>
      showStatusPickerAt
        ? editorView.state.doc.nodeAt(showStatusPickerAt)
        : undefined,
    [showStatusPickerAt, editorView],
  );

  const onSelect = useCallback(
    (status: StatusType) => {
      updateStatus(status)(editorView.state, editorView.dispatch);
    },
    [editorView],
  );

  const onTextChanged = useCallback(
    (status: StatusType) => {
      updateStatus(status)(editorView.state, editorView.dispatch);
    },
    [editorView],
  );
  const closeStatusPicker = useCallback(
    (closingPayload?: ClosingPayload) => {
      commitStatusPicker(closingPayload)(editorView);
    },
    [editorView],
  );
  const onEnter = useCallback(() => {
    commitStatusPicker()(editorView);
  }, [editorView]);

  if (typeof showStatusPickerAt !== 'number') {
    return null;
  }

  if (!statusNode || statusNode.type.name !== 'status') {
    return null;
  }

  const { text, color, localId } = statusNode.attrs;

  return (
    <StatusPicker
      isNew={statusState?.isNew}
      focusStatusInput={statusState?.focusStatusInput}
      target={target}
      defaultText={text}
      defaultColor={color}
      defaultLocalId={localId}
      mountTo={popupsMountPoint}
      boundariesElement={popupsBoundariesElement}
      scrollableElement={popupsScrollableElement}
      onSelect={onSelect}
      onTextChanged={onTextChanged}
      closeStatusPicker={closeStatusPicker}
      onEnter={onEnter}
    />
  );
}
