import type {
  LayerName,
  PortalEventDetail,
  ReversedLayers,
} from '../../internal/types';
import type { PortalEvent } from '../../types';

const zIndexToName: ReversedLayers = {
  100: 'card',
  200: 'navigation',
  300: 'dialog',
  400: 'layer',
  500: 'blanket',
  510: 'modal',
  600: 'flag',
  700: 'spotlight',
  800: 'tooltip',
};

/**
 * return layer name in Atlassian design system corresponding to given z-index
 * @param {number} zIndex - z-index value for which layer name is needed
 * @returns {LayerName | null} - The layer name for given z-index. If layer name is not found then null is returned
 */
const getLayerName = (zIndex: number): LayerName | null => {
  return zIndexToName.hasOwnProperty(zIndex)
    ? zIndexToName[zIndex as keyof ReversedLayers]
    : null;
};

/**
 * Creates a PortalEvent object with given eventName, given zIndex and corresponding layer
 * @param {string} eventName - either of Mount or Unmount event name
 * @param {number} zIndex - z-index value which will be included in the event to be dispatched
 * @returns {PortalEvent} - The newly created PortalEvent object
 */
const getEvent = (eventName: string, zIndex: number): PortalEvent => {
  const detail: PortalEventDetail = {
    layer: getLayerName(Number(zIndex)),
    zIndex,
  };

  return new CustomEvent(eventName, {
    detail,
  });
};

/**
 * Dispatches a custom event on window with given eventName, given zIndex and corresponding layer
 * @param {string} eventName - either of Mount or Unmount event name
 * @param {number} zIndex - z-index value which will be included in the event to be dispatched
 */
export default function firePortalEvent(
  eventName: string,
  zIndex: number,
): void {
  const event: PortalEvent = getEvent(eventName, zIndex);
  window.dispatchEvent(event);
}
