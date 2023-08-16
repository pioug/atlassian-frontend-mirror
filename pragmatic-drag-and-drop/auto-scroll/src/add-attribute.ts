import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

// TODO: expose from core?
export function addAttribute(
  element: Element,
  { attribute, value }: { attribute: string; value: string },
): CleanupFn {
  element.setAttribute(attribute, value);
  return () => element.removeAttribute(attribute);
}
