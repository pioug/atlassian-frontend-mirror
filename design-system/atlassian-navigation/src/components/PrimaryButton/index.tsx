/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useTheme } from '../../theme';

import { getPrimaryButtonTheme } from './styles';
import { type PrimaryButtonProps } from './types';

const VAR_BUTTON_SELECTED_COLOR = '--button-selected-color';
const VAR_BUTTON_SELECTED_BORDER_COLOR = '--button-selected-border-color';

const buttonBaseStyles = css({
	display: 'flex',
	height: '100%',
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
});

const buttonNoOpStyle = css({
	'--noop': 1,
});

const buttonHighlightedStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&& > *': {
		color: `var(${VAR_BUTTON_SELECTED_COLOR})`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:after': {
		height: 3,
		position: 'absolute',
		backgroundColor: `var(${VAR_BUTTON_SELECTED_BORDER_COLOR})`,
		borderStartEndRadius: token('radius.xsmall', '1px'),
		borderStartStartRadius: token('radius.xsmall', '1px'),
		content: '""',
		insetBlockEnd: 0,
		insetInlineEnd: token('space.050', '4px'),
		insetInlineStart: token('space.050', '4px'),
	},
});

/**
 * __Primary button__
 *
 * A primary button allows you to add top-level navigation items.
 * Should be passed into `AtlassianNavigation`'s `primaryItems` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#dropdown-menu)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const PrimaryButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<PrimaryButtonProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, PrimaryButtonProps>(
	(props: PrimaryButtonProps, ref: Ref<HTMLElement>) => {
		const {
			children,
			component,
			isHighlighted,
			isLoading,
			isSelected,
			onClick,
			testId,
			theme,
			tooltip,
			...rest
		} = props;
		const themeFromContext = useTheme();

		const button = (
			<div
				style={
					{
						[VAR_BUTTON_SELECTED_COLOR]: themeFromContext.mode.primaryButton.selected.color,
						[VAR_BUTTON_SELECTED_BORDER_COLOR]:
							themeFromContext.mode.primaryButton.selected.borderColor,
					} as React.CSSProperties
				}
				css={[buttonBaseStyles, isHighlighted && buttonHighlightedStyles]}
				role="listitem"
				data-vc="primary-button"
			>
				<Button
					appearance="primary"
					component={component}
					isLoading={isLoading}
					isSelected={isSelected}
					onClick={onClick}
					ref={ref}
					testId={testId}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/design-system/no-unsafe-style-overrides
					theme={theme || getPrimaryButtonTheme(themeFromContext)}
					css={[buttonNoOpStyle] as any} // Typescript working for css mismatch error
					// These are all explicit, leaving it in just in case
					{...rest}
				>
					{children}
				</Button>
			</div>
		);

		if (tooltip) {
			return (
				<Tooltip content={tooltip} hideTooltipOnClick>
					{button}
				</Tooltip>
			);
		}

		return button;
	},
);
