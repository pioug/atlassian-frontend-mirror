import React, { forwardRef, useCallback, useState } from 'react';

import LeftArrow from '@atlaskit/icon/glyph/arrow-left-circle';
import { ButtonItemProps } from '@atlaskit/menu';

import { navigationBackgroundColor } from '../../common/constants';
import { backItemStyle, overrideStyleFunction } from '../../common/styles';

import ButtonItem from './button-item';

export { ButtonItemProps as GoBackItemProps } from '@atlaskit/menu';

const GoBackItem = forwardRef<HTMLElement, ButtonItemProps>(
  (
    {
      cssFn,
      iconBefore = (
        <LeftArrow secondaryColor={navigationBackgroundColor} label="" />
      ),
      onClick,
      isSelected,
      ...rest
    }: // Type needed on props to extract types with extract react types.
    ButtonItemProps,
    ref,
  ) => {
    const [isInteracted, setIsInteracted] = useState(false);
    const cssOverride = overrideStyleFunction(backItemStyle, cssFn);

    const onClickHandler: ButtonItemProps['onClick'] = useCallback(
      e => {
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
        cssFn={cssOverride}
        iconBefore={iconBefore}
        onClick={onClickHandler}
        ref={ref}
        {...rest}
      />
    );
  },
);

export default GoBackItem;
