// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import type {
  ReadonlyTransaction,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { findTable } from '@atlaskit/editor-tables/utils';

import type { DragAndDropPluginState } from './types';

type BuilderDragAndDropPluginState = (props: {
  tr: Transaction | ReadonlyTransaction;
  table?: ContentNodeWithPos;
}) => (pluginState: DragAndDropPluginState) => DragAndDropPluginState;

const buildPluginState =
  (
    builders: Array<BuilderDragAndDropPluginState>,
  ): BuilderDragAndDropPluginState =>
  (props) =>
  (pluginState) => {
    return builders.reduce(
      (_pluginState, transform) => transform(props)(_pluginState),
      pluginState,
    );
  };

export const handleDocOrSelectionChanged = (
  tr: Transaction | ReadonlyTransaction,
  pluginState: DragAndDropPluginState,
): DragAndDropPluginState =>
  buildPluginState([])({
    tr,
    table: findTable(tr.selection),
  })(pluginState);
