/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type Ref } from 'react';

import { jsx, type StrictXCSSProp } from '@atlaskit/css';

import BreadcrumbsItemBase from './internal/breadcrumbs-item-base';

export interface BreadcrumbsItemPrimitiveProps {
	/**
	 * The text label of the breadcrumb item.
	 */
	// Match the existing BreadcrumbsItem/BreadcrumbsCurrentItem text prop shape.
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	/**
	 * The URL the breadcrumb links to. When omitted the item renders as a button.
	 */
	href?: string;
	/**
	 * Click handler for the breadcrumb.
	 */
	onClick?: (event: React.MouseEvent) => void;
	/**
	 * Opens the link in a new tab. When omitted, the link opens in the current tab.
	 */
	target?: '_blank';
	/**
	 * An element to display before the breadcrumb text. The size is automatically
	 * constrained to match the `size` variant set on the parent `BreadcrumbsRoot`.
	 */
	elemBefore?: React.ReactChild;
	/**
	 * Maximum width in pixels before the text is truncated with an ellipsis.
	 */
	truncationWidth?: number;
	/**
	 * `aria-current` value. Set to `"page"` for the last/active item.
	 */
	'aria-current'?: 'page' | boolean;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string
	 * that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Bounded style overrides applied to the root `<li>` element. Useful for
	 * toggling visibility when implementing custom overflow/collapse behaviour
	 * with `useOverflowCollapse`.
	 */
	xcss?: StrictXCSSProp<'display', never>;
}

/**
 * __BreadcrumbsItemPrimitive__
 *
 * A primitive breadcrumb item that renders an `<li>` with a separator and the
 * correct link/button styling — without any overflow/collapse wiring.
 *
 * The `ref` is forwarded to the `<li>` element so it can be passed directly to
 * `registerItem(index)` from `useOverflowCollapse`.
 *
 * @example
 * ```tsx
 * <BreadcrumbsItemPrimitive
 *   ref={registerItem(index)}
 *   href="/home"
 *   text="Home"
 * />
 * ```
 */
const BreadcrumbsItemPrimitive: React.ForwardRefExoticComponent<
	BreadcrumbsItemPrimitiveProps & React.RefAttributes<HTMLLIElement>
> = forwardRef(
	(
		{
			text,
			href,
			onClick,
			target,
			elemBefore,
			truncationWidth,
			testId,
			xcss,
			'aria-current': ariaCurrent,
		}: BreadcrumbsItemPrimitiveProps,
		ref: Ref<HTMLLIElement>,
	) => (
		<BreadcrumbsItemBase
			ref={ref}
			href={href}
			elemBefore={elemBefore}
			onClick={onClick}
			target={target}
			testId={testId}
			text={text}
			truncationWidth={truncationWidth}
			aria-current={ariaCurrent}
			xcss={xcss}
		/>
	),
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsItemPrimitive;
