import { fileCardImageViewSelector } from '@atlaskit/media-card';
import { mediaViewerPopupClass } from '@atlaskit/media-viewer/classnames';

/**
 * Check if an element is interactive (or otherwise if clicking on it shouldn't transition the
 * renderer to the editor in somewhere like the Jira description
 * @param element
 */
export function isInteractiveElement(
  element: HTMLElement | HTMLLinkElement,
): boolean {
  if ('href' in element && element.href != null) {
    return true;
  }

  if (element.classList.contains(mediaViewerPopupClass)) {
    return true;
  }

  if (element.classList.contains(fileCardImageViewSelector)) {
    return true;
  }
  return false;
}
