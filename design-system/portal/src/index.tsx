/**
 * @deprecated The browser top layer renders layered UI above the page without a portal. Use a
 * design system layer component (for example Popup, Tooltip or Modal dialog), or `Popover` and
 * `Dialog` from `@atlaskit/top-layer`. Content portalled to `document.body` renders below every open
 * top-layer surface. Design system components still use Portal on their `platform-dst-top-layer`
 * gate-off path.
 */
export { default } from './portal';
/**
 * @deprecated The browser top layer renders layered UI above the page without a portal. Use a
 * design system layer component (for example Popup, Tooltip or Modal dialog), or `Popover` and
 * `Dialog` from `@atlaskit/top-layer`.
 */
export type { PortalEvent, PortalProps } from './types';
/**
 * @deprecated Top-layer surfaces do not fire portal events. To know when a top-layer surface opens
 * or closes, listen for the native `toggle` and `close` events.
 */
export { PORTAL_MOUNT_EVENT, PORTAL_UNMOUNT_EVENT } from './constants';
