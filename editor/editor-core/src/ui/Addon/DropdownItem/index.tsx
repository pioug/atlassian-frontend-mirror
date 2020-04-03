import React from 'react';
import { DropdownItem } from './styles';
import { AddonProps } from '../types';

const DropdownItemWrapper = (props: AddonProps) => (
  <DropdownItem
    onClick={() =>
      props.onClick &&
      props.onClick({
        actionOnClick: props.actionOnClick,
        renderOnClick: props.renderOnClick,
      })
    }
  >
    <span>{props.icon}</span>
    {props.children}
  </DropdownItem>
);

export default DropdownItemWrapper;
