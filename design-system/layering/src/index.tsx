/**
 * @deprecated The browser top layer handles stacking and Escape natively. Use `@atlaskit/top-layer`
 * (DS components use it on their `platform-dst-top-layer` path). To check whether an overlay is
 * open, use `hasOpenDialogOrPopover` from `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover`. During the rollout, do not render
 * `Layering` when `fg('platform-dst-top-layer')` is on.
 */
export { Layering } from './components/layering';
/**
 * @deprecated The browser top layer handles stacking and Escape natively. Use `@atlaskit/top-layer`
 * (DS components use it on their `platform-dst-top-layer` path). To close a page surface (for
 * example a side panel) on Escape, use `useCloseOnUnclaimedEscape` from `@atlaskit/top-layer/page-surface/use-close-on-unclaimed-escape`.
 * During the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.
 */
export { useCloseOnEscapePress } from './hooks/use-close-on-escape-press';
/**
 * @deprecated The browser top layer handles stacking and Escape natively. Use `@atlaskit/top-layer`
 * (DS components use it on their `platform-dst-top-layer` path). To check whether an overlay is
 * open, for example to ignore keys, use `hasOpenDialogOrPopover` from `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover`.
 * During the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.
 */
export { useLayering } from './hooks/use-layering';
