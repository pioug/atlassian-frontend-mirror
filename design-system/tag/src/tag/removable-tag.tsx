import InternalRemovableTag from './internal/removable';

export { default } from './internal/removable';
export type { RemovableTagProps } from './internal/removable';

/**
 * @deprecated `RemovableTag` is deprecated. Use the default `Tag` export from
 * `@atlaskit/tag` instead, which is removable by default, e.g. `<Tag text="…" />`.
 */
export const RemovableTag: typeof InternalRemovableTag = InternalRemovableTag;
