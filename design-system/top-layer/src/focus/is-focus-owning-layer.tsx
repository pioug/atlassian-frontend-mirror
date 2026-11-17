/**
 * Whether a layer wraps its own Tab focus: a `<dialog>`, or the roles in
 * `roleRequiresFocusWrap`.
 */
export function isFocusOwningLayer({ layer }: { layer: Element }): boolean {
	return layer.localName === 'dialog' || layer.matches('[role="dialog"], [role="alertdialog"]');
}
