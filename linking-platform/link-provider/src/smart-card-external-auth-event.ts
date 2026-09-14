/**
 * This event is intended to be dispatched by code OUTSIDE the SmartCardProvider's React tree
 * (e.g. Post Office flags) when an external auth flow has completed and any matching unauthorized SmartLinks on the page should be refreshed.
 *
 * @example for usage from external source:
 *   window.dispatchEvent(new CustomEvent('atlaskit-smart-card:external-auth-completed', {
 *     detail: { extensionKeys: ['figma-object-provider'] },
 *   }));
 */
export const SMART_CARD_EXTERNAL_AUTH_EVENT = 'atlaskit-smart-card:external-auth-completed';
