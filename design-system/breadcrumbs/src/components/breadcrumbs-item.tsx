/** @jsx jsx */

import { type ComponentType, type CSSProperties, memo, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip, { type TooltipProps } from '@atlaskit/tooltip';

import { type BreadcrumbsItemProps } from '../types';

import Step from './internal/step';
import useOverflowable from './internal/use-overflowable';

const height = (gridSize() * 3) / fontSize();

const AKTooltip = lazyForPaint(
	() => import(/* webpackChunkName: "@atlaskit-internal_Tooltip" */ '@atlaskit/tooltip'),
	{ ssr: false },
) as ComponentType<TooltipProps>;

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${height}em`,
	margin: token('space.0', '0px'),
	padding: token('space.0', '0px'),
	flexDirection: 'row',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: `${height}em`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:not(:last-child)::after': {
		width: '8px',
		padding: `${token('space.0', '0px')} ${token('space.100', '8px')}`,
		flexShrink: 0,
		content: '"/"',
		textAlign: 'center',
	},
});

const VAR_STEP_TRUNCATION_WIDTH = '--max-width';
const ICON_WIDTH_ESTIMATE = 24;

const staticItemWithTruncationStyles = css({
	maxWidth: `var(${VAR_STEP_TRUNCATION_WIDTH})`,
	fontWeight: token('font.weight.regular'),
});

const staticItemWithoutTruncationStyles = css({
	minWidth: 0,
	flexShrink: 1,
	fontWeight: token('font.weight.regular'),
});

const BreadcrumbsItem = memo((props: BreadcrumbsItemProps) => {
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const { truncationWidth, text, onTooltipShown, ...restButtonProps } = props;

	// If icons are provided we include their width in the truncation calculation to ensure we're as accurate as possible.
	// Note: this assumes icons are 24px wide which should be almost always.
	// Not really an issue if the icons are smaller, just that truncation occurs slightly earlier than you may want.
	let iconWidthAllowance = 0;
	if (props.iconBefore) {
		iconWidthAllowance += ICON_WIDTH_ESTIMATE;
	}
	if (props.iconAfter) {
		iconWidthAllowance += ICON_WIDTH_ESTIMATE;
	}

	const [hasOverflow, showTooltip] = useOverflowable(
		truncationWidth,
		buttonRef.current,
		iconWidthAllowance,
	);
	const buttonProps = {
		...restButtonProps,
		ref: buttonRef,
		hasOverflow: hasOverflow,
	};

	// Note: cast to `any` is required to type verification - see https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
	const dynamicItemStyles: CSSProperties = {
		[VAR_STEP_TRUNCATION_WIDTH as any]:
			typeof truncationWidth !== 'undefined' && `${truncationWidth}px`,
	};

	const step = truncationWidth ? (
		<Step
			{...buttonProps}
			css={staticItemWithTruncationStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={dynamicItemStyles}
		>
			{text}
		</Step>
	) : (
		<Step {...buttonProps} css={staticItemWithoutTruncationStyles}>
			{text}
		</Step>
	);

	if (
		getBooleanFF('platform.design-system-team.remove-lazy-loading-of-tooltip-in-breadcrumbs_pki8p')
	) {
		return (
			<li css={itemWrapperStyles}>
				{showTooltip ? (
					<Tooltip content={text} position="bottom" onShow={onTooltipShown}>
						{step}
					</Tooltip>
				) : (
					step
				)}
			</li>
		);
	}

	return (
		<li css={itemWrapperStyles}>
			{showTooltip ? (
				/* The div exists because of tooltip */
				<LazySuspense fallback={<div>{step}</div>}>
					<AKTooltip content={text} position="bottom" onShow={onTooltipShown}>
						{step}
					</AKTooltip>
				</LazySuspense>
			) : (
				step
			)}
		</li>
	);
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsItem;
