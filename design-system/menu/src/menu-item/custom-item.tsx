/** @jsx jsx */

import { forwardRef, memo, MouseEventHandler } from 'react';

import { css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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
        // Although this isn't defined on props it is available because we've used
        // Spread props below and on the jsx element. To forcibly block usage I've
        // picked it out and supressed the expected type error.
        // @ts-expect-error
        className: UNSAFE_className,
        ...rest
      }: // Type needed on props to extract types with extract react types.
      CustomItemProps,
      ref,
    ) => {
      const onMouseDownHandler = onMouseDown;

      if (!Component) {
        return null;
      }

      propDeprecationWarning(
        process.env._PACKAGE_NAME_,
        'cssFn',
        cssFn !== (noop as any),
        '', // TODO: Create DAC post when primitives/xcss are available as alternatives
      );

      return (
        <MenuItemPrimitive
          className={
            getBooleanFF(
              'platform.design-system-team.unsafe-overrides-killswitch_c8j9m',
            )
              ? undefined
              : UNSAFE_className
          }
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
          // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
          css={css(
            cssFn({
              isDisabled,
              isSelected,
            }),
          )}
        >
          {({ children, className }) => (
            <Component
              data-testid={testId}
              {...rest}
              className={className}
              ref={ref}
              draggable={false}
              onDragStart={preventEvent}
              onMouseDown={isDisabled ? preventEvent : onMouseDownHandler}
              onClick={isDisabled ? preventEvent : onClick}
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
