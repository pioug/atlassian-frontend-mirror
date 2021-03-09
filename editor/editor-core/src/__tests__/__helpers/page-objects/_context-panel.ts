export function isPushingEditorContent(panel: Element): boolean {
  const style = getComputedStyle(panel);
  return style.position !== 'absolute';
}

export const editorWithWideBreakoutAndSidebarWidth = 1650;
