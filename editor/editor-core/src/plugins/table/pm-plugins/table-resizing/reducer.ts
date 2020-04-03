import {
  ColumnResizingPluginState,
  ColumnResizingPluginAction,
} from '../../types';

export default (
  pluginState: ColumnResizingPluginState,
  action: ColumnResizingPluginAction,
): ColumnResizingPluginState => {
  switch (action.type) {
    case 'STOP_RESIZING':
      return {
        ...pluginState,
        resizeHandlePos: null,
        dragging: null,
      };

    case 'SET_RESIZE_HANDLE_POSITION':
      return {
        ...pluginState,
        resizeHandlePos: action.data.resizeHandlePos,
      };

    case 'SET_DRAGGING':
      return {
        ...pluginState,
        dragging: action.data.dragging,
      };

    case 'SET_LAST_CLICK':
      const { lastClick } = action.data;
      return {
        ...pluginState,
        lastClick,
        resizeHandlePos: lastClick ? pluginState.resizeHandlePos : null,
      };
    default:
      return pluginState;
  }
};
