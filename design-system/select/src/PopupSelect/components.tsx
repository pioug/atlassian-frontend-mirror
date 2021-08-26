/** @jsx jsx */
import { FC, ReactNode, CSSProperties } from 'react';
import { components } from 'react-select';
import { jsx } from '@emotion/core';

import SearchIcon from '@atlaskit/icon/glyph/editor/search';
import { layers } from '@atlaskit/theme/constants';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ControlProps, MenuProps, OptionType } from '../types';

// ==============================
// Styled Components
// ==============================
interface MenuDialogProps {
  maxWidth: number;
  minWidth: number;
  style: CSSProperties;
  children: ReactNode;
  id: string;
}

export const MenuDialog: FC<MenuDialogProps> = ({
  maxWidth,
  minWidth,
  children,
  id,
  style,
}) => (
  <div
    css={{
      backgroundColor: token('color.background.overlay', 'white'),
      borderRadius: 4,
      boxShadow: token(
        'shadow.overlay',
        `0 0 0 1px ${N40A}, 0 4px 11px ${N40A}`,
      ),
      maxWidth,
      minWidth,
      zIndex: layers.modal(),
    }}
    style={style}
    id={id}
  >
    {children}
  </div>
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
export const DummyControl: FC<ControlProps<OptionType, boolean>> = (props) => (
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
