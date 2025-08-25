export interface ColumnResizingPluginState {
	dragging: { startWidth: number; startX: number } | null;
	lastClick: { time: number; x: number; y: number } | null;
	lastColumnResizable?: boolean;
	resizeHandlePos: number | null;
}
