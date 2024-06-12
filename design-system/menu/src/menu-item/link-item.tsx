/** @jsx jsx */
import { forwardRef, type KeyboardEvent, memo, type MouseEvent, type Ref } from 'react';

import { jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import MenuItemPrimitive from '../internal/components/menu-item-primitive';
import type { LinkItemProps } from '../types';

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
				...rest
			} = props;
			const onMouseDownHandler = onMouseDown;

			if (!children) {
				return null;
			}

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
					className={
						getBooleanFF('platform.design-system-team.unsafe-overrides-killswitch_c8j9m')
							? undefined
							: UNSAFE_className
					}
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
						<a
							data-testid={testId}
							{...rest}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={className}
							href={isDisabled ? undefined : href}
							draggable={false}
							// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
							onDragStart={preventEvent}
							onMouseDown={isDisabled ? preventEvent : onMouseDownHandler}
							onClick={isDisabled ? preventEvent : onClick}
							aria-current={isSelected ? 'page' : undefined}
							aria-disabled={isDisabled}
							ref={ref as Ref<HTMLAnchorElement>}
						>
							{children}
						</a>
					)}
				</MenuItemPrimitive>
			);
		},
	),
);

export default LinkItem;
