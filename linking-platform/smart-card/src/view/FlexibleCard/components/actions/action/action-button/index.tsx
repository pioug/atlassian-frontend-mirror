/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

import { css, jsx } from '@compiled/react';

import { LoadingButton } from '@atlaskit/button';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { SmartLinkSize } from '../../../../../../constants';
import { sizeToButtonSpacing } from '../../../utils';

import ActionButtonOld from './ActionButtonOld';
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
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.medium'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,@atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
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

const ActionButtonNew = ({
	appearance,
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
	return fg('bandicoots-compiled-migration-smartcard') ? (
		<ActionButtonNew {...props} />
	) : (
		<ActionButtonOld {...props} />
	);
};

export default ActionButton;
