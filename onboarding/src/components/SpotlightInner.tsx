import React from 'react';
import { layers } from '@atlaskit/theme/constants';
import Portal from '@atlaskit/portal';
import ScrollLock from 'react-scrolllock';
import NodeResovler from 'react-node-resolver';
import scrollIntoView from 'scroll-into-view-if-needed';
import { canUseDOM } from 'exenv';
import { Fade } from './Animation';
import Clone from './Clone';
import SpotlightDialog from './SpotlightDialog';
import { SpotlightTransitionConsumer } from './SpotlightTransition';
import { Props as SpotlightProps } from './Spotlight';
import { ElementBox, ElementBoundingBox } from '../utils/use-element-box';

export interface Props extends SpotlightProps {
  /** the spotlight tagert dom element */
  targetNode: HTMLElement;
  /** Called when the component has been mounted */
  onOpened: () => any;
  /** Called when the component has been unmounted */
  onClosed: () => any;
  testId: string;
}

interface State {
  replacementElement: HTMLElement | null;
}

class SpotlightInner extends React.Component<Props, State> {
  static defaultProps = {
    dialogWidth: 400,
    pulse: true,
  };

  state = {
    // This is only used when targetReplacement is specified.
    // In this case, we have to render the targetReplacement component,
    // get a dom reference from that component, then render again passing
    // that reference into SpotlightDialog (Popper).
    replacementElement: null,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.targetNode !== this.props.targetNode) {
      scrollIntoView(this.props.targetNode, {
        scrollMode: 'if-needed',
      });
    }
  }

  componentDidMount() {
    scrollIntoView(this.props.targetNode, {
      scrollMode: 'if-needed',
    });
    this.props.onOpened();
  }

  componentWillUnmount() {
    this.props.onClosed();
  }

  isPositionFixed = (element: Element) =>
    window.getComputedStyle(element).position === 'fixed';

  hasPositionFixedParent = (
    element: HTMLElement,
    // We cap this method to be called to 1000 times to prevent flooding the stack.
    // In reality this only seems to be a problem in CI.
    _maxTries: number = 1000,
  ): boolean => {
    const { offsetParent } = element;
    if (!offsetParent || _maxTries === 0) {
      return false;
    }

    if (this.isPositionFixed(offsetParent)) {
      return true;
    }

    return this.hasPositionFixedParent(
      offsetParent as HTMLElement,
      _maxTries - 1,
    );
  };

  getTargetNodeStyle = (box: ElementBoundingBox) => {
    if (!canUseDOM) {
      return {};
    }
    const { targetNode } = this.props;

    if (
      this.isPositionFixed(targetNode) ||
      this.hasPositionFixedParent(targetNode)
    ) {
      return {
        ...box,
        // fixed position holds the target in place if overflow/scroll is necessary
        position: 'fixed',
      };
    }

    return {
      height: box.height,
      left: box.left + window.pageXOffset,
      top: box.top + window.pageYOffset,
      width: box.width,
      position: 'absolute',
    };
  };

  render() {
    const {
      pulse,
      target,
      targetNode,
      targetBgColor,
      targetOnClick,
      targetRadius,
      testId,
      targetReplacement: TargetReplacement,
    } = this.props;
    const { replacementElement } = this.state;

    return (
      <SpotlightTransitionConsumer>
        {({ isOpen, onExited }) => (
          <Portal zIndex={layers.spotlight() + 1}>
            {TargetReplacement ? (
              <NodeResovler
                innerRef={(elem: HTMLElement | null) =>
                  this.setState({ replacementElement: elem })
                }
              >
                <ElementBox element={targetNode}>
                  {box => (
                    <TargetReplacement
                      data-testid={`${testId}--target`}
                      {...this.getTargetNodeStyle(box)}
                    />
                  )}
                </ElementBox>
              </NodeResovler>
            ) : (
              <ElementBox element={targetNode}>
                {box => (
                  <Clone
                    testId={`${testId}--target`}
                    pulse={pulse}
                    target={target}
                    style={this.getTargetNodeStyle(box)}
                    targetBgColor={targetBgColor}
                    targetNode={targetNode}
                    targetOnClick={targetOnClick}
                    targetRadius={targetRadius}
                  />
                )}
              </ElementBox>
            )}
            {TargetReplacement && !replacementElement ? null : (
              <Fade in={isOpen} onExited={onExited}>
                {animationStyles => (
                  <SpotlightDialog
                    testId={`${testId}--dialog`}
                    actions={this.props.actions}
                    actionsBeforeElement={this.props.actionsBeforeElement}
                    children={this.props.children}
                    dialogPlacement={this.props.dialogPlacement}
                    dialogWidth={this.props.dialogWidth}
                    footer={this.props.footer}
                    header={this.props.header}
                    heading={this.props.heading}
                    image={this.props.image}
                    targetNode={replacementElement || targetNode}
                    animationStyles={animationStyles}
                  />
                )}
              </Fade>
            )}
            <ScrollLock />
          </Portal>
        )}
      </SpotlightTransitionConsumer>
    );
  }
}

export default SpotlightInner;
