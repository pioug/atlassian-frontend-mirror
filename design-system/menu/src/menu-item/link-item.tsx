/** @jsx jsx */
import { forwardRef, memo, MouseEventHandler, Ref } from 'react';

import { jsx } from '@emotion/core';

import BaseItem from '../internal/components/base-item';
import { useBlurOnMouseDown } from '../internal/hooks/use-blur-on-mouse-down';
import { linkItemCSS } from '../internal/styles/menu-item/link-item';
import type { LinkItemProps } from '../types';

const preventEvent: MouseEventHandler = (e) => {
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
    ({ href, ...rest }: LinkItemProps, ref) => {
      const {
        children,
        cssFn = () => ({}),
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
        ...others
      } = rest;
      const onMouseDownHandler = useBlurOnMouseDown(onMouseDown);

      if (!children) {
        return null;
      }

      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          css={[
            // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
            linkItemCSS(isDisabled, isSelected),
            // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
            cssFn({
              isSelected,
              isDisabled,
            }),
          ]}
          draggable={false}
          href={isDisabled ? undefined : href}
          data-testid={testId}
          onDragStart={preventEvent}
          onMouseDown={isDisabled ? preventEvent : onMouseDownHandler}
          onClick={isDisabled ? preventEvent : onClick}
          aria-current={isSelected ? 'page' : undefined}
          aria-disabled={isDisabled}
          {...others}
        >
          <BaseItem
            // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
            overrides={overrides}
            iconBefore={iconBefore}
            iconAfter={iconAfter}
            description={description}
            shouldTitleWrap={shouldTitleWrap}
            shouldDescriptionWrap={shouldDescriptionWrap}
          >
            {children}
          </BaseItem>
        </a>
      );
    },
  ),
);

export default LinkItem;
