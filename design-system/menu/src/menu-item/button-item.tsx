/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, type Ref, useCallback, useContext } from 'react';

import { jsx } from '@compiled/react';

import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';
import { fg } from '@atlaskit/platform-feature-flags';

import MenuItemPrimitive from '../internal/components/menu-item-primitive';
import type { ButtonItemProps } from '../types';

/**
 * __Button item__
 *
 * A button item is used to populate a menu with items that are buttons.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/button-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const ButtonItem = memo(
	forwardRef<HTMLElement, ButtonItemProps>(
		// Type needed on props to extract types with extract react types.
		(props: ButtonItemProps, ref) => {
			const {
				children,
				description,
				iconAfter,
				iconBefore,
				isDisabled = false,
				isSelected = false,
				onClick,
				testId,
				onMouseDown,
				shouldTitleWrap,
				shouldDescriptionWrap,
				className: UNSAFE_className,
				interactionName,
				...rest
			} = props;
			const onMouseDownHandler = onMouseDown;

			const interactionContext = useContext<InteractionContextType | null>(InteractionContext);

			const handleClick = useCallback(
				(e: React.MouseEvent<HTMLButtonElement>) => {
					interactionContext?.tracePress(interactionName, e.timeStamp);
					onClick?.(e);
				},
				[onClick, interactionContext, interactionName],
			);

			if (!children) {
				return null;
			}

			return (
				<MenuItemPrimitive
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={UNSAFE_className}
					{...rest}
					iconBefore={iconBefore}
					iconAfter={iconAfter}
					isDisabled={isDisabled}
					isSelected={isSelected}
					isTitleHeading={false}
					description={description}
					title={children}
					shouldTitleWrap={shouldTitleWrap}
					shouldDescriptionWrap={shouldDescriptionWrap}
					testId={testId && `${testId}--primitive`}
				>
					{({ children, className }) => (
						<button
							data-testid={testId}
							{...rest}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={className}
							ref={ref as Ref<HTMLButtonElement>}
							disabled={isDisabled}
							onClick={fg('platform_button_item-add-ufo-metrics') ? handleClick : onClick}
							onMouseDown={onMouseDownHandler}
							type="button"
						>
							{children}
						</button>
					)}
				</MenuItemPrimitive>
			);
		},
	),
);

export default ButtonItem;
