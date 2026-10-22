/**
 * @deprecated Not needed with the `@atlaskit/top-layer/page-surface` entry points, which reads open layers from the
 * DOM. During the rollout, render it only when `fg('platform-dst-top-layer')` is off.
 */
export { OpenLayerObserver } from '../../components/open-layer-observer/open-layer-observer';
/**
 * @deprecated Render the surface with `@atlaskit/top-layer` (a `Popover` with `onClose`, or a
 * `Dialog`). It is then an open layer for the `@atlaskit/top-layer/page-surface` entry points automatically. During
 * the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.
 */
export { useNotifyOpenLayerObserver } from '../../components/open-layer-observer/use-notify-open-layer-observer';
/**
 * @deprecated Use `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover` and
 * `@atlaskit/top-layer/page-surface/request-close-popovers`: `getCount` becomes `hasOpenDialogOrPopover` and
 * `closeLayers` becomes `requestClosePopovers`. For `onChange`, listen for `toggle` and `close`
 * in the capture phase, then call `hasOpenDialogOrPopover`. During the rollout, pass
 * `isEnabled: !fg('platform-dst-top-layer')`.
 */
export { useOpenLayerObserver } from '../../components/open-layer-observer/use-open-layer-observer';
/**
 * @deprecated Not needed with the `@atlaskit/top-layer/page-surface` entry points. Pass the element as `within`
 * instead of a namespace. During the rollout, render it only when `fg('platform-dst-top-layer')` is
 * off.
 */
export { OpenLayerObserverNamespaceProvider } from '../../components/open-layer-observer/open-layer-observer-namespace-provider';
/**
 * @deprecated Use the `@atlaskit/top-layer/page-surface` entry points instead. Pass `type: 'modal'` to `hasOpenDialogOrPopover`
 * to only count modal dialogs.
 */
export { type LayerType } from '../../components/open-layer-observer/types';
