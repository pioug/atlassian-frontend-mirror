/**
 * @deprecated Render the surface with `@atlaskit/top-layer` (a `Popover` with `onClose`, or a
 * `Dialog`). It is then an open layer for the `@atlaskit/top-layer/page-surface` entry points automatically. During
 * the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.
 */
export { useNotifyOpenLayerObserver } from '../../components/open-layer-observer/use-notify-open-layer-observer';
