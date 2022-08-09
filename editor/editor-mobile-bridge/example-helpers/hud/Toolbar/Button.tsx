import React from 'react';
import { CustomThemeButton } from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import icons from './icons';

interface Props {
  onClick?: (e: any) => void;
  iconName?: string;
  title?: string;
  ref?: React.Ref<HTMLElement>;
  disabled?: boolean;
  dropdown?: boolean;
}

const Button = ({
  onClick,
  iconName,
  ref,
  title,
  disabled,
  dropdown,
}: Props) => {
  const IconComponent =
    iconName && icons[iconName] ? icons[iconName] : undefined;
  const Icon = IconComponent ? <IconComponent /> : undefined;

  return (
    <CustomThemeButton
      isDisabled={disabled}
      iconBefore={Icon}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick(e);
      }}
      spacing="compact"
      ref={ref}
      iconAfter={dropdown ? <ChevronDownIcon label="more" /> : undefined}
    >
      {title}
    </CustomThemeButton>
  );
};

export default Button;
