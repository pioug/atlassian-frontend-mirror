/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required, @atlaskit/volt-strict-mode/no-re-exports, @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// Ideally this file is not used directly. But rather, you go through the entry points
/**
 * @deprecated Use `import type { Appearance, Spacing, BaseOwnProps, BaseProps } from '@atlaskit/button/old-button/types'` instead.
 */
export type { Appearance, Spacing, BaseOwnProps, BaseProps } from './old-button/types';
/**
 * @deprecated Use `import Button from '@atlaskit/button/button'` instead.
 */
export { default } from './old-button/button';
/**
 * @deprecated Use `import type { ButtonProps } from '@atlaskit/button/button'` instead.
 */
export type { ButtonProps } from './old-button/button';
/**
 * @deprecated Use `import LoadingButton from '@atlaskit/button/loading-button'` instead.
 */
export { default as LoadingButton } from './old-button/loading-button';
/**
 * @deprecated Use `import type { LoadingButtonProps, LoadingButtonOwnProps } from '@atlaskit/button/loading-button'` instead.
 */
export type { LoadingButtonProps, LoadingButtonOwnProps } from './old-button/loading-button';
/**
 * @deprecated Use `import CustomThemeButton from '@atlaskit/button/custom-theme-button/custom-theme-button'` instead.
 */
export { default as CustomThemeButton } from './old-button/custom-theme-button/custom-theme-button';
/**
 * @deprecated Use `import Theme from '@atlaskit/button/theme'` instead.
 */
export { default as Theme } from './old-button/custom-theme-button/theme';
/**
 * @deprecated Use `import type { ThemeTokens, ThemeProps, InteractionState, CustomThemeButtonProps, CustomThemeButtonOwnProps } from '@atlaskit/button/custom-theme-button-types'` instead.
 */
export type {
	ThemeTokens,
	ThemeProps,
	InteractionState,
	CustomThemeButtonProps,
	CustomThemeButtonOwnProps,
} from './old-button/custom-theme-button/custom-theme-button-types';
/**
 * @deprecated Use `import ButtonGroup from '@atlaskit/button/button-group'` instead.
 */
export { default as ButtonGroup } from './containers/button-group';
/**
 * @deprecated Use `import type { ButtonGroupProps } from '@atlaskit/button/button-group'` instead.
 */
export type { ButtonGroupProps } from './containers/button-group';
