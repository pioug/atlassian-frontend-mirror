import type { DragAndDropPluginAction } from './actions';
import { DragAndDropActionType } from './actions';
import { DropTargetType } from './consts';
import type { DragAndDropPluginState } from './types';

export default (
  pluginState: DragAndDropPluginState,
  action: DragAndDropPluginAction,
): DragAndDropPluginState => {
  switch (action.type) {
    case DragAndDropActionType.SET_DROP_TARGET:
      return {
        ...pluginState,
        decorationSet: action.data.decorationSet,
        dropTargetType: action.data.type,
        dropTargetIndex: action.data.index,
      };
    case DragAndDropActionType.CLEAR_DROP_TARGET:
      return {
        ...pluginState,
        decorationSet: action.data.decorationSet,
        dropTargetType: DropTargetType.NONE,
        dropTargetIndex: 0,
      };
    default:
      return pluginState;
  }
};
