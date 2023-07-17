export interface ColumnResizingPluginState {
  resizeHandlePos: number | null;
  dragging: { startX: number; startWidth: number } | null;
  lastClick: { x: number; y: number; time: number } | null;
  lastColumnResizable?: boolean;
}
