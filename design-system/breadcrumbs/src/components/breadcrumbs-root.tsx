/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type Ref } from 'react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { type BreadcrumbsSize } from './internal/breadcrumbs-size-context';
import { BreadcrumbsSizeProvider } from './internal/breadcrumbs-size-provider';

const navStyles = css({
	display: 'flex',
	minWidth: 0,
	flexShrink: 1,
	overflow: 'hidden',
});

const listStyles = css({
	display: 'flex',
	minWidth: 0,
	alignItems: 'center',
	gap: token('space.0'),
	flexShrink: 1,
	flexWrap: 'nowrap',
	listStyleType: 'none',
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.0'),
	marginInlineStart: token('space.0'),
	overflow: 'hidden',
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

export interface BreadcrumbsRootProps {
	/**
	 * The breadcrumb items to render. Typically `BreadcrumbsItemPrimitive` or
	 * `BreadcrumbsCurrentItem` components.
	 */
	children: React.ReactNode;
	/**
	 * An accessible label for the breadcrumb navigation landmark.
	 */
	label?: string;
	/**
	 * The size variant. `'small'` uses `font.body.small` and 16px icon sizing.
	 * Passed via context to all child items — no need to set it on each item.
	 *
	 * @default 'medium'
	 */
	size?: BreadcrumbsSize;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string
	 * that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Inline styles applied to the outer `<nav>` element. Useful for constraining
	 * width when demonstrating overflow collapse behaviour.
	 */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	style?: React.CSSProperties;
}

/**
 * __BreadcrumbsRoot__
 *
 * A primitive breadcrumbs container that renders a `<nav>` + `<ol>` with correct
 * ARIA semantics and design tokens, without any built-in overflow/collapse behaviour.
 *
 * Use this together with `BreadcrumbsItemPrimitive` and `useOverflowCollapse` to
 * compose custom breadcrumb experiences.
 *
 * @example
 * ```tsx
 * const { collapsedIndices, registerItem, registerContainer } = useOverflowCollapse(items.length);
 *
 * <BreadcrumbsRoot ref={registerContainer} label="Breadcrumbs">
 *   {items.map((item, i) =>
 *     collapsedIndices.has(i) ? null : (
 *       <BreadcrumbsItemPrimitive
 *         key={item.href}
 *         ref={registerItem(i)}
 *         href={item.href}
 *         text={item.text}
 *         aria-current={i === items.length - 1 ? 'page' : undefined}
 *       />
 *     )
 *   )}
 * </BreadcrumbsRoot>
 * ```
 */
const BreadcrumbsRoot: React.ForwardRefExoticComponent<
	BreadcrumbsRootProps & React.RefAttributes<HTMLElement>
> = forwardRef(
	(
		{ children, label = 'Breadcrumbs', size = 'medium', style, testId }: BreadcrumbsRootProps,
		ref: Ref<HTMLElement>,
	) => (
		<BreadcrumbsSizeProvider value={size}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<nav aria-label={label} css={navStyles} style={style} tabIndex={-1} ref={ref}>
				<ol data-testid={testId} css={listStyles}>
					{children}
				</ol>
			</nav>
		</BreadcrumbsSizeProvider>
	),
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsRoot;
