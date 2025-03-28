/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef, memo, type MouseEventHandler, useCallback, useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';
import { fg } from '@atlaskit/platform-feature-flags';

import MenuItemPrimitive from '../internal/components/menu-item-primitive';
import type { CustomItemComponentProps, CustomItemProps } from '../types';

const preventEvent: MouseEventHandler = (e) => {
	e.preventDefault();
};

// Dirty hack to get generics working with forward ref [1/2]
interface CustomItemTypeGenericHackProps {
	<TComponentProps>(
		props: CustomItemProps<TComponentProps> & { ref?: any } & Omit<
				TComponentProps,
				keyof CustomItemComponentProps
			>,
	): JSX.Element | null;
}

/**
 * __Custom item__
 *
 * A custom item is used to populate a menu with items that can be any element.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/custom-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const CustomItem = memo(
	forwardRef<HTMLElement, CustomItemProps>(
		(
			{
				component: Component,
				cssFn = noop as any,
				isDisabled = false,
				isSelected = false,
				onClick,
				testId,
				children,
				description,
				iconAfter,
				iconBefore,
				overrides,
				onMouseDown,
				shouldTitleWrap,
				shouldDescriptionWrap,
				className: UNSAFE_className,
				UNSAFE_isDraggable,
				interactionName,
				...rest
			}: // Type needed on props to extract types with extract react types.
			CustomItemProps,
			ref,
		) => {
			const onMouseDownHandler = onMouseDown;

			const interactionContext = useContext<InteractionContextType | null>(InteractionContext);

			const handleClick = useCallback(
				(e: React.MouseEvent<HTMLElement>) => {
					interactionContext?.tracePress(interactionName, e.timeStamp);
					onClick?.(e);
				},
				[onClick, interactionContext, interactionName],
			);

			if (!Component) {
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={UNSAFE_className}
					{...rest}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={overrides}
					description={description}
					iconAfter={iconAfter}
					title={children}
					iconBefore={iconBefore}
					isSelected={isSelected}
					isDisabled={isDisabled}
					shouldTitleWrap={shouldTitleWrap}
					shouldDescriptionWrap={shouldDescriptionWrap}
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={css(
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						cssFn({
							isDisabled,
							isSelected,
						}),
					)}
					testId={testId && `${testId}--primitive`}
				>
					{({ children, className }) => (
						<Component
							data-testid={testId}
							{...rest}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={className}
							ref={ref}
							{...(UNSAFE_isDraggable ? {} : { draggable: false, onDragStart: preventEvent })}
							onMouseDown={isDisabled ? preventEvent : onMouseDownHandler}
							onClick={
								isDisabled
									? preventEvent
									: fg('platform_button_item-add-ufo-metrics')
										? handleClick
										: onClick
							}
							tabIndex={isDisabled ? -1 : undefined}
							aria-disabled={isDisabled}
						>
							{children}
						</Component>
					)}
				</MenuItemPrimitive>
			);
		},
	),
	// Dirty hack to get generics working with forward ref [2/2]
) as CustomItemTypeGenericHackProps;

export default CustomItem;
