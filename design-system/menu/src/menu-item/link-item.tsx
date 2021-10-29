/** @jsx jsx */
import { forwardRef, KeyboardEvent, memo, MouseEvent, Ref } from 'react';

import { jsx } from '@emotion/core';

import noop from '@atlaskit/ds-lib/noop';

import MenuItemPrimitive from '../internal/components/menu-item-primitive';
import { useBlurOnMouseDown } from '../internal/hooks/use-blur-on-mouse-down';
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
        ...rest
      } = props;
      const onMouseDownHandler = useBlurOnMouseDown(onMouseDown);

      if (!children) {
        return null;
      }

      return (
        <MenuItemPrimitive
          {...rest}
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
            // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
            cssFn({
              isSelected,
              isDisabled,
            })
          }
          title={children}
          testId={testId}
        >
          {({ children, ...props }) => (
            <a
              {...rest}
              {...props}
              href={isDisabled ? undefined : href}
              draggable={false}
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
