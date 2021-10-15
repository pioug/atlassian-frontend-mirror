/** @jsx jsx */
import { forwardRef, memo, Ref } from 'react';

import { jsx } from '@emotion/core';

import BaseItem from '../internal/components/base-item';
import { useBlurOnMouseDown } from '../internal/hooks/use-blur-on-mouse-down';
import { buttonItemCSS } from '../internal/styles/menu-item/button-item';
import type { ButtonItemProps } from '../types';

/**
 * __Button item__
 *
 * A button item is used to populate a menu with items that need to be a button element.
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
      } = props;
      const onMouseDownHandler = useBlurOnMouseDown(onMouseDown);

      if (!children) {
        return null;
      }

      return (
        <button
          css={[
            // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
            buttonItemCSS(isDisabled, isSelected),
            // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
            cssFn({
              isSelected,
              isDisabled,
            }),
          ]}
          type="button"
          data-testid={testId}
          disabled={isDisabled}
          onClick={onClick}
          onMouseDown={onMouseDownHandler}
          ref={ref as Ref<HTMLButtonElement>}
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
        </button>
      );
    },
  ),
);

export default ButtonItem;
