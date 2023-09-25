import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorCardPluginEvents } from '../../analytics/create-events-queue';
import type { CardPluginEvent } from '../../analytics/types';

export type AnalyticsBindingsProps = {
  editorView: EditorView;
  cardPluginEvents: EditorCardPluginEvents<CardPluginEvent>;
};

type EventMetadata = {
  action?: string;
  inputMethod?: string;
  sourceEvent?: unknown;
  isRedo?: boolean;
  isUndo?: boolean;
};

/**
 * If the metadata is for a history event,
 * returns undo/redo instead of instead of what fn(metadata) would have otherwise
 * returned
 */
const withHistoryMethod = (
  fn: (metadata: EventMetadata) => string | undefined,
) => {
  return (metadata: EventMetadata) => {
    const { isUndo, isRedo } = metadata;
    if (isUndo) {
      return 'undo';
    }
    if (isRedo) {
      return 'redo';
    }
    return fn(metadata);
  };
};

export const getMethod = withHistoryMethod(({ inputMethod }: EventMetadata) => {
  switch (inputMethod) {
    case INPUT_METHOD.CLIPBOARD:
      return 'editor_paste';
    case INPUT_METHOD.FLOATING_TB:
      return 'editor_floatingToolbar';
    case INPUT_METHOD.AUTO_DETECT:
    case INPUT_METHOD.FORMATTING:
      return 'editor_type';
    case INPUT_METHOD.TYPEAHEAD:
      return 'linkpicker_searchResult';
    case INPUT_METHOD.MANUAL:
      return 'linkpicker_manual';
    default:
      return 'unknown';
  }
});

export const getUpdateType = withHistoryMethod(({ action }: EventMetadata) => {
  switch (action) {
    case ACTION.CHANGED_TYPE:
      return 'display_update';
    case ACTION.UPDATED:
      return 'link_update';
    default:
      return 'unknown';
  }
});

export const getDeleteType = withHistoryMethod(({ action }: EventMetadata) => {
  if (action === ACTION.UNLINK) {
    return 'unlink';
  }
  return 'delete';
});

export const getSourceEventFromMetadata = (metadata: EventMetadata) => {
  return metadata.sourceEvent instanceof UIAnalyticsEvent
    ? metadata.sourceEvent
    : null;
};
