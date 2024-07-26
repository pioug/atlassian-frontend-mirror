import { default as LazyLinkPicker } from './lazy';
import { LinkPicker } from './link-picker';
import { composeLinkPicker } from './main';

/**
 * @deprecated A `/lazy` entrypoint has been added.
 * @example  Prefer the default export from the default entrypoint if you do not want a lazy-loaded version.
 * ```tsx
 * import LinkPicker from '@atlaskit/link-picker';
 * ```
 * @example Prefer the `LazyLinkPicker` export from the `/lazy` entrypoint if you want a lazy-loaded version.
 * ```tsx
 * import { LazyLinkPicker } from '@atlaskit/link-picker/lazy';
 * ```
 */
export const DeprecatedLazyLinkPickerExport = LazyLinkPicker;

// Must be a default export to be able to support prop docs
// eslint-disable-next-line import/no-default-export
export default composeLinkPicker(LinkPicker);
