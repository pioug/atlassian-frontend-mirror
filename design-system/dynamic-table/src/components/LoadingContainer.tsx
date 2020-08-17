import React from 'react';

import Spinner from '@atlaskit/spinner';

import { LARGE, LOADING_CONTENTS_OPACITY } from '../internal/constants';
import {
  Container,
  ContentsContainer,
  SpinnerContainer,
} from '../styled/LoadingContainer';
import { SpinnerSizeType } from '../types';

interface Props {
  children: React.ReactNode;
  isLoading?: boolean;
  spinnerSize?: SpinnerSizeType;
  contentsOpacity: number;
  testId?: string;
}

export default class LoadingContainer extends React.Component<Props, {}> {
  static defaultProps = {
    isLoading: true,
    spinnerSize: LARGE,
    contentsOpacity: LOADING_CONTENTS_OPACITY,
  };

  render() {
    const {
      children,
      isLoading,
      spinnerSize,
      contentsOpacity,
      testId,
    } = this.props;

    return (
      <Container>
        {!isLoading ? (
          children
        ) : (
          <ContentsContainer contentsOpacity={contentsOpacity}>
            {children}
          </ContentsContainer>
        )}
        {isLoading && (
          <SpinnerContainer>
            <Spinner
              size={spinnerSize}
              testId={testId && `${testId}--loadingSpinner`}
            />
          </SpinnerContainer>
        )}
      </Container>
    );
  }
}
