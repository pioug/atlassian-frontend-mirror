/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef, memo, type MouseEventHandler, useCallback, useContext } from 'react';

import { jsx } from '@compiled/react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

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
				isDisabled = false,
				isSelected = false,
				isTitleHeading = false,
				onClick,
				testId,
				children,
				description,
				iconAfter,
				iconBefore,
				onMouseDown,
				shouldTitleWrap,
				shouldDescriptionWrap,
				className: UNSAFE_className,
				UNSAFE_isDraggable,
				interactionName,
				...rest
			},
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

			return (
				<MenuItemPrimitive
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={UNSAFE_className}
					{...rest}
					description={description}
					iconAfter={iconAfter}
					title={children}
					iconBefore={iconBefore}
					isSelected={isSelected}
					isDisabled={isDisabled}
					isTitleHeading={isTitleHeading}
					shouldTitleWrap={shouldTitleWrap}
					shouldDescriptionWrap={shouldDescriptionWrap}
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
							onClick={isDisabled ? preventEvent : handleClick}
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
