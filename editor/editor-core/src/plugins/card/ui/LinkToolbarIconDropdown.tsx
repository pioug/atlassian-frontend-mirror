/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import type { GlyphProps } from '@atlaskit/icon/types';
import {
  MenuGroup,
  Section,
  CustomItem,
  CustomItemComponentProps,
} from '@atlaskit/menu';

import { borderRadius } from '@atlaskit/theme/constants';
import { B50, N20, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import Dropdown, {
  Props as DropdownProps,
} from '../../floating-toolbar/ui/Dropdown';

export const ICON_HEIGHT = 40;
export const ICON_WIDTH = 40;

const iconBoxStyles = css({
  width: ICON_HEIGHT,
  height: ICON_WIDTH,
  overflow: 'hidden',
  border: `1px solid ${token(
    'color.border',
    'rgba(223, 225, 229, 0.5)',
  )}` /* N60 at 50% */,
  borderRadius: borderRadius(),
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: token('elevation.surface', 'white'),
});

const primitiveStyles = css({
  padding: '0.75rem',
  alignItems: 'flex-start',
});

const interactiveStyles = css({
  '&:active': {
    backgroundColor: token('color.background.selected.pressed', B50),
    color: token('color.text.selected', B400),
  },
});

const unselectedStyles = css({
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N20),
    color: token('color.text.brand', 'currentColor'),
  },
});

const selectedOptionStyles = css({
  backgroundColor: token('color.background.selected.pressed', B50),
  color: token('color.text.selected', 'currentColor'),
  '&:hover': {
    backgroundColor: token('color.background.selected.pressed', B50),
    color: token('color.text.selected', 'currentColor'),
  },
});

const titleOffsetStyles = css({
  marginTop: '0.125rem',
});

type OptionRootProps = React.HTMLAttributes<HTMLDivElement> &
  CustomItemComponentProps;

const getCustomStyles = (selected: boolean, disabled: boolean) => {
  if (disabled) {
    return [primitiveStyles];
  }

  if (selected) {
    return [primitiveStyles, selectedOptionStyles, interactiveStyles];
  }

  return [primitiveStyles, unselectedStyles, interactiveStyles];
};

interface IconSizeProps {
  width?: number;
  height?: number;
}

export interface IconDropdownOptionProps {
  title: string;
  description: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: (props: GlyphProps & IconSizeProps) => JSX.Element;
  testId?: string;
  tooltipContent?: string | null;
}

const OptionRoot = (props: OptionRootProps) => <div {...props} tabIndex={0} />;

const Option = ({
  title,
  description,
  selected,
  disabled,
  onClick,
  icon: Icon,
  testId,
  tooltipContent,
  hide,
}: IconDropdownOptionProps & {
  hide: () => void;
}) => {
  const option = (
    <CustomItem
      aria-label={title}
      component={OptionRoot}
      iconBefore={
        <div css={iconBoxStyles}>
          <Icon width={38} height={38} label={title} />
        </div>
      }
      css={getCustomStyles(selected, disabled)}
      description={description}
      testId={testId}
      onClick={(event) => {
        event.preventDefault();

        if (!disabled) {
          onClick();
          hide();
        }
      }}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === 'Space') {
          event.preventDefault();
          if (!disabled) {
            onClick();
            hide();
          }
        }
      }}
      role="option"
      aria-selected={selected}
      isSelected={selected}
      isDisabled={disabled}
      shouldDescriptionWrap
    >
      <div css={titleOffsetStyles}>{title}</div>
    </CustomItem>
  );

  if (tooltipContent) {
    return <Tooltip content={tooltipContent}>{option}</Tooltip>;
  }

  return option;
};

export interface LinkToolbarIconDropdownProps extends DropdownProps {
  options: IconDropdownOptionProps[];
}

export const LinkToolbarIconDropdown = ({
  options,
  ...rest
}: LinkToolbarIconDropdownProps) => (
  <Dropdown
    {...rest}
    options={{
      render: ({ hide }) => (
        <MenuGroup>
          <div role="listbox">
            <Section>
              {options.map((props) => (
                <Option key={props.testId} {...props} hide={hide} />
              ))}
            </Section>
          </div>
        </MenuGroup>
      ),
      width: 320,
      height: 200,
    }}
  />
);
