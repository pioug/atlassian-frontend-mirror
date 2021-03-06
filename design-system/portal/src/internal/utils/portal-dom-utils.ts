import {
  portalClassName,
  portalParentClassName,
  portalParentSelector,
  portalSelector,
} from '../constants';

/**
 * Creates a new portal container element with provided z-index and class name 'atlaskit-portal'
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
 * Removes portal parent container from document body
 */
const removePortalParent = (): void => {
  getBody().removeChild(getPortalParent());
};

/**
 * Removes portal container from portal parent container
 *  @param {HTMLDivElement | undefined} container - portal container to be removed from portal parent container
 */
export const removePortalContainer = (container: HTMLDivElement): void => {
  getPortalParent().removeChild(container);
};

/**
 * Appends portal container to portal parent container
 *  @param {HTMLDivElement | undefined} container - portal container to be added to portal parent container
 */
export const appendPortalContainer = (container: HTMLDivElement): void => {
  getPortalParent().appendChild(container);
};

/**
 * Removes portal parent container from document body if there are no more portals inside it
 */
export const removePortalParentContainerIfNoMorePortals = (): void => {
  if (!document.querySelector(portalSelector)) {
    removePortalParent();
  }
};
