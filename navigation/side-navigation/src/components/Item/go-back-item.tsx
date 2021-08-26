import React, { forwardRef, useCallback, useState } from 'react';

import LeftArrow from '@atlaskit/icon/glyph/arrow-left-circle';
import type { ButtonItemProps } from '@atlaskit/menu';
import { N10 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ButtonItem from './button-item';

export type { ButtonItemProps as GoBackItemProps } from '@atlaskit/menu';

const GoBackItem = forwardRef<HTMLElement, ButtonItemProps>(
  (
    {
      cssFn,
      iconBefore = (
        <LeftArrow
          secondaryColor={token('color.background.default', N10)}
          label=""
        />
      ),
      onClick,
      isSelected,
      ...rest
    }: // Type needed on props to extract types with extract react types.
    ButtonItemProps,
    ref,
  ) => {
    const [isInteracted, setIsInteracted] = useState(false);

    const onClickHandler: ButtonItemProps['onClick'] = useCallback(
      (e) => {
        if (isInteracted) {
          return;
        }

        setIsInteracted(true);
        onClick && onClick(e);
      },
      [onClick, isInteracted],
    );

    return (
      <ButtonItem
        isSelected={isSelected || isInteracted}
        cssFn={cssFn}
        iconBefore={iconBefore}
        onClick={onClickHandler}
        ref={ref}
        {...rest}
      />
    );
  },
);

export default GoBackItem;
