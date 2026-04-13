// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type ThemeProps, type ThemeTokens } from './custom-theme-button-types';

export function defaultThemeFn(
	current: (values: ThemeProps) => ThemeTokens,
	values: ThemeProps,
): ThemeTokens {
	return current(values);
}
