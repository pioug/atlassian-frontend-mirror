import React from 'react';
import DefaultButton from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import icons from './icons';

interface Props {
  onClick?: (e: any) => void;
  iconName?: string;
  title?: string;
  ref?: React.Ref<HTMLButtonElement>;
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
  const Icon = IconComponent ? IconComponent : undefined;

  return (
    <DefaultButton
      isDisabled={disabled}
      iconBefore={Icon}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick(e);
      }}
      spacing="compact"
      ref={ref}
      iconAfter={dropdown ? ChevronDownIcon : undefined}
    >
      {title}
    </DefaultButton>
  );
};

export default Button;
