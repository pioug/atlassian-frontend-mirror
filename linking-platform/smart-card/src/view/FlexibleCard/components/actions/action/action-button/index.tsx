/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { LoadingButton } from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { SmartLinkSize } from '../../../../../../constants';
import { sizeToButtonSpacing } from '../../../utils';

import { type ActionButtonProps } from './types';

const getButtonStyle = (size?: SmartLinkSize, iconOnly?: boolean) => {
	switch (size) {
		case SmartLinkSize.Large:
			return iconOnly
				? css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
						'button, button:hover, button:focus, button:active': {
							padding: 0,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
							'> span': {
								margin: 0,
							},
						},
					})
				: '';
		case SmartLinkSize.Small:
			return css({
				fontSize: '0.75rem',
				fontWeight: token('font.weight.medium'),
				lineHeight: '1rem',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				'button, button:hover, button:focus, button:active': [
					{
						lineHeight: '1rem',
					},
					iconOnly
						? `
            padding: 0.125rem;
          `
						: `
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          `,
				],
			});
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Medium:
		default:
			return '';
	}
};

const ActionButton = ({
	appearance,
	content,
	iconAfter,
	iconBefore,
	isLoading,
	onClick,
	overrideCss,
	size,
	testId,
	tooltipMessage,
	isDisabled,
	href,
	ariaLabel,
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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[getButtonStyle(size, iconOnly), overrideCss]}
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

export default ActionButton;
