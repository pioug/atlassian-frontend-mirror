/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type KeyboardEvent, memo, type MouseEvent, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { useRouterLink } from '@atlaskit/app-provider';
import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
import { fg } from '@atlaskit/platform-feature-flags';

import MenuItemPrimitive from '../internal/components/menu-item-primitive';
import type { LinkItemProps } from '../types';

const IS_EXTERNAL_LINK_REGEX = /^(?:(http|https):\/\/)/;
const IS_NON_HTTP_BASED = /^(((mailto|tel|sms):)|(#))/;

const preventEvent = (e: MouseEvent | KeyboardEvent) => {
	e.preventDefault();
};

/**
 * __Link item__
 *
 * A link item is used to populate a menu with items that are links.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/link-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const LinkItem = memo(
	forwardRef<HTMLElement, LinkItemProps>(
		// Type needed on props to extract types with extract react types.
		(props: LinkItemProps, ref) => {
			const {
				children,
				href,
				cssFn = noop as any,
				description,
				iconAfter,
				iconBefore,
				isDisabled = false,
				isSelected = false,
				onClick,
				testId,
				overrides,
				onMouseDown,
				shouldTitleWrap,
				shouldDescriptionWrap,
				// Although this isn't defined on props it is available because we've used
				// Spread props below and on the jsx element. To forcibly block usage I've
				// picked it out and supressed the expected type error.
				// @ts-expect-error
				className: UNSAFE_className,
				UNSAFE_shouldDisableRouterLink,
				UNSAFE_isDraggable,
				...rest
			} = props;
			const onMouseDownHandler = onMouseDown;

			const RouterLink = useRouterLink();

			if (!children) {
				return null;
			}

			const isExternal = typeof href === 'string' && IS_EXTERNAL_LINK_REGEX.test(href);
			const isNonHttpBased = typeof href === 'string' && IS_NON_HTTP_BASED.test(href);

			/**
			 * Renders a router link if:
			 *
			 * - a link component is set in the app provider
			 * - it's not an external link (starting with `http://` or `https://`)
			 * - it's not a non-HTTP-based link (e.g. emails, phone numbers, hash links etc.).
			 */
			const isRouterLink =
				!UNSAFE_shouldDisableRouterLink && RouterLink && !isExternal && !isNonHttpBased;

			const Component =
				isRouterLink && fg('platform.wanjel.use-router-links-for-the-linkitem-component')
					? RouterLink
					: 'a';

			propDeprecationWarning(
				process.env._PACKAGE_NAME_ || '',
				'cssFn',
				cssFn !== (noop as any),
				'', // TODO: Create DAC post when primitives/xcss are available as alternatives
			);

			return (
				<MenuItemPrimitive
					{...rest}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={UNSAFE_className}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={overrides}
					iconBefore={iconBefore}
					iconAfter={iconAfter}
					isSelected={isSelected}
					isDisabled={isDisabled}
					description={description}
					shouldTitleWrap={shouldTitleWrap}
					shouldDescriptionWrap={shouldDescriptionWrap}
					css={
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
						cssFn({
							isSelected,
							isDisabled,
						})
					}
					title={children}
					testId={testId && `${testId}--primitive`}
				>
					{({ children, className }) => (
						<Component
							data-testid={testId}
							data-is-router-link={testId ? (isRouterLink ? 'true' : 'false') : undefined}
							data-vc="link-item"
							{...rest}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={className}
							// @ts-expect-error
							href={isDisabled ? undefined : href}
							{...(UNSAFE_isDraggable ? {} : { draggable: false, onDragStart: preventEvent })}
							onMouseDown={isDisabled ? preventEvent : onMouseDownHandler}
							onClick={isDisabled ? preventEvent : onClick}
							aria-current={isSelected ? 'page' : undefined}
							aria-disabled={isDisabled}
							ref={ref as Ref<HTMLAnchorElement>}
						>
							{children}
						</Component>
					)}
				</MenuItemPrimitive>
			);
		},
	),
);

export default LinkItem;
