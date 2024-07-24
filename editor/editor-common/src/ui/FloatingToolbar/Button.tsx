import React, { useEffect } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';

import type { ButtonAppearance } from '../../types';

import { getButtonStyles, iconOnlySpacing } from './styles';

export type { ButtonAppearance };
export interface Props {
	title?: string;
	icon?: React.ReactElement<any>;
	iconAfter?: React.ReactElement<any>;
	onClick?: React.MouseEventHandler;
	onKeyDown?: React.KeyboardEventHandler;
	onMouseEnter?: <T>(event: React.MouseEvent<T>) => void;
	onMouseLeave?: <T>(event: React.MouseEvent<T>) => void;
	onFocus?: <T>(event: React.FocusEvent<T>) => void;
	onBlur?: <T>(event: React.FocusEvent<T>) => void;
	onMount?: () => void;
	selected?: boolean;
	disabled?: boolean;
	appearance?: ButtonAppearance;
	ariaHasPopup?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | undefined;
	ariaLabel?: string;
	href?: string;
	target?: string;
	children?: React.ReactNode;
	className?: string;
	tooltipContent?: React.ReactNode;
	tooltipStyle?: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
	testId?: string;
	hideTooltipOnClick?: boolean;
	tabIndex?: number | null | undefined;
	areaControls?: string;
	isRadioButton?: boolean;
}

export default ({
	title,
	icon,
	iconAfter,
	onClick,
	onKeyDown,
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	onMount,
	selected,
	disabled,
	href,
	target,
	appearance = 'subtle',
	children,
	className,
	tooltipContent,
	tooltipStyle,
	testId,
	hideTooltipOnClick = true,
	ariaHasPopup,
	tabIndex,
	areaControls,
	ariaLabel,
	isRadioButton,
}: Props) => {
	// Check if there's only an icon and add additional styles
	const iconOnly = (icon || iconAfter) && !children;
	const customSpacing = iconOnly ? iconOnlySpacing : {};
	const isButtonPressed = ariaHasPopup ? undefined : selected;
	const ariaChecked = isRadioButton ? isButtonPressed : undefined;
	const ariaPressed = isRadioButton ? undefined : isButtonPressed;

	useEffect(() => {
		if (onMount) {
			onMount();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Tooltip
			// Only fallback to title for tooltip if title is not shown
			content={tooltipContent || (iconOnly ? title : undefined)}
			component={tooltipStyle}
			hideTooltipOnClick={hideTooltipOnClick}
			position="top"
		>
			<div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
				{/* TODO: (from codemod) CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles. */}
				<Button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					theme={(adgTheme, themeProps) => {
						const { buttonStyles, ...rest } = adgTheme(themeProps);
						return {
							buttonStyles: {
								...buttonStyles,
								...customSpacing,
								...(appearance === 'danger' &&
									getButtonStyles({
										appearance,
										state: themeProps.state,
										mode: themeProps.mode,
									})),
							},
							...rest,
						};
					}}
					aria-label={ariaLabel || title}
					aria-pressed={ariaPressed}
					aria-checked={ariaChecked}
					role={isRadioButton ? 'radio' : undefined}
					aria-expanded={ariaHasPopup ? selected : undefined}
					aria-controls={ariaHasPopup ? areaControls : undefined}
					spacing={'compact'}
					href={href}
					target={target}
					appearance={appearance}
					aria-haspopup={ariaHasPopup}
					iconBefore={icon || undefined}
					iconAfter={iconAfter}
					onClick={onClick}
					onKeyDown={onKeyDown}
					isSelected={selected}
					isDisabled={disabled}
					testId={testId}
					onFocus={onFocus}
					onBlur={onBlur}
					// @ts-ignore
					// tabIndex set as 0 by default in the design system  ButtonBase component
					// this is not expected for all buttons, we have to use tabIndex={null} for some cases
					// should be fixed here https://a11y-internal.atlassian.net/browse/DST-287
					tabIndex={tabIndex}
				>
					{children}
				</Button>
			</div>
		</Tooltip>
	);
};
