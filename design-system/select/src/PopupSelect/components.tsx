/** @jsx jsx */
import { FC } from 'react';
import { jsx } from '@emotion/core';
import { ReactNode, CSSProperties } from 'react';
import { components } from 'react-select';

import { layers } from '@atlaskit/theme/constants';
import { N40A } from '@atlaskit/theme/colors';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';

import { ControlProps, MenuProps, OptionType } from '../types';

// ==============================
// Styled Components
// ==============================
interface MenuDialogProps {
  maxWidth: number;
  minWidth: number;
  style: CSSProperties;
  children: ReactNode;
}

export const MenuDialog: FC<MenuDialogProps> = ({
  maxWidth,
  minWidth,
  ...props
}) => (
  <div
    css={{
      backgroundColor: 'white',
      borderRadius: 4,
      boxShadow: `0 0 0 1px ${N40A}, 0 4px 11px ${N40A}`,
      maxWidth,
      minWidth,
      zIndex: layers.modal(),
    }}
    {...props}
  />
);

// ==============================
// Custom Components
// ==============================

const DropdownIndicator = () => (
  <div css={{ marginRight: 2, textAlign: 'center', width: 32 }}>
    <SearchIcon label="open" />
  </div>
);

const Control: FC<ControlProps<OptionType, boolean>> = ({
  innerRef,
  innerProps,
  ...props
}) => (
  <div ref={innerRef} css={{ padding: '8px 8px 4px' }}>
    <components.Control
      {...(props as ControlProps<OptionType, boolean>)}
      innerProps={innerProps}
    />
  </div>
);
export const DummyControl: FC<ControlProps<OptionType, boolean>> = props => (
  <div
    css={{
      border: 0,
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: 1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    }}
  >
    <components.Control {...props} />
  </div>
);

// NOTE `props` intentionally omitted from `Fragment`
// eslint-disable-next-line
const Menu = ({
  children,
  innerProps,
  ...props
}: MenuProps<OptionType, boolean>) => <div {...innerProps}>{children}</div>;

export const defaultComponents = { Control, DropdownIndicator, Menu };
