import React, { ReactNode } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import CloseIcon from '@atlaskit/icon/glyph/cross';

import {
  Description as StyledDescription,
  Header as StyledHeader,
  Title,
  Wrapper,
} from './styled/common';

export function HeaderButtons({
  optOutLabel,
  canClose,
  onClose,
  canOptOut,
  onOptOut,
}: {
  optOutLabel?: ReactNode;
  canClose: boolean;
  onClose?: () => void;
  canOptOut: boolean;
  onOptOut?: () => void;
}) {
  const buttons = [];
  if (canOptOut) {
    buttons.push(
      <Button key="opt-out" onClick={onOptOut} appearance="subtle">
        {optOutLabel}
      </Button>,
    );
  }
  if (canClose) {
    buttons.push(
      <Button
        key="close"
        appearance="subtle"
        onClick={onClose}
        iconBefore={<CloseIcon label="Close" size="small" />}
      />,
    );
  }
  return <ButtonGroup>{buttons}</ButtonGroup>;
}

export function Header({
  title,
  canClose,
  onClose,
  canOptOut,
  onOptOut,
  optOutLabel,
}: {
  title: ReactNode;
  canClose: boolean;
  onClose?: () => void;
  canOptOut: boolean;
  onOptOut?: () => void;
  optOutLabel?: ReactNode;
}) {
  return (
    <StyledHeader>
      <Title>{title}</Title>
      <HeaderButtons
        canClose={canClose}
        canOptOut={canOptOut}
        onClose={onClose}
        onOptOut={onOptOut}
        optOutLabel={optOutLabel}
      />
    </StyledHeader>
  );
}

export function Description({ children }: { children: ReactNode }) {
  return (
    <Wrapper>
      <StyledDescription>{children}</StyledDescription>
    </Wrapper>
  );
}
