/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, memo, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type BreadcrumbsItemProps } from '../types';

import Step from './internal/step';
import StepOld from './internal/step-old';
import useOverflowable from './internal/use-overflowable';

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	height: `${24 / 14}em`,
	flexDirection: 'row',
	fontFamily: token('font.family.body'),
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.0', '0px'),
	marginInlineStart: token('space.0', '0px'),
	paddingBlockEnd: token('space.0', '0px'),
	paddingBlockStart: token('space.0', '0px'),
	paddingInlineEnd: token('space.0', '0px'),
	paddingInlineStart: token('space.0', '0px'),
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/design-system/use-tokens-typography
	lineHeight: `20px !important`,
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
		const stepTextRef = useRef<HTMLButtonElement | null>(null);

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
			stepTextRef.current,
			iconWidthAllowance,
		);

		// This should be a part of staticItemStyles but it requires the !important flag to prevent the padding from being overridden by the button styles
		// compiled treats `${token(xxx)} !important` differently when concat !important in es2019 and esm built files
		// the padding and font weight were not sourced correctly in the esm build
		const buttonOverrideStyles: CSSProperties = {
			paddingBlock: token('space.025'),
			fontWeight: token('font.weight.regular'),
		};

		// Note: cast to `any` is required to type verification - see https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
		const dynamicItemStyles: CSSProperties = {
			[VAR_STEP_TRUNCATION_WIDTH as any]:
				typeof truncationWidth !== 'undefined' && `${truncationWidth}px`,
		};

		const step =
			!component && fg('platform_dst_breadcrumbs_step_conversion') ? (
				<Step
					ref={stepTextRef}
					analyticsContext={analyticsContext}
					href={href}
					iconAfter={iconAfter}
					iconBefore={iconBefore}
					onClick={onClick}
					target={target}
					testId={testId}
					truncationWidth={truncationWidth}
				>
					{text}
				</Step>
			) : (
				<StepOld
					{...rest}
					analyticsContext={analyticsContext}
					component={component}
					hasOverflow={hasOverflow}
					href={href}
					iconAfter={iconAfter}
					iconBefore={iconBefore}
					onClick={onClick}
					ref={stepTextRef}
					target={target}
					testId={testId}
					css={[
						staticItemStyles,
						truncationWidth ? staticItemWithTruncationStyles : staticItemWithoutTruncationStyles,
					]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={
						truncationWidth
							? { ...dynamicItemStyles, ...buttonOverrideStyles }
							: buttonOverrideStyles
					}
				>
					{text}
				</StepOld>
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
