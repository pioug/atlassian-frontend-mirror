/**
 * Searches for the popup container element relative to the provided editor view element.
 *
 * @param editorViewEl - The editor view HTMLElement.
 * @returns The popup container HTMLElement if found, otherwise undefined.
 */
export const getPopupContainerFromEditorView = (
	editorViewEl?: HTMLElement | null,
): HTMLElement | undefined => {
	const editorContentArea = editorViewEl?.closest('.ak-editor-content-area');
	const pluginsComponentsWrapper = editorContentArea?.querySelector(
		':scope > [data-testid="plugins-components-wrapper"]',
	) as HTMLElement | null;
	return pluginsComponentsWrapper || undefined;
};
