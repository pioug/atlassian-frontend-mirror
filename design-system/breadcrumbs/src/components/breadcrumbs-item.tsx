/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, memo, type Ref, useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type BreadcrumbsItemProps } from '../types';

import BreadcrumbsItemBase from './internal/breadcrumbs-item-base';
import Step from './internal/step';
import StepOld from './internal/step-old';
import useOverflowable from './internal/use-overflowable';

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	height: `${24 / 14}em`,
	alignItems: 'center',
	flexDirection: 'row',
	fontFamily: token('font.family.body'),
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.0'),
	marginInlineStart: token('space.0'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:not(:last-child)::after': {
		width: '8px',
		flexShrink: 0,
		color: token('color.text.subtlest'),
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

const motionItemStyles = css({
	textDecorationColor: 'transparent',
	textDecorationLine: 'underline',
	transition: token('motion.listitem.hovered'),
	'&:hover': {
		textDecorationColor: token('color.text.subtlest'),
		transition: token('motion.listitem.hovered'),
	},
	'&:active': {
		textDecorationColor: token('color.text'),
		transition: token('motion.listitem.pressed'),
	},
});

type BreadcrumbsItemInternalProps = BreadcrumbsItemProps & {
	'aria-current'?: 'page' | boolean;
	_overflowRef?: (el: HTMLLIElement | null) => void;
};

const BreadcrumbsItem: import('react').MemoExoticComponent<
	({
		analyticsContext,
		component,
		href,
		elemBefore,
		iconAfter,
		iconBefore,
		onClick,
		onTooltipShown,
		ref,
		target,
		testId,
		text,
		truncationWidth,
		_overflowRef,
		...rest
	}: BreadcrumbsItemInternalProps) => JSX.Element
> = memo(
	({
		analyticsContext,
		component,
		// Analytics event creation comes from context via usePlatformLeafEventHandler.
		// Strip this prop so it cannot leak onto DOM-backed controls.
		createAnalyticsEvent: _createAnalyticsEvent,
		href,
		elemBefore,
		iconAfter,
		iconBefore,
		onClick,
		onTooltipShown,
		// This is overridden by the `buttonRef` below
		ref: _ref,
		target,
		testId,
		text,
		title,
		truncationWidth,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-current': ariaCurrent,
		_overflowRef,
		...rest
	}: BreadcrumbsItemInternalProps) => {
		const [stepElement, setStepElement] = useState<HTMLElement | null>(null);
		const setStepRef = useCallback((element: HTMLElement | null) => {
			setStepElement(element);
		}, []);
		const resolvedElemBefore = elemBefore ?? iconBefore;

		let iconWidthAllowance = 0;
		if (resolvedElemBefore) {
			iconWidthAllowance += ICON_WIDTH_ESTIMATE;
		}
		if (iconAfter) {
			iconWidthAllowance += ICON_WIDTH_ESTIMATE;
		}

		const [hasOverflow, shouldShowTooltip] = useOverflowable(
			truncationWidth,
			stepElement,
			fg('platform_dst_breadcrumbs-refresh') ? 0 : iconWidthAllowance,
		);

		if (!component && fg('platform_dst_breadcrumbs-refresh')) {
			return (
				<BreadcrumbsItemBase
					ref={_overflowRef}
					analyticsContext={analyticsContext}
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					elemBefore={resolvedElemBefore}
					href={href}
					// TODO(CAT-2913): Remove `iconAfter` from the refresh path once Jira stops depending on deprecated
					// `BreadcrumbsItem.iconAfter` in `src/packages/polaris/component-ideas-idea-view/tests/IssueKey.test.tsx`
					// and `src/packages/polaris/component-ideas-idea-view/tests/IssueBreadcrumbs.test.tsx`.
					// Those consumers need to move the copy-link affordance out of `BreadcrumbsItem` first.
					iconAfter={iconAfter}
					iconBefore={iconBefore}
					onClick={onClick}
					onTooltipShown={onTooltipShown}
					shouldShowTooltip={shouldShowTooltip}
					stepRef={setStepRef}
					target={target}
					testId={testId}
					text={text}
					title={title}
					truncationWidth={truncationWidth}
					aria-current={ariaCurrent}
				/>
			);
		}

		const buttonOverrideStyles: CSSProperties = {
			paddingBlock: token('space.025'),
			fontWeight: token('font.weight.regular'),
		};

		// Note: cast to `any` is required to type verification - see https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
		const dynamicItemStyles: CSSProperties = {
			[VAR_STEP_TRUNCATION_WIDTH as any]:
				typeof truncationWidth !== 'undefined' && `${truncationWidth}px`,
		};

		const step = !component ? (
			<Step
				analyticsContext={analyticsContext}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-current={ariaCurrent}
				elemBefore={resolvedElemBefore}
				href={href}
				iconAfter={iconAfter}
				iconBefore={iconBefore}
				onClick={onClick}
				ref={setStepRef}
				target={target}
				testId={testId}
				title={title}
				truncationWidth={truncationWidth}
				{...rest}
			>
				{text}
			</Step>
		) : (
			<StepOld
				analyticsContext={analyticsContext}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-current={ariaCurrent}
				component={component}
				hasOverflow={hasOverflow}
				href={href}
				iconAfter={iconAfter}
				iconBefore={resolvedElemBefore}
				onClick={onClick}
				ref={setStepRef as Ref<HTMLButtonElement>}
				target={target}
				testId={testId}
				title={title}
				css={[
					staticItemStyles,
					truncationWidth ? staticItemWithTruncationStyles : staticItemWithoutTruncationStyles,
					fg('platform-dst-motion-uplift-list-item') && motionItemStyles,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={
					truncationWidth ? { ...dynamicItemStyles, ...buttonOverrideStyles } : buttonOverrideStyles
				}
				{...rest}
			>
				{text}
			</StepOld>
		);

		return (
			<li css={itemWrapperStyles} ref={_overflowRef}>
				{shouldShowTooltip ? (
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
