/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

// Custom properties adapt the existing themed control to the default ADS palette.
import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useHasCustomTheme } from './has-custom-theme-context';
import { ThemedIconButton, type ThemedIconButtonProps } from './themed-icon-button';

const styles = cssMap({
	defaultTheme: {
		color: token('color.text.subtle'),
		'--ds-top-bar-button-background': token('color.background.neutral.subtle'),
		'--ds-top-bar-button-background-hovered': token('color.background.neutral.subtle.hovered'),
		'--ds-top-bar-button-background-pressed': token('color.background.neutral.subtle.pressed'),
		'--ds-top-bar-button-border': token('color.border'),
		'--ds-top-bar-button-primary-text': token('color.text.inverse'),
		'--ds-top-bar-button-primary-background': token('color.background.brand.bold'),
		'--ds-top-bar-button-primary-background-hovered': token('color.background.brand.bold.hovered'),
		'--ds-top-bar-button-primary-background-pressed': token('color.background.brand.bold.pressed'),
		'--ds-top-bar-button-selected-text': token('color.text.selected'),
		'--ds-top-bar-button-selected-background': token('color.background.selected'),
		'--ds-top-bar-button-selected-background-hovered': token('color.background.selected.hovered'),
		'--ds-top-bar-button-selected-background-pressed': token('color.background.selected.pressed'),
		'--ds-top-bar-button-selected-border': token('color.border.selected'),
		'--ds-top-bar-button-disabled-text': token('color.text.disabled'),
		'--ds-top-bar-button-disabled-background': token('color.background.disabled'),
	},
	neutralDisabled: {
		'--ds-top-bar-button-disabled-background': 'transparent',
		'--ds-top-bar-button-disabled-border': token('color.border.disabled'),
	},
});

/**
 * Keep one control mounted, including its tooltip, while its label and shape change.
 */
export const ResponsiveIconButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedIconButtonProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ThemedIconButtonProps>((props, ref) => {
	const hasCustomTheme = useHasCustomTheme();
	return (
		<span
			css={[
				!hasCustomTheme && styles.defaultTheme,
				!hasCustomTheme && props.appearance !== 'primary' && styles.neutralDisabled,
			]}
		>
			<ThemedIconButton {...props} ref={ref} />
		</span>
	);
});
