/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { forwardRef, Ref } from 'react';
import { buttonItemCSS } from './styles';

import { ButtonItemProps } from '../types';
import BaseItem from './base-item';

const ButtonItem = forwardRef<HTMLElement, ButtonItemProps>(
  // Type needed on props to extract types with extract react types.
  (props: ButtonItemProps, ref) => {
    const {
      children,
      cssFn = (currentStyles: CSSObject) => currentStyles,
      description,
      elemAfter,
      elemBefore,
      isDisabled = false,
      isSelected = false,
      onClick,
      testId,
      overrides,
      ...others
    } = props;

    if (!children) {
      return null;
    }

    const Container = isDisabled ? 'span' : 'button';

    return (
      <Container
        type={isDisabled ? undefined : 'button'}
        css={cssFn(buttonItemCSS(isDisabled, isSelected), {
          isSelected,
          isDisabled,
        })}
        data-testid={testId}
        onClick={isDisabled ? undefined : onClick}
        ref={ref as Ref<HTMLButtonElement>}
        {...others}
      >
        <BaseItem
          overrides={overrides}
          elemBefore={elemBefore}
          elemAfter={elemAfter}
          description={description}
        >
          {children}
        </BaseItem>
      </Container>
    );
  },
);

export default ButtonItem;
