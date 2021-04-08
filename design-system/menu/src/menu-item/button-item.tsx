/** @jsx jsx */
import { forwardRef, memo, Ref } from 'react';

import { jsx } from '@emotion/core';

import BaseItem from '../internal/components/base-item';
import { useBlurOnMouseDown } from '../internal/hooks/use-blur-on-mouse-down';
import { buttonItemCSS } from '../internal/styles/menu-item/button-item';
import type { ButtonItemProps } from '../types';

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
            buttonItemCSS(isDisabled, isSelected),
            cssFn({
              isSelected,
              isDisabled,
            }),
          ]}
          data-testid={testId}
          disabled={isDisabled}
          onClick={onClick}
          onMouseDown={onMouseDownHandler}
          ref={ref as Ref<HTMLButtonElement>}
          {...others}
        >
          <BaseItem
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
