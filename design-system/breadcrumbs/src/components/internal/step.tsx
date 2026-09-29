/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, type Ref } from 'react';

import { cssMap as unboundedCssMap } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { cssMap, cx, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Anchor, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { BreadcrumbsItemProps } from '../../types';
import { useBreadcrumbsSize } from './use-breadcrumbs-size';

type StepProps = {
	children?: BreadcrumbsItemProps['text'];
	'aria-current'?: 'page' | boolean;
	'aria-label'?: BreadcrumbsItemProps['aria-label'];
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- Standard ARIA attribute retained for backwards-compatible prop passthrough.
	'aria-labelledby'?: BreadcrumbsItemProps['aria-labelledby'];
	'aria-describedby'?: React.HTMLAttributes<HTMLElement>['aria-describedby'];
	analyticsContext?: BreadcrumbsItemProps['analyticsContext'];
	elemBefore?: BreadcrumbsItemProps['elemBefore'];
	href?: BreadcrumbsItemProps['href'];
	target?: BreadcrumbsItemProps['target'];
	iconBefore?: BreadcrumbsItemProps['iconBefore'];
	iconAfter?: BreadcrumbsItemProps['iconAfter'];
	onClick?: BreadcrumbsItemProps['onClick'];
	onBlur?: React.FocusEventHandler<HTMLElement>;
	onFocus?: React.FocusEventHandler<HTMLElement>;
	onMouseDown?: React.MouseEventHandler<HTMLElement>;
	onMouseMove?: React.MouseEventHandler<HTMLElement>;
	onMouseOut?: React.MouseEventHandler<HTMLElement>;
	onMouseOver?: React.MouseEventHandler<HTMLElement>;
	testId?: BreadcrumbsItemProps['testId'];
	title?: BreadcrumbsItemProps['title'];
	truncationWidth?: BreadcrumbsItemProps['truncationWidth'];
	triggerProps?: Pick<
		React.HTMLAttributes<HTMLElement>,
		| 'aria-describedby'
		| 'onBlur'
		| 'onClick'
		| 'onFocus'
		| 'onMouseDown'
		| 'onMouseMove'
		| 'onMouseOut'
		| 'onMouseOver'
	>;
};

const analyticsAttributes = {
	componentName: 'breadcrumbsItem',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const noop = __noop;

const styles = cssMap({
	root: {
		font: token('font.body'),
		paddingInline: token('space.0'),
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtlest'),
		border: 'none',
		display: 'inline-flex',
		alignItems: 'center',
		gap: token('space.050'),
		borderRadius: token('radius.xsmall'),
		textDecoration: 'none',

		'&:hover': {
			textDecoration: 'underline',
			color: token('color.text.subtlest'),
		},
		'&:focus': {
			textDecoration: 'none',
			color: token('color.text.subtlest'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text'),
		},
	},
	rootSmall: {
		font: token('font.body.small'),
	},
	rootRefresh: {
		boxSizing: 'border-box',
		gap: token('space.0'),
		height: '1.5rem',
	},
	interactiveMotion: {
		textDecorationLine: 'underline',
		textDecorationColor: 'transparent',
		transition: token('motion.listitem.hovered'),
		'&:hover': {
			textDecorationColor: token('color.text.subtlest'),
			transition: token('motion.listitem.hovered'),
		},
		'&:active': {
			transition: token('motion.listitem.pressed'),
			textDecorationColor: token('color.text'),
		},
	},
	withoutTruncation: {
		minWidth: '0px',
		flexShrink: '1',
	},
	withTruncation: {
		minWidth: '0px',
	},
	iconWrapper: {
		display: 'inline-flex',
		flexShrink: '0',
		width: '24px',
		height: '24px',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	iconWrapperSpacing: {
		marginInlineEnd: token('space.025'),
	},
	iconWrapperSmallSpacing: {
		marginInlineEnd: token('space.0'),
	},
	text: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	textWithIconAfter: {
		marginInlineEnd: token('space.050'),
	},
	textWithTruncation: {
		minWidth: '0px',
		maxWidth: '100%',
		flexShrink: '1',
	},
});

const unboundedStyles = unboundedCssMap({
	iconWrapperRefresh: {
		width: token('space.300'),
		height: token('space.300'),
	},
	iconWrapperSmall: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Preserve small icon sizing without mutating the child element.
		'& svg': {
			width: '16px',
			height: '16px',
		},
	},
	iconWrapperSmallRefresh: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Preserve small icon sizing without mutating the child element.
		'& svg': {
			width: token('space.200'),
			height: token('space.200'),
		},
	},
	iconWrapper: {
		color: token('color.icon.subtlest'),
	},
});

/**
 * __Step__
 *
 * A button that represents a single step in a breadcrumbs component.
 */
const Step: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<StepProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, StepProps>(
	(
		{
			analyticsContext,
			elemBefore,
			href,
			iconAfter,
			iconBefore,
			onClick: onClickProvided = noop,
			target,
			testId,
			children,
			title,
			truncationWidth,
			triggerProps,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			'aria-current': ariaCurrent,
			'aria-describedby': ariaDescribedBy,
			onBlur,
			onFocus,
			onMouseDown,
			onMouseMove,
			onMouseOut,
			onMouseOver,
			...rest
		},
		ref,
	) => {
		const resolvedElemBefore = elemBefore ?? iconBefore;
		const breadcrumbsSize = useBreadcrumbsSize();
		const isSmall = breadcrumbsSize === 'small';
		// Preserve the text/trailing-icon width budget now that the leading icon is inside the control.
		const leadingIconWidth = resolvedElemBefore
			? `${token('space.300')} + ${isSmall ? token('space.0') : token('space.025')}`
			: '0px';
		const maxWidth =
			fg('platform_dst_breadcrumbs-refresh') && truncationWidth != null
				? `calc(${truncationWidth}px + ${leadingIconWidth})`
				: truncationWidth;

		const handleClick = usePlatformLeafEventHandler({
			fn: onClickProvided,
			action: 'clicked',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});
		const handleTriggerClick: React.MouseEventHandler<HTMLElement> = (event) => {
			triggerProps?.onClick?.(event);
			handleClick(event);
		};

		const controlRef = fg('platform_dst_breadcrumbs-refresh') ? ref : undefined;
		const textRef = fg('platform_dst_breadcrumbs-refresh')
			? undefined
			: (ref as Ref<HTMLSpanElement>);

		const iconElement = resolvedElemBefore && (
			<span
				css={[
					styles.iconWrapper,
					fg('platform_dst_breadcrumbs-refresh') && unboundedStyles.iconWrapperRefresh,
					unboundedStyles.iconWrapper,
					fg('platform_dst_breadcrumbs-refresh') && styles.iconWrapperSpacing,
					isSmall && styles.iconWrapperSmallSpacing,
					!fg('platform_dst_breadcrumbs-refresh') && isSmall && unboundedStyles.iconWrapperSmall,
					fg('platform_dst_breadcrumbs-refresh') &&
						isSmall &&
						unboundedStyles.iconWrapperSmallRefresh,
				]}
				data-testid={testId && `${testId}--icon-before`}
			>
				{resolvedElemBefore}
			</span>
		);

		const content = (
			<Fragment>
				{!fg('platform_dst_breadcrumbs-refresh') && !isSmall && resolvedElemBefore}
				{(fg('platform_dst_breadcrumbs-refresh') || isSmall) && iconElement}
				<span
					css={[
						styles.text,
						fg('platform_dst_breadcrumbs-refresh') &&
							Boolean(iconAfter) &&
							styles.textWithIconAfter,
						truncationWidth != null &&
							fg('platform_dst_breadcrumbs-refresh') &&
							styles.textWithTruncation,
					]}
					ref={textRef}
				>
					{children}
				</span>
				{iconAfter}
			</Fragment>
		);

		if (href) {
			return (
				<Anchor
					{...rest}
					ref={controlRef as Ref<HTMLAnchorElement>}
					aria-current={ariaCurrent}
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					href={href}
					onClick={handleTriggerClick}
					onMouseOver={triggerProps?.onMouseOver ?? onMouseOver}
					onMouseOut={triggerProps?.onMouseOut ?? onMouseOut}
					onMouseMove={triggerProps?.onMouseMove ?? onMouseMove}
					onMouseDown={triggerProps?.onMouseDown ?? onMouseDown}
					onFocus={triggerProps?.onFocus ?? onFocus}
					onBlur={triggerProps?.onBlur ?? onBlur}
					aria-describedby={triggerProps?.['aria-describedby'] ?? ariaDescribedBy}
					target={target}
					rel={target === '_blank' ? 'noopener noreferrer' : undefined}
					testId={testId}
					title={title}
					xcss={cx(
						styles.root,
						isSmall && styles.rootSmall,
						fg('platform_dst_breadcrumbs-refresh') && styles.rootRefresh,
						truncationWidth != null &&
							fg('platform_dst_breadcrumbs-refresh') &&
							styles.withTruncation,
						truncationWidth == null && styles.withoutTruncation,
						fg('platform-dst-motion-uplift-list-item') && styles.interactiveMotion,
					)}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Width depends on the consumer truncationWidth and leading icon.
						maxWidth,
					}}
				>
					{content}
				</Anchor>
			);
		}

		return (
			<Pressable
				{...rest}
				ref={controlRef as Ref<HTMLButtonElement>}
				aria-current={ariaCurrent}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				onClick={handleTriggerClick}
				onMouseOver={triggerProps?.onMouseOver ?? onMouseOver}
				onMouseOut={triggerProps?.onMouseOut ?? onMouseOut}
				onMouseMove={triggerProps?.onMouseMove ?? onMouseMove}
				onMouseDown={triggerProps?.onMouseDown ?? onMouseDown}
				onFocus={triggerProps?.onFocus ?? onFocus}
				onBlur={triggerProps?.onBlur ?? onBlur}
				aria-describedby={triggerProps?.['aria-describedby'] ?? ariaDescribedBy}
				testId={testId}
				title={title}
				xcss={cx(
					styles.root,
					isSmall && styles.rootSmall,
					fg('platform_dst_breadcrumbs-refresh') && styles.rootRefresh,
					truncationWidth != null &&
						fg('platform_dst_breadcrumbs-refresh') &&
						styles.withTruncation,
					truncationWidth == null && styles.withoutTruncation,
					fg('platform-dst-motion-uplift-list-item') && styles.interactiveMotion,
				)}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Width depends on the consumer truncationWidth and leading icon.
					maxWidth,
				}}
			>
				{content}
			</Pressable>
		);
	},
);

export default Step;
