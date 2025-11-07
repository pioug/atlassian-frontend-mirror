/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Lozenge from '@atlaskit/lozenge';
import { token } from '@atlaskit/tokens';

import { type LozengeProps } from '../types';
import { isLozengeText } from './utils';
import { fg } from '@atlaskit/platform-feature-flags';

const AsyncTooltip = React.lazy(() =>
	import(/* webpackChunkName: "@atlaskit-internal_@atlaskit/tooltip" */ '@atlaskit/tooltip').then(
		(module) => {
			return {
				default: module.default,
			};
		},
	),
);

const wrapper = (isDisabled?: boolean) => {
	if (fg('platform_user_picker_firefox_tab_fix')) {
		return css({
			alignItems: 'center',
			boxSizing: 'border-box',
			display: 'flex',
			outline: 'none',
			margin: 0,
			width: '100%',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			cursor: isDisabled ? 'not-allowed' : 'pointer',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			opacity: isDisabled ? token('opacity.disabled', '0.4') : undefined,
		});
	}

	return css({
		alignItems: 'center',
		boxSizing: 'border-box',
		display: 'flex',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1,
		outline: 'none',
		margin: 0,
		width: '100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		cursor: isDisabled ? 'not-allowed' : 'pointer',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		opacity: isDisabled ? token('opacity.disabled', '0.4') : undefined,
	});
};

const optionWrapper = css({
	maxWidth: '100%',
	minWidth: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '1.4',
	paddingLeft: token('space.100', '8px'),
});

const optionWrapperFix = css({
	display: 'inline-block',
	overflow: 'hidden',
	minWidth: 0,
	maxWidth: '100%',
	paddingLeft: token('space.100', '8px'),
});

const getTextStyle = (isSecondary?: boolean) => {
	const secondaryCssArgs = isSecondary ? { font: token('font.body.small') } : {};

	if (fg('platform_user_picker_firefox_tab_fix')) {
		return css({
			margin: 0,
			maxWidth: '100%',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			...secondaryCssArgs,
		});
	}

	return css({
		margin: 0,
		overflowX: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...secondaryCssArgs,
	});
};

const additionalInfo = css({
	float: 'right',
	marginLeft: token('space.100', '8px'),
});

export const textWrapper = (color?: string) => {
	if (fg('platform_user_picker_firefox_tab_fix')) {
		return css({
			display: 'inline-block',
			verticalAlign: 'bottom',
			maxWidth: '100%',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color,
		});
	}

	return css({
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		display: 'inline',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color,
	});
};

export type AvatarItemOptionProps = {
	avatar: ReactNode;
	isDisabled?: boolean;
	lozenge?: ReactNode | LozengeProps;
	primaryText?: ReactNode;
	secondaryText?: ReactNode;
};

export const AvatarItemOption = ({
	avatar,
	isDisabled,
	lozenge,
	primaryText,
	secondaryText,
}: AvatarItemOptionProps) => {
	const renderLozenge = () => {
		if (isLozengeText(lozenge)) {
			if (lozenge?.tooltip) {
				// Note that entire Lozenge must be wrapped in the Tooltip (rather than just the
				// Lozenge text) or tooltip won't work
				return (
					<React.Suspense fallback={<Lozenge {...lozenge}>{lozenge.text}</Lozenge>}>
						<AsyncTooltip content={lozenge.tooltip}>
							<Lozenge {...lozenge}>{lozenge.text}</Lozenge>
						</AsyncTooltip>
					</React.Suspense>
				);
			}

			return <Lozenge {...lozenge}>{lozenge.text}</Lozenge>;
		}

		return lozenge;
	};

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<span css={wrapper(isDisabled)}>
			{avatar}
			<div css={fg('platform_user_picker_firefox_tab_fix') ? optionWrapperFix : optionWrapper}>
				<div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={getTextStyle()}>{primaryText}</div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					{secondaryText && <div css={getTextStyle(true)}>{secondaryText}</div>}
				</div>
			</div>
			{lozenge && <div css={additionalInfo}>{renderLozenge()}</div>}
		</span>
	);
};
