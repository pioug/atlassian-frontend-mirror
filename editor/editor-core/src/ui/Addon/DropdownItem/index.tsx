/** @jsx jsx */
import { jsx } from '@emotion/react';
import { dropdownItem } from './styles';
import { AddonProps } from '../types';

const DropdownItemWrapper = (props: AddonProps) => (
  <div
    css={dropdownItem}
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
  </div>
);

export default DropdownItemWrapper;
