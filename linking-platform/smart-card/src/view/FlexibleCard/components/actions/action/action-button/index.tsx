/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useCallback, useMemo } from 'react';

import { css, jsx } from '@compiled/react';

import { LoadingButton } from '@atlaskit/button';
import Button, {
	type ButtonProps,
	IconButton,
	type IconButtonProps,
	type IconProp,
	LinkButton,
	LinkIconButton,
} from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { SmartLinkSize } from '../../../../../../constants';
import { useFlexibleUiOptionContext } from '../../../../../../state/flexible-ui-context';
import { withOverrideCss } from '../../../common/with-override-css';
import { sizeToButtonSpacing } from '../../../utils';

import { type ActionButtonProps } from './types';

const IconOnlyLarge = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'button, button:hover, button:focus, button:active': {
		padding: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> span': {
			margin: 0,
		},
	},
});

const SizeSmall = css({
	font: token('font.body.small'),
	fontWeight: token('font.weight.medium'),
});

const SizeSmallIconOnly = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'button, button:hover, button:focus, button:active': {
		paddingTop: token('space.025', '0.125rem'),
		paddingRight: token('space.025', '0.125rem'),
		paddingBottom: token('space.025', '0.125rem'),
		paddingLeft: token('space.025', '0.125rem'),
	},
});

const SizeSmallNotIconOnly = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'button, button:hover, button:focus, button:active': {
		paddingLeft: token('space.050', '0.25rem'),
		paddingRight: token('space.050', '0.25rem'),
	},
});

type Appearance = 'default' | 'danger' | 'link' | 'primary' | 'subtle' | 'subtle-link' | 'warning';
const IconButtonAppearanceMap: { [key in Appearance]: IconButtonProps['appearance'] } = {
	default: 'default',
	danger: undefined,
	link: 'default',
	primary: 'primary',
	subtle: 'subtle',
	'subtle-link': 'subtle',
	warning: undefined,
};

const ButtonAppearanceMap: { [key in Appearance]: ButtonProps['appearance'] } = {
	default: 'default',
	danger: 'danger',
	link: 'default',
	primary: 'primary',
	subtle: 'subtle',
	'subtle-link': 'subtle',
	warning: 'warning',
};

const tooltipOptions: IconButtonProps['tooltip'] = {
	hideTooltipOnClick: true,
};

const ActionButtonRefresh = forwardRef(
	(
		{
			appearance = 'default',
			content,
			iconAfter,
			iconBefore,
			isLoading,
			onClick,
			size,
			testId,
			tooltipMessage,
			isDisabled,
			href,
			ariaLabel,
		}: ActionButtonProps,
		ref: React.Ref<HTMLElement>,
	) => {
		const iconOnly = !content;

		const onButtonClick = useCallback(
			(handler: Function) => (e: React.BaseSyntheticEvent) => {
				e.preventDefault();
				handler();
			},
			[],
		);

		const button = useMemo(() => {
			const isLinkButton = !!href;
			const spacing =
				size === SmartLinkSize.Large || size === SmartLinkSize.XLarge ? 'default' : 'compact';

			if (fg('platform-button-icon-spacing-cleanup')) {
				const icon = iconBefore || iconAfter;
				const iconFn = icon ? ((() => icon) as IconProp) : undefined;
				if (iconOnly && iconFn) {
					if (isLinkButton && iconFn) {
						return (
							<LinkIconButton
								appearance={IconButtonAppearanceMap[appearance]}
								icon={iconFn}
								href={href}
								isDisabled={isDisabled}
								isTooltipDisabled={false}
								label={tooltipMessage}
								onClick={onButtonClick(onClick)}
								spacing={spacing}
								testId={testId}
								tooltip={tooltipOptions}
							/>
						);
					}

					return (
						<IconButton
							appearance={IconButtonAppearanceMap[appearance]}
							icon={iconFn}
							isDisabled={isDisabled}
							isLoading={isLoading}
							isTooltipDisabled={false}
							label={tooltipMessage}
							onClick={onButtonClick(onClick)}
							spacing={spacing}
							testId={testId}
							tooltip={tooltipOptions}
						/>
					);
				}
			} else {
				if (iconOnly) {
					const icon = iconBefore || iconAfter;
					const iconFn = (() => icon || null) as IconProp;

					if (isLinkButton) {
						return (
							<LinkIconButton
								appearance={IconButtonAppearanceMap[appearance]}
								icon={iconFn}
								href={href}
								isDisabled={isDisabled}
								isTooltipDisabled={false}
								label={tooltipMessage}
								onClick={onButtonClick(onClick)}
								spacing={spacing}
								testId={testId}
								tooltip={tooltipOptions}
							/>
						);
					}

					return (
						<IconButton
							appearance={IconButtonAppearanceMap[appearance]}
							icon={iconFn}
							isDisabled={isDisabled}
							isLoading={isLoading}
							isTooltipDisabled={false}
							label={tooltipMessage}
							onClick={onButtonClick(onClick)}
							spacing={spacing}
							testId={testId}
							tooltip={tooltipOptions}
						/>
					);
				}
			}

			if (fg('platform-button-icon-spacing-cleanup')) {
				const iconBeforeFn = iconBefore ? () => iconBefore : undefined;
				const iconAfterFn = iconAfter ? () => iconAfter : undefined;

				if (isLinkButton) {
					return (
						<Tooltip
							content={tooltipMessage}
							hideTooltipOnClick={true}
							testId={`${testId}-tooltip`}
						>
							<LinkButton
								appearance={ButtonAppearanceMap[appearance]}
								aria-label={ariaLabel}
								iconAfter={iconAfterFn}
								iconBefore={iconBeforeFn}
								isDisabled={isDisabled}
								href={href}
								onClick={onButtonClick(onClick)}
								spacing={spacing}
								testId={testId}
							>
								{content}
							</LinkButton>
						</Tooltip>
					);
				}

				return (
					<Tooltip content={tooltipMessage} hideTooltipOnClick={true} testId={`${testId}-tooltip`}>
						<Button
							appearance={ButtonAppearanceMap[appearance]}
							aria-label={ariaLabel}
							iconAfter={iconAfterFn}
							iconBefore={iconBeforeFn}
							isDisabled={isDisabled}
							isLoading={isLoading}
							onClick={onButtonClick(onClick)}
							spacing={spacing}
							testId={testId}
						>
							{content}
						</Button>
					</Tooltip>
				);
			} else {
				const iconBeforeFn = (() => iconBefore || null) as IconProp;
				const iconAfterFn = (() => iconAfter || null) as IconProp;
				if (isLinkButton) {
					return (
						<Tooltip
							content={tooltipMessage}
							hideTooltipOnClick={true}
							testId={`${testId}-tooltip`}
						>
							<LinkButton
								appearance={ButtonAppearanceMap[appearance]}
								aria-label={ariaLabel}
								iconAfter={iconAfterFn}
								iconBefore={iconBeforeFn}
								isDisabled={isDisabled}
								href={href}
								onClick={onButtonClick(onClick)}
								spacing={spacing}
								testId={testId}
							>
								{content}
							</LinkButton>
						</Tooltip>
					);
				}

				return (
					<Tooltip content={tooltipMessage} hideTooltipOnClick={true} testId={`${testId}-tooltip`}>
						<Button
							appearance={ButtonAppearanceMap[appearance]}
							aria-label={ariaLabel}
							iconAfter={iconAfterFn}
							iconBefore={iconBeforeFn}
							isDisabled={isDisabled}
							isLoading={isLoading}
							onClick={onButtonClick(onClick)}
							spacing={spacing}
							testId={testId}
						>
							{content}
						</Button>
					</Tooltip>
				);
			}
		}, [
			appearance,
			ariaLabel,
			content,
			href,
			iconAfter,
			iconBefore,
			iconOnly,
			isDisabled,
			isLoading,
			onButtonClick,
			onClick,
			size,
			testId,
			tooltipMessage,
		]);

		return (
			<Box testId={`${testId}-button-wrapper`} ref={ref}>
				{button}
			</Box>
		);
	},
);

const ActionButtonRefreshWithOverrideCss = withOverrideCss(ActionButtonRefresh);

const ActionButtonNew = ({
	appearance = 'default',
	content,
	iconAfter,
	iconBefore,
	isLoading,
	onClick,
	size,
	testId,
	tooltipMessage,
	isDisabled,
	href,
	ariaLabel,
	className,
}: ActionButtonProps) => {
	const iconOnly = !content;

	const onButtonClick = useCallback(
		(handler: Function) => (e: React.BaseSyntheticEvent) => {
			e.preventDefault();
			handler();
		},
		[],
	);

	return (
		<div
			css={[
				size === SmartLinkSize.Large && iconOnly && IconOnlyLarge,
				size === SmartLinkSize.Small && SizeSmall,
				size === SmartLinkSize.Small && iconOnly && SizeSmallIconOnly,
				size === SmartLinkSize.Small && !iconOnly && SizeSmallNotIconOnly,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			data-testid={`${testId}-button-wrapper`}
		>
			<Tooltip content={tooltipMessage} hideTooltipOnClick={true} testId={`${testId}-tooltip`}>
				<LoadingButton
					appearance={appearance}
					iconAfter={iconAfter}
					iconBefore={iconBefore}
					isDisabled={isDisabled}
					isLoading={isLoading}
					onClick={onButtonClick(onClick)}
					spacing={sizeToButtonSpacing[size]}
					testId={testId}
					href={href}
					aria-label={ariaLabel}
				>
					{content}
				</LoadingButton>
			</Tooltip>
		</div>
	);
};

const ActionButton = (props: ActionButtonProps): JSX.Element => {
	const ui = useFlexibleUiOptionContext();
	if (ui?.hideLegacyButton || ui?.removeBlockRestriction) {
		return <ActionButtonRefreshWithOverrideCss {...props} />;
	}
	return <ActionButtonNew {...props} />;
};

export default ActionButton;
