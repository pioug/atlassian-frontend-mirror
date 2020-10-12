import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { gridSize, typography } from '@atlaskit/theme';
import { messages } from '../messages';
import MaginfyingGlassImage from '../assets/MagnifyingGlassImage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${gridSize() * 4}px 0;
`;

const ImageWrapper = styled.div`
  width: 20%;
  height: 20%;
  margin-top: ${gridSize() * 11}px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: ${gridSize() * 3}px;
`;

const Title = styled.h4`
  ${typography.h600()};
  margin-bottom: ${gridSize() * 2}px;
  margin-top: 0;
`;

const Text = ({ children }: React.Props<any>) => (
  <TextWrapper>
    <Title>
      <FormattedMessage {...messages.no_recent_activity_title} />
    </Title>
    {children}
  </TextWrapper>
);

export default class NoRecentActivity extends React.Component<
  React.Props<any>
> {
  render() {
    return (
      <Wrapper>
        <ImageWrapper>
          <MaginfyingGlassImage />
        </ImageWrapper>
        <Text children={this.props.children} />
      </Wrapper>
    );
  }
}
