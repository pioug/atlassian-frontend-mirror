import {
  portalClassName,
  portalParentClassName,
  portalParentSelector,
} from '../constants';

/**
 * Creates a new portal container element with provided z-index and class name 'atlaskit-portal',
 * it is not be attached to any DOM node at this stage.
 * @param {number | string} zIndex - the z-index value of the newly created portal container element
 * @return {number} - The newly created container element
 */
export const createContainer = (zIndex: number | string): HTMLDivElement => {
  const container = document.createElement('div');
  container.className = portalClassName;
  container.style.zIndex = `${zIndex}`;
  return container;
};

/**
 * Returns document body element
 * @return {number} - The document body element
 */
const getBody = (): HTMLElement => {
  return document.body;
};

/**
 * Returns portal parent container. If no container exists already then it creates a new container with class name 'atlaskit-portal-container'
 * @return {Element} - The portal parent container div element
 */
const getPortalParent = (): Element => {
  const parentElement = document.querySelector(portalParentSelector);
  if (!parentElement) {
    const parent = document.createElement('div');
    parent.className = portalParentClassName;
    // we are setting display to flex because we want each portal to create a new stacking context
    // See https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
    parent.style.display = 'flex';
    getBody().appendChild(parent);
    return parent;
  }
  return parentElement;
};

/**
 * Removes portal container from portal parent container
 *  @param {HTMLDivElement | undefined} container - portal container to be removed from portal parent container
 */
export const removePortalContainer = (container: HTMLDivElement): void => {
  getPortalParent().removeChild(container);
};

/**
 * Appends portal container to portal parent container if it hasn't already been done
 *  @param {HTMLDivElement | undefined} container - portal container to be added to portal parent container
 */
export const appendPortalContainerIfNotAppended = (
  container: HTMLDivElement,
): void => {
  if (!container.parentElement) {
    getPortalParent().appendChild(container);
  }
};
