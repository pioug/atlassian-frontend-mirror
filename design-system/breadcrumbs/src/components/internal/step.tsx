/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, type Ref } from 'react';

import { cssMap as unboundedCssMap } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { cssMap, cx, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import { fg } from '@atlaskit/platform-feature-flags';
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
		borderRadius: token('radius.small'),
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
		height: '1.5rem',
	},
	rootT26Shape: {
		borderRadius: token('radius.xsmall'),
	},
	interactiveMotion: {
		textDecorationLine: 'underline',
		textDecorationColor: 'transparent',
		transition: token('motion.listitem.hovered'),
		'&:hover': {
			textDecorationColor: token('color.text.subtlest'),
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
	iconWrapperExternal: {
		marginInlineEnd: token('space.025'),
	},
	iconWrapperExternalSmall: {
		marginInlineEnd: token('space.0'),
	},
	text: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	textWithTruncation: {
		minWidth: '0px',
		maxWidth: '100%',
		flexShrink: '1',
	},
});

const unboundedStyles = unboundedCssMap({
	iconWrapperSmall: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Preserve small icon sizing without mutating the child element.
		'& svg': {
			width: '16px',
			height: '16px',
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
					unboundedStyles.iconWrapper,
					fg('platform_dst_breadcrumbs-refresh') && styles.iconWrapperExternal,
					isSmall && styles.iconWrapperExternalSmall,
					isSmall && unboundedStyles.iconWrapperSmall,
				]}
				data-testid={testId && `${testId}--icon-before`}
			>
				{resolvedElemBefore}
			</span>
		);

		const content = (
			<Fragment>
				{!fg('platform_dst_breadcrumbs-refresh') && !isSmall && resolvedElemBefore}
				{!fg('platform_dst_breadcrumbs-refresh') && isSmall && iconElement}
				<span
					css={[
						styles.text,
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
				<Fragment>
					{fg('platform_dst_breadcrumbs-refresh') && iconElement}
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
						testId={testId}
						title={title}
						xcss={
							// @ts-ignore -- Expression produces a union type that is too complex to represent. This matches existing `@atlaskit/primitives` handling for complex `xcss={cx(...)}` composition.
							cx(
								styles.root,
								isSmall && styles.rootSmall,
								fg('platform_dst_breadcrumbs-refresh') && styles.rootRefresh,
								truncationWidth != null &&
									fg('platform_dst_breadcrumbs-refresh') &&
									styles.withTruncation,
								truncationWidth == null && styles.withoutTruncation,
								fg('platform-dst-shape-theme-default') && styles.rootT26Shape,
								fg('platform-dst-motion-uplift-list-item') && styles.interactiveMotion,
							)
						}
						style={{
							maxWidth: truncationWidth,
						}}
					>
						{content}
					</Anchor>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{fg('platform_dst_breadcrumbs-refresh') && iconElement}

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
					xcss={
						// @ts-ignore -- Expression produces a union type that is too complex to represent. This matches existing `@atlaskit/primitives` handling for complex `xcss={cx(...)}` composition.
						cx(
							styles.root,
							isSmall && styles.rootSmall,
							fg('platform_dst_breadcrumbs-refresh') && styles.rootRefresh,
							truncationWidth != null &&
								fg('platform_dst_breadcrumbs-refresh') &&
								styles.withTruncation,
							truncationWidth == null && styles.withoutTruncation,
							fg('platform-dst-shape-theme-default') && styles.rootT26Shape,
							fg('platform-dst-motion-uplift-list-item') && styles.interactiveMotion,
						)
					}
					style={{
						maxWidth: truncationWidth,
					}}
				>
					{content}
				</Pressable>
			</Fragment>
		);
	},
);

export default Step;
