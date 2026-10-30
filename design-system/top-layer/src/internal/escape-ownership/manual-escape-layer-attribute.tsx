/**
 * Marks an open layer that takes Escape itself where the browser would not: a `manual` popover
 * with `useManualLightDismiss`, or a `Dialog` (`closedby="none"`), while it listens for Escape.
 *
 * A string, so it works across copies of `@atlaskit/top-layer`.
 *
 * An attribute, not a registry: the DOM is the record of open layers. The browser opens and closes
 * layers without our code (light dismiss, Escape), and layers from other code or older copies do
 * not register, so a registry would miss them. The mark only adds what the DOM cannot show, and it
 * goes away with its element.
 */
export const manualEscapeLayerAttribute = 'data-top-layer-takes-escape';
