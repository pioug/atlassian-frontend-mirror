import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';

import * as Styled from './styled';

interface FooterProps {
  currentScreenIdx: number;
  numScreens: number;
  submitButton: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  secondaryActions: React.ReactNode;
}

export default class Footer extends React.Component<FooterProps> {
  render() {
    const {
      currentScreenIdx,
      numScreens,
      onCancel,
      onNext,
      onPrevious,
      secondaryActions,
      submitButton,
    } = this.props;
    return (
      <Styled.FooterOuter>
        <div>{secondaryActions}</div>

        <ButtonGroup>
          {currentScreenIdx < 1 ? (
            <Button onClick={onCancel}>Cancel</Button>
          ) : (
            <Button onClick={onPrevious}>Previous</Button>
          )}

          {currentScreenIdx < numScreens - 1 ? (
            <Button appearance="primary" onClick={onNext}>
              Next
            </Button>
          ) : (
            submitButton
          )}
        </ButtonGroup>
      </Styled.FooterOuter>
    );
  }
}
