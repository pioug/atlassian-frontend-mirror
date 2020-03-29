import React from 'react';
import { Container, Content, Icon, Text, Visibility } from '../styled';

interface Props {
  appearance?: 'warning' | 'error' | 'announcement';
  /** Visual style to be used for the banner */
  /** Content to be shown next to the icon. Typically text content but can contain links. */
  children?: React.ReactNode;
  /** Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/core/icon) */
  icon?: React.ReactChild;
  /** Defines whether the banner is shown. An animation is used when the value is changed. */
  isOpen?: boolean;
  /** Returns the inner ref of the component. This is exposed so the height can be used in page. */
  innerRef?: (element: HTMLElement) => void;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

class Banner extends React.Component<Props, { height: number }> {
  state = {
    height: 0,
  };

  static defaultProps = {
    appearance: 'warning',
    isOpen: false,
  };

  containerRef?: HTMLElement;

  getHeight = () => {
    if (this.containerRef) {
      this.setState({ height: this.containerRef.clientHeight });
    }
  };

  innerRef = (ref: HTMLElement) => {
    this.containerRef = ref;
    if (this.props.innerRef) {
      this.props.innerRef(ref);
    }
    this.getHeight();
  };

  render() {
    const { appearance, children, icon, isOpen, testId } = this.props;

    return (
      <Visibility bannerHeight={this.state.height} isOpen={isOpen}>
        <Container
          innerRef={this.innerRef}
          appearance={appearance}
          aria-hidden={!isOpen}
          role="alert"
          data-testid={testId}
        >
          <Content appearance={appearance}>
            <Icon>{icon}</Icon>
            <Text appearance={appearance}>{children}</Text>
          </Content>
        </Container>
      </Visibility>
    );
  }
}

export default Banner;
