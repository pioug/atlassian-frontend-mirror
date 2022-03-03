import React from 'react';

import styled from 'styled-components';
import type { GlyphProps } from '@atlaskit/icon/types';
import { ButtonGroup } from '@atlaskit/button';
import Button from '../../floating-toolbar/ui/Button';

/**
 * Applying `pointer-events: none;` when disabled allows the Tooltip to be displayed
 */
export const StyledButton = styled(Button)`
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
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
const StyledDisallowedWrapper = styled(DisallowedWrapper)`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
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
          <StyledDisallowedWrapper key={testId} disabled={disabled}>
            <StyledButton
              title={title}
              icon={<Icon size="medium" label={title} />}
              selected={selected}
              onClick={onClick}
              testId={testId}
              disabled={disabled}
              tooltipContent={tooltipContent}
            />
          </StyledDisallowedWrapper>
        ),
      )}
    </ButtonGroup>
  );
};
