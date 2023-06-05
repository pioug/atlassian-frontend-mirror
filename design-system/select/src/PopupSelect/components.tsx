/** @jsx jsx */
import { FC, ReactNode, CSSProperties } from 'react';
import { components } from 'react-select';
import { jsx } from '@emotion/react';

import VisuallyHidden from '@atlaskit/visually-hidden';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';
import { layers } from '@atlaskit/theme/constants';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ControlProps, MenuProps, OptionType } from '../types';

// ==============================
// Styled Components
// ==============================
interface MenuDialogProps {
  maxWidth?: number | string;
  minWidth?: number | string;
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
      backgroundColor: token('elevation.surface.overlay', 'white'),
      borderRadius: 4,
      boxShadow: token(
        'elevation.shadow.overlay',
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
  <div
    css={{
      marginRight: token('space.025', '2px'),
      textAlign: 'center',
      width: 32,
    }}
  >
    <SearchIcon label="open" />
  </div>
);

const Control: FC<ControlProps<OptionType, boolean>> = ({
  innerRef,
  innerProps,
  ...props
}) => (
  <div
    ref={innerRef}
    css={{
      padding: `${token('space.100', '8px')} ${token(
        'space.100',
        '8px',
      )} ${token('space.050', '4px')}`,
    }}
  >
    <components.Control
      {...(props as ControlProps<OptionType, boolean>)}
      innerProps={innerProps}
    />
  </div>
);
export const DummyControl: FC<ControlProps<OptionType, boolean>> = (props) => (
  <VisuallyHidden>
    <components.Control {...props} />
  </VisuallyHidden>
);

// NOTE `props` intentionally omitted from `Fragment`
// eslint-disable-next-line
const Menu = ({
  children,
  innerProps,
  ...props
}: MenuProps<OptionType, boolean>) => <div {...innerProps}>{children}</div>;

export const defaultComponents = { Control, DropdownIndicator, Menu };
