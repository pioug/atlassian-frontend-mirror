/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import Blanket from '@atlaskit/blanket';
import { withAnalytics } from '@atlaskit/analytics';
import ScrollLock from 'react-scrolllock';
import DrawerTrigger from './DrawerTrigger';
import DrawerBackIcon from './DrawerBackIcon';
import ContainerHeader from './ContainerHeader';
import DrawerSide from '../styled/DrawerSide';
import DrawerInner from '../styled/DrawerInner';
import DrawerPrimaryIcon from '../styled/DrawerPrimaryIcon';
import DrawerMain from '../styled/DrawerMain';
import DrawerContent from '../styled/DrawerContent';
import DrawerBackIconWrapper from '../styled/DrawerBackIconWrapper';
import { WithRootTheme } from '../../theme/util';
import { container } from '../../theme/presets';

const escKeyCode = 27;
export const analyticsNamespace = 'atlaskit.navigation.drawer';

export class DrawerImpl extends PureComponent {
  static defaultProps = {
    iconOffset: 0,
    isOpen: false,
    onBackButton: () => {},
    primaryIcon: null,
    width: 'narrow',
  };

  state = {
    isAnimating: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      this.setState({ isAnimating: true });
    }
  }

  componentDidUpdate(prevProps) {
    // Fire analytics event upon drawer opening
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.fireAnalyticsEvent('open');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // eslint-disable-next-line react/sort-comp
  createBackButtonHandler = method => e => {
    if (this.props.isOpen) {
      this.props.onBackButton(e);
      this.props.fireAnalyticsEvent('close', { method });
    }
  };

  onBackButtonByBackButton = this.createBackButtonHandler('back-btn');

  onBackButtonByBlanket = this.createBackButtonHandler('blanket');

  onBackButtonByEscKey = this.createBackButtonHandler('esc-key');

  handleKeyDown = event => {
    // The reason we have onKeyDown living together with onBackButton is because
    // some apps living in Focused task need the ability to handle on key down by itself.
    // However, some other apps don't really care about it
    // and leave it to the Focused task to handle.
    // Calling onKeyDown first can either supplement or override onBackButton.
    const { onKeyDown } = this.props;
    if (onKeyDown) {
      onKeyDown(event);
    }
    if (!event.defaultPrevented && event.keyCode === escKeyCode) {
      this.onBackButtonByEscKey(event);
    }
  };

  handleAnimationEnd = () => this.setState({ isAnimating: false });

  render() {
    const {
      backIcon,
      header,
      isOpen,
      primaryIcon,
      width,
      iconOffset,
    } = this.props;

    const actualFullWidth = width === 'full';

    const sidebar = isOpen ? (
      <DrawerSide>
        <DrawerPrimaryIcon>{primaryIcon}</DrawerPrimaryIcon>
        <DrawerBackIconWrapper iconOffset={iconOffset}>
          <DrawerTrigger onActivate={this.onBackButtonByBackButton}>
            <DrawerBackIcon isVisible={isOpen}>{backIcon}</DrawerBackIcon>
          </DrawerTrigger>
        </DrawerBackIconWrapper>
      </DrawerSide>
    ) : null;

    const content = isOpen ? (
      <DrawerMain>
        <ContainerHeader
          isInDrawer
          iconOffset={iconOffset}
          isFullWidth={actualFullWidth}
        >
          {width !== 'full' ? header : <ScrollLock />}
        </ContainerHeader>
        <DrawerContent>{this.props.children}</DrawerContent>
      </DrawerMain>
    ) : null;

    // Note: even though we are using WithRootTheme here, the Drawer appearance is not able
    // to be customised via a preset or custom theme.
    return (
      <WithRootTheme provided={container}>
        <div>
          <Blanket
            isTinted={isOpen}
            canClickThrough={!isOpen}
            onBlanketClicked={this.onBackButtonByBlanket}
          />
          {(this.state.isAnimating || isOpen) && (
            <DrawerInner
              isOpen={isOpen}
              width={width}
              isAnimating={this.state.isAnimating}
              onAnimationEnd={this.handleAnimationEnd}
            >
              {sidebar}
              {content}
            </DrawerInner>
          )}
        </div>
      </WithRootTheme>
    );
  }
}

export default withAnalytics(
  DrawerImpl,
  {},
  { analyticsId: analyticsNamespace },
);
