/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required, @atlaskit/volt-strict-mode/no-re-exports, @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import Button, { ButtonProps } from '@atlaskit/button/default/button'` instead.
 */

export { default, type ButtonProps } from '../new-button/variants/default/button';
/**
 * @deprecated Use `import LinkButton, { LinkButtonProps } from '@atlaskit/button/link'` instead.
 */
export { default as LinkButton, type LinkButtonProps } from '../new-button/variants/default/link';
/**
 * @deprecated Use `import IconButton, { IconButtonProps } from '@atlaskit/button/icon/button'` instead.
 */
export { default as IconButton, type IconButtonProps } from '../new-button/variants/icon/button';
/**
 * @deprecated Use `import LinkIconButton, { LinkIconButtonProps } from '@atlaskit/button/icon/link'` instead.
 */
export {
	default as LinkIconButton,
	type LinkIconButtonProps,
} from '../new-button/variants/icon/link';
/**
 * @deprecated Use `import { SplitButton } from '@atlaskit/button/split-button/split-button'` instead.
 */
export { SplitButton } from '../new-button/containers/split-button/split-button';

/**
 * @deprecated Use `import type { Appearance, Spacing, IconProp, IconButtonSpacing, IconButtonAppearance } from '@atlaskit/button/variants/types'` instead.
 */
export type {
	Appearance,
	Spacing,
	IconProp,
	IconButtonSpacing,
	IconButtonAppearance,
} from '../new-button/variants/types';
