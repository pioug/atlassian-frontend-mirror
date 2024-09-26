/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, type Ref, useCallback, useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
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

			propDeprecationWarning(
				process.env._PACKAGE_NAME_ || '',
				'cssFn',
				cssFn !== noop,
				'', // TODO: Create DAC post when primitives/xcss are available as alternatives
			);

			return (
				<MenuItemPrimitive
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={UNSAFE_className}
					{...rest}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={overrides}
					iconBefore={iconBefore}
					iconAfter={iconAfter}
					isDisabled={isDisabled}
					isSelected={isSelected}
					description={description}
					title={children}
					shouldTitleWrap={shouldTitleWrap}
					shouldDescriptionWrap={shouldDescriptionWrap}
					css={
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
						cssFn({
							isSelected,
							isDisabled,
						})
					}
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
