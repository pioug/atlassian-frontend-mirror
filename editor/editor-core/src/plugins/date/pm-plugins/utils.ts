import { Transaction, NodeSelection } from 'prosemirror-state';
import { DatePluginState } from './types';

export function reducer(
  pluginState: DatePluginState,
  meta: DatePluginState,
): DatePluginState {
  // ED-5033, calendar control open for element in plugin state, when node-view is clicked.
  // Following chanek ensures that if same node-view is clicked twice calendar should close,
  // but if a different node-view is clicked, calendar should open next the that node-view.
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
  if (
    pluginState.showDatePickerAt &&
    !(tr.selection instanceof NodeSelection)
  ) {
    return {
      showDatePickerAt: null,
    };
  }

  return pluginState;
}
