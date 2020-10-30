import React from 'react';
import styled from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize } from '@atlaskit/theme';

interface Props {
  avatarUrl: string | null;
  fallbackComponent: React.ReactNode;
}

interface State {
  imageLoadFailed: boolean;
}

const ImageContainer = styled.img`
  height: ${gridSize() * 3}px;
  width: ${gridSize() * 3}px;
  margin: ${gridSize() / 2}px;
  border-radius: 3px;
  position: absolute;
  top: 0;
`;

const Container = styled.div`
  position: relative;
`;

export default class Avatar extends React.Component<Props, State> {
  state = {
    imageLoadFailed: false,
  };

  render() {
    const { avatarUrl, fallbackComponent } = this.props;
    return (
      <Container>
        {fallbackComponent}
        {avatarUrl && !this.state.imageLoadFailed && (
          <ImageContainer src={avatarUrl} onError={this.onError} />
        )}
      </Container>
    );
  }

  private onError = () => {
    this.setState({ imageLoadFailed: true });
  };
}
