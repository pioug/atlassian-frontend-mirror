/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required, @atlaskit/volt-strict-mode/no-re-exports, @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import Theme from '@atlaskit/button/theme'` instead.
 */

export { default as Theme } from '../old-button/custom-theme-button/theme';
/**
 * @deprecated Use `import CustomThemeButton from '@atlaskit/button/custom-theme-button/custom-theme-button'` instead.
 */
export { default } from '../old-button/custom-theme-button/custom-theme-button';
/**
 * @deprecated Use `import type { ThemeTokens, ThemeProps, InteractionState, CustomThemeButtonProps, CustomThemeButtonOwnProps } from '@atlaskit/button/custom-theme-button-types'` instead.
 */
export type {
	ThemeTokens,
	ThemeProps,
	InteractionState,
	CustomThemeButtonProps,
	CustomThemeButtonOwnProps,
} from '../old-button/custom-theme-button/custom-theme-button-types';
