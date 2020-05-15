import { Transaction, Selection, NodeSelection } from 'prosemirror-state';
import { DatePluginState } from './types';

export function reducer(
  pluginState: DatePluginState,
  meta: DatePluginState,
): DatePluginState {
  // If the same nodeview is clicked twice, calendar should close
  if (meta.showDatePickerAt === pluginState.showDatePickerAt) {
    return { ...pluginState, showDatePickerAt: null };
  } else {
    return { ...pluginState, ...meta };
  }
}
export function mapping(
  tr: Transaction,
  pluginState: DatePluginState,
): DatePluginState {
  if (!pluginState.showDatePickerAt) {
    return pluginState;
  }

  const { pos, deleted } = tr.mapping.mapResult(pluginState.showDatePickerAt);
  return {
    showDatePickerAt: deleted ? null : pos,
  };
}

export function onSelectionChanged(
  tr: Transaction,
  pluginState: DatePluginState,
): DatePluginState {
  if (!isDateNodeSelection(tr.selection)) {
    return {
      showDatePickerAt: null,
    };
  }
  // create new object to force a re-render
  return {
    ...pluginState,
  };
}

const isDateNodeSelection = (selection: Selection) => {
  if (selection instanceof NodeSelection) {
    const nodeTypeName = selection.node.type.name;
    return nodeTypeName === 'date';
  }
  return false;
};
