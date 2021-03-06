import React from 'react';

import { Container, Content, Icon, Text, Visibility } from '../styled';

interface BannerProps {
  /**
   * Visual style to be used for the banner
   */
  appearance?: 'warning' | 'error' | 'announcement';
  /**
   * Content to be shown next to the icon. Typically text content but can contain links.
   */
  children?: React.ReactNode;
  /**
   * Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/design-system/icon)
   */
  icon?: React.ReactChild;
  /**
   * Defines whether the banner is shown. An animation is used when the value is changed.
   */
  isOpen?: boolean;
  /**
   * Returns the inner ref of the component. This is exposed so the height can be used in page.
   */
  innerRef?: (element: HTMLElement) => void;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
}

class Banner extends React.Component<BannerProps, { height: number }> {
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

  getA11yProps = (
    appearance?: 'warning' | 'error' | 'announcement',
  ): {
    role: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'aria-hidden': boolean;
    tabIndex?: number;
    'aria-label'?: string;
  } => {
    const { isOpen } = this.props;

    const defaultProps = {
      'aria-hidden': !isOpen,
      role: 'alert',
    };

    if (appearance === 'announcement') {
      return {
        ...defaultProps,
        'aria-label': 'announcement',
        tabIndex: 0,
        role: 'region',
      };
    }
    return defaultProps;
  };

  render() {
    const { appearance, children, icon, isOpen, testId } = this.props;
    const allyProps = this.getA11yProps(appearance);

    return (
      <Visibility bannerHeight={this.state.height} isOpen={isOpen}>
        <Container
          innerRef={this.innerRef}
          appearance={appearance}
          data-testid={testId}
          {...allyProps}
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Banner;
