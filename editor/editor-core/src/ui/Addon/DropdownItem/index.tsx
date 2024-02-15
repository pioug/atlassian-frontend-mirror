/** @jsx jsx */
import { jsx } from '@emotion/react';

import type { AddonProps } from '../types';

import { dropdownItem } from './styles';

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
