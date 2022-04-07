/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import type { GlyphProps } from '@atlaskit/icon/types';
import { ButtonGroup } from '@atlaskit/button';
import Button from '../../floating-toolbar/ui/Button';

/**
 * Applying `pointer-events: none;` when disabled allows the Tooltip to be displayed
 */
const buttonStyle = css`
  pointer-events: auto;
`;
const buttonStyleNoneEvent = css`
  pointer-events: none;
`;

type DisallowedWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
};

const DisallowedWrapper = ({ disabled, ...props }: DisallowedWrapperProps) => {
  return <div {...props} />;
};

/**
 * The button requires `pointer-events: none;` in order to fix the tooltip, hence
 * leaving us without a disabled cursor, the following fixes this:
 */
const defaultWrapperStyle = css`
  cursor: pointer;
`;
const disallowedWrapperStyle = css`
  cursor: not-allowed;
`;

export interface ButtonOptionProps {
  title: string;
  selected: boolean;
  testId: string;
  disabled: boolean;
  tooltipContent?: string | null;
  onClick: () => void;
  icon: (props: GlyphProps) => JSX.Element;
}

export interface LinkToolbarButtonGroupProps {
  options: ButtonOptionProps[];
}

export const LinkToolbarButtonGroup = ({
  options,
}: LinkToolbarButtonGroupProps) => {
  return (
    <ButtonGroup>
      {options.map(
        ({
          onClick,
          selected,
          disabled,
          testId,
          tooltipContent,
          title,
          icon: Icon,
        }) => (
          <DisallowedWrapper
            css={disabled ? disallowedWrapperStyle : defaultWrapperStyle}
            key={testId}
            disabled={disabled}
          >
            <Button
              css={disabled ? buttonStyleNoneEvent : buttonStyle}
              title={title}
              icon={<Icon size="medium" label={title} />}
              selected={selected}
              onClick={onClick}
              testId={testId}
              disabled={disabled}
              tooltipContent={tooltipContent}
            />
          </DisallowedWrapper>
        ),
      )}
    </ButtonGroup>
  );
};
