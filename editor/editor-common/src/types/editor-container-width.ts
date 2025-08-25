export type EditorContainerWidth = {
	/**
	 * Starts as undefined, and then updates to the
	 * clientWidth of the dom element the EditorView
	 * is attached to.
	 *
	 * Then the WidthEmitter updates this whenever the
	 * context panel or editor widths change.
	 */
	lineLength?: number;
	/**
	 * Starts as offsetWidth of document body, and then
	 * updates to the editors content areas offsetWidth
	 * via the use of a contentComponent (via the
	 * container element prop).
	 */
	width: number;
};

export type GetEditorContainerWidth = () => EditorContainerWidth;
