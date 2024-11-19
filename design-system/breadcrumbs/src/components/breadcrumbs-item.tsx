/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, memo, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type BreadcrumbsItemProps } from '../types';

import Step from './internal/step';
import useOverflowable from './internal/use-overflowable';

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	height: `${24 / 14}em`,
	margin: token('space.0', '0px'),
	padding: token('space.0', '0px'),
	flexDirection: 'row',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:not(:last-child)::after': {
		width: '8px',
		flexShrink: 0,
		content: '"/"',
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
		textAlign: 'center',
	},
});

const VAR_STEP_TRUNCATION_WIDTH = '--max-width';
const ICON_WIDTH_ESTIMATE = 24;

const staticItemStyles = css({
	// TODO: Replace fontWeight and lineHeight with "font: token('font.body')" and remove all the !important once Button is migrated to compiled
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	fontWeight: `${token('font.weight.regular')} !important`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	lineHeight: `20px !important`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	paddingBlock: `${token('space.025')} !important`,
});

const staticItemWithTruncationStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	maxWidth: `var(${VAR_STEP_TRUNCATION_WIDTH}) !important`,
});

const staticItemWithoutTruncationStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	minWidth: `0 !important`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	flexShrink: `1 !important`,
});

const BreadcrumbsItem = memo(
	({
		analyticsContext,
		component,
		// `createAnalyticsEvent` should be here, but throws errors on render since
		// it ends up being spread on a DOM element at the very end
		href,
		iconAfter,
		iconBefore,
		onClick,
		onTooltipShown,
		// This is overridden by the `buttonRef` below
		ref,
		target,
		testId,
		text,
		truncationWidth,
		// I believe there is only `createAnalyticsEvent` left on here, but leaving
		// it here to allow this to be a patch and not a major
		...rest
	}: BreadcrumbsItemProps) => {
		const buttonRef = useRef<HTMLButtonElement | null>(null);

		// If icons are provided we include their width in the truncation calculation to ensure we're as accurate as possible.
		// Note: this assumes icons are 24px wide which should be almost always.
		// Not really an issue if the icons are smaller, just that truncation occurs slightly earlier than you may want.
		let iconWidthAllowance = 0;
		if (iconBefore) {
			iconWidthAllowance += ICON_WIDTH_ESTIMATE;
		}
		if (iconAfter) {
			iconWidthAllowance += ICON_WIDTH_ESTIMATE;
		}

		const [hasOverflow, showTooltip] = useOverflowable(
			truncationWidth,
			buttonRef.current,
			iconWidthAllowance,
		);

		// Note: cast to `any` is required to type verification - see https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
		const dynamicItemStyles: CSSProperties = {
			[VAR_STEP_TRUNCATION_WIDTH as any]:
				typeof truncationWidth !== 'undefined' && `${truncationWidth}px`,
		};

		const step = (
			<Step
				{...rest}
				analyticsContext={analyticsContext}
				component={component}
				hasOverflow={hasOverflow}
				href={href}
				iconAfter={iconAfter}
				iconBefore={iconBefore}
				onClick={onClick}
				ref={buttonRef}
				target={target}
				testId={testId}
				css={[
					staticItemStyles,
					truncationWidth ? staticItemWithTruncationStyles : staticItemWithoutTruncationStyles,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={truncationWidth ? dynamicItemStyles : undefined}
			>
				{text}
			</Step>
		);

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
	},
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsItem;
