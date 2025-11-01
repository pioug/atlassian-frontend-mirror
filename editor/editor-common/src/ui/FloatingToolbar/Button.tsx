import React, { useCallback, useEffect, useState } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { token } from '@atlaskit/tokens';
import Tooltip, { type TooltipProps } from '@atlaskit/tooltip';

import type { ButtonAppearance } from '../../types';
import type { FloatingToolbarButtonSpotlightConfig } from '../../types/floating-toolbar';
import { Pulse } from '../Pulse/Pulse';

import { ButtonSpotlightCard } from './ButtonSpotlightCard';
import { getButtonStyles, iconOnlySpacing } from './styles';

const customSizeAndPadding = {
	minWidth: token('space.400', '32px'),
	padding: `0px ${token('space.050', '4px')}`,
};

export interface Props {
	appearance?: ButtonAppearance;
	areaControls?: string;
	areAnyNewToolbarFlagsEnabled: boolean;
	ariaHasPopup?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | undefined;
	ariaLabel?: string;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	hideTooltipOnClick?: boolean;
	href?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: React.ReactElement<any>;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	iconAfter?: React.ReactElement<any>;
	interactionName?: string;
	isRadioButton?: boolean;
	onBlur?: <T>(event: React.FocusEvent<T>) => void;
	onClick?: React.MouseEventHandler;
	onFocus?: <T>(event: React.FocusEvent<T>) => void;
	onKeyDown?: React.KeyboardEventHandler;
	onMount?: () => void;
	onMouseEnter?: <T>(event: React.MouseEvent<T>) => void;
	onMouseLeave?: <T>(event: React.MouseEvent<T>) => void;
	onUnmount?: () => void;
	/** If true, the component will have pulse onboarding effect around it. */
	pulse?: boolean;
	selected?: boolean;
	spotlightConfig?: FloatingToolbarButtonSpotlightConfig;
	tabIndex?: number | null | undefined;
	target?: string;
	testId?: string;
	title?: string;
	tooltipContent?: TooltipProps['content'];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tooltipStyle?: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
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
	onUnmount,
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
	interactionName,
	hideTooltipOnClick = true,
	ariaHasPopup,
	tabIndex,
	areaControls,
	ariaLabel,
	isRadioButton,
	pulse,
	spotlightConfig,
	areAnyNewToolbarFlagsEnabled,
}: Props) => {
	// Check if there's only an icon and add additional styles
	const iconOnly = (icon || iconAfter) && !children;
	const customSpacing = iconOnly ? iconOnlySpacing : {};
	const isButtonPressed = ariaHasPopup ? undefined : selected;
	const ariaChecked = isRadioButton ? isButtonPressed : undefined;
	const ariaPressed = isRadioButton ? undefined : isButtonPressed;
	const [spotlightReferenceElement, setSpotlightReferenceElement] = useState<HTMLElement | null>(
		null,
	);

	useEffect(() => {
		onMount?.();
		return () => onUnmount?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSpotlightTargetClick = spotlightConfig?.isSpotlightOpen
		? spotlightConfig?.onTargetClick
		: undefined;
	const handleOnClick = useCallback(
		(event: React.MouseEvent) => {
			// fire the spotlight onTargetClick callback if a spotlight is rendered and callback is provided
			onSpotlightTargetClick?.();

			onClick?.(event);
		},
		[onClick, onSpotlightTargetClick],
	);

	return (
		<>
			<Tooltip
				// Only fallback to title for tooltip if title is not shown
				content={tooltipContent || (iconOnly ? title : undefined)}
				component={tooltipStyle}
				hideTooltipOnClick={hideTooltipOnClick}
				position="top"
			>
				{/* eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events*/}
				<div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
					<Pulse pulse={pulse || spotlightConfig?.pulse}>
						{/* TODO: (from codemod) CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles. */}
						<Button
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
							className={className}
							ref={(buttonElement) => setSpotlightReferenceElement(buttonElement)}
							// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
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
										...(areAnyNewToolbarFlagsEnabled ? customSizeAndPadding : {}),
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
							spacing={areAnyNewToolbarFlagsEnabled ? 'default' : 'compact'}
							href={href}
							target={target}
							appearance={appearance}
							aria-haspopup={ariaHasPopup}
							iconBefore={icon || undefined}
							iconAfter={iconAfter}
							onClick={handleOnClick}
							onKeyDown={onKeyDown}
							isSelected={selected}
							isDisabled={disabled}
							testId={testId}
							interactionName={interactionName}
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
					</Pulse>
				</div>
			</Tooltip>
			{spotlightConfig?.isSpotlightOpen && spotlightReferenceElement && (
				<ButtonSpotlightCard
					referenceElement={spotlightReferenceElement}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...spotlightConfig.spotlightCardOptions}
				/>
			)}
		</>
	);
};
