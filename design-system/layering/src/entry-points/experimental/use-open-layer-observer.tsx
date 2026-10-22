/**
 * @deprecated Use `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover` and
 * `@atlaskit/top-layer/page-surface/request-close-popovers`: `getCount` becomes `hasOpenDialogOrPopover` and
 * `closeLayers` becomes `requestClosePopovers`. For `onChange`, listen for `toggle` and `close`
 * in the capture phase, then call `hasOpenDialogOrPopover`. During the rollout, pass
 * `isEnabled: !fg('platform-dst-top-layer')`.
 */
export { useOpenLayerObserver } from '../../components/open-layer-observer/use-open-layer-observer';
