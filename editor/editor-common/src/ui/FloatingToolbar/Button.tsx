import React, { forwardRef, useCallback, useEffect } from 'react';
import type { Ref } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import type { TooltipProps } from '@atlaskit/tooltip';

import type { ButtonAppearance } from '../../types';
import { Pulse } from '../Pulse/Pulse';

import { getButtonStyles, iconOnlySpacing } from './styles';

const customSizeAndPadding = {
	minWidth: token('space.400'),
	padding: `0px ${token('space.050')}`,
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
	tabIndex?: number | null | undefined;
	target?: string;
	testId?: string;
	title?: string;
	tooltipContent?: TooltipProps['content'];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tooltipStyle?: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
}

const FloatingToolbarButton = (
	{
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
		areAnyNewToolbarFlagsEnabled,
	}: Props,
	forwardedRef?: Ref<HTMLElement>,
): React.JSX.Element => {
	// Check if there's only an icon and add additional styles
	const iconOnly = (icon || iconAfter) && !children;
	const customSpacing = iconOnly ? iconOnlySpacing : {};
	const isButtonPressed = ariaHasPopup ? undefined : selected;
	/**
	 * If it's a radio button, we need to reflect false values too, hence
	 * we cast it as a Boolean
	 */
	const ariaChecked = isRadioButton ? Boolean(isButtonPressed) : undefined;
	const ariaPressed = isRadioButton ? undefined : isButtonPressed;
	useEffect(() => {
		onMount?.();
		return () => onUnmount?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOnClick = useCallback(
		(event: React.MouseEvent) => {
			onClick?.(event);
		},
		[onClick],
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
				{/*
					Move onMouseEnter/onMouseLeave from this wrapper div to the Button component below,
					which already has onFocus/onBlur handlers. This satisfies the a11y rule by pairing
					mouse events with keyboard equivalents on the same element.
				*/}
				{/* eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events */}
				<div
					onMouseEnter={
						expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true)
							? undefined
							: onMouseEnter
					}
					onMouseLeave={
						expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true)
							? undefined
							: onMouseLeave
					}
				>
					<Pulse
						pulse={!expValEquals('platform_editor_spotlight_migration', 'isEnabled', true) && pulse}
					>
						{/* TODO: (from codemod) CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles. */}
						<Button
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
							className={className}
							// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
							ref={(buttonElement) => {
								if (forwardedRef && editorExperiment('platform_synced_block', true)) {
									if (typeof forwardedRef === 'function') {
										forwardedRef(buttonElement);
									} else if (typeof forwardedRef === 'object') {
										(forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
											buttonElement;
									}
								}
							}}
							// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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
							onMouseEnter={
								expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true)
									? onMouseEnter
									: undefined
							}
							onMouseLeave={
								expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true)
									? onMouseLeave
									: undefined
							}
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
		</>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<
	Omit<Props & React.RefAttributes<HTMLElement>, 'ref'> & Props & React.RefAttributes<HTMLElement>
> = componentWithCondition(
	() => editorExperiment('platform_synced_block', true),
	forwardRef<HTMLElement, Props>(FloatingToolbarButton),
	FloatingToolbarButton,
);
export default _default_1;
