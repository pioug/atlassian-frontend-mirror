/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { CSSObject, jsx } from '@emotion/core';

import { ButtonItemProps } from '../types';

import BaseItem from './base-item';
import { buttonItemCSS } from './styles';

const ButtonItem = forwardRef<HTMLElement, ButtonItemProps>(
  // Type needed on props to extract types with extract react types.
  (props: ButtonItemProps, ref) => {
    const {
      children,
      cssFn = (currentStyles: CSSObject) => currentStyles,
      description,
      iconAfter,
      iconBefore,
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
          iconBefore={iconBefore}
          iconAfter={iconAfter}
          description={description}
        >
          {children}
        </BaseItem>
      </Container>
    );
  },
);

export default ButtonItem;
