/* eslint-disable react/require-default-props */

import React from 'react';
import NodeResolver from 'react-node-resolver';
import flushable from 'flushable';
import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import {
  FakeMouseCoordinates,
  TooltipProps,
  TooltipState,
  FakeMouseElement,
} from './types';
import { Tooltip as StyledTooltip } from '../styled';
import Animation from './Animation';

import { hoveredPayload, unhoveredPayload } from './utils/analytics-payloads';

const SCROLL_OPTIONS = { capture: true, passive: true };

function getMousePosition(
  mouseCoordinates: FakeMouseCoordinates,
): FakeMouseElement {
  const safeMouse = mouseCoordinates || { top: 0, left: 0 };
  const getBoundingClientRect = () => {
    return {
      top: safeMouse.top,
      left: safeMouse.left,
      bottom: safeMouse.top,
      right: safeMouse.left,
      width: 0,
      height: 0,
    };
  };
  return {
    getBoundingClientRect,
    clientWidth: 0,
    clientHeight: 0,
  };
}

let pendingHide: flushable.FlushableOperation;

const showTooltip = (
  fn: (isHidePending: boolean) => void,
  defaultDelay: number,
) => {
  const isHidePending = pendingHide && pendingHide.pending();
  if (isHidePending) {
    pendingHide.flush();
  }
  const pendingShow = flushable(
    () => fn(isHidePending),
    isHidePending ? 0 : defaultDelay,
  );
  return pendingShow.cancel;
};

const hideTooltip = (fn: (flushed: boolean) => void, defaultDelay: number) => {
  pendingHide = flushable(flushed => fn(flushed), defaultDelay);
  return pendingHide.cancel;
};

class Tooltip extends React.Component<TooltipProps, TooltipState> {
  static defaultProps: Pick<
    TooltipProps,
    'component' | 'delay' | 'mousePosition' | 'position' | 'tag'
  > = {
    component: StyledTooltip,
    delay: 300,
    mousePosition: 'bottom',
    position: 'bottom',
    tag: 'div',
  };

  wrapperRef: HTMLElement | null = null;

  targetRef: HTMLElement | null = null;

  fakeMouseElement?: FakeMouseElement;

  cancelPendingSetState = () => {};

  userInteraction: 'mouse' | 'keyboard' = 'mouse';

  state = {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    renderTooltip: false,
  };

  componentWillUnmount() {
    this.cancelPendingSetState();
    this.removeScrollListener();
  }

  componentDidUpdate(_prevProps: TooltipProps, prevState: TooltipState) {
    if (!prevState.isVisible && this.state.isVisible) {
      if (this.props.onShow) this.props.onShow();

      window.addEventListener(
        'scroll',
        this.handleWindowScroll,
        SCROLL_OPTIONS,
      );
    } else if (prevState.isVisible && !this.state.isVisible) {
      if (this.props.onHide) this.props.onHide();
      this.removeScrollListener();
    }
  }

  removeScrollListener() {
    window.removeEventListener(
      'scroll',
      this.handleWindowScroll,
      SCROLL_OPTIONS,
    );
  }

  handleWindowScroll = () => {
    if (this.state.isVisible) {
      this.cancelPendingSetState();
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseClick = () => {
    if (this.props.hideTooltipOnClick) {
      this.cancelPendingSetState();
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseDown = () => {
    if (this.props.hideTooltipOnMouseDown) {
      this.cancelPendingSetState();
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseOver = (e: React.MouseEvent) => {
    if (e.target === this.wrapperRef) {
      return;
    }

    this.userInteraction = 'mouse';

    // In the case where a tooltip is newly rendered but immediately becomes hovered,
    // we need to set the coordinates in the mouseOver event.
    if (!this.fakeMouseElement) {
      this.fakeMouseElement = getMousePosition({
        left: e.clientX,
        top: e.clientY,
      });
    }

    this.handleShowTooltip();
  };

  handleFocus = () => {
    this.userInteraction = 'keyboard';

    // We need to fake the mouse dimensions even on focus because the code path currently assumes
    // fake mouse element needs to exist before showing the tooltip.
    if (!this.fakeMouseElement) {
      this.fakeMouseElement = getMousePosition({
        left: 0,
        top: 0,
      });
    }

    this.handleShowTooltip();
  };

  handleShowTooltip = () => {
    this.cancelPendingSetState();

    if (Boolean(this.props.content) && !this.state.isVisible) {
      this.cancelPendingSetState = showTooltip(immediatelyShow => {
        this.setState({
          isVisible: true,
          renderTooltip: true,
          immediatelyShow,
        });
      }, this.props.delay || 0);
    }
  };

  handleHideTooltip = (e: React.MouseEvent | FocusEvent) => {
    if (e.target === this.wrapperRef) {
      return;
    }

    this.cancelPendingSetState();

    if (this.state.isVisible) {
      this.cancelPendingSetState = hideTooltip(immediatelyHide => {
        this.setState({ isVisible: false, immediatelyHide });
      }, this.props.delay || 0);
    }
  };

  // Update mouse coordinates, used when position is 'mouse'.
  // We are not debouncing/throttling this function because we aren't causing any
  // re-renders or performaing any intensive calculations, we're just updating a value.
  // React also doesn't play nice debounced DOM event handlers because they pool their
  // SyntheticEvent objects. Need to use event.persist as a workaround - https://stackoverflow.com/a/24679479/893630
  handleMouseMove = (event: MouseEvent) => {
    if (!this.state.renderTooltip) {
      this.fakeMouseElement = getMousePosition({
        left: event.clientX,
        top: event.clientY,
      });
    }
  };

  shouldPositionTooltipNearMouse() {
    const { position } = this.props;
    return position === 'mouse' && this.userInteraction === 'mouse';
  }

  render() {
    const {
      children,
      position,
      mousePosition,
      content,
      truncate,
      component: TooltipContainer,
      tag: TargetContainer,
      testId,
    } = this.props;

    const {
      isVisible,
      renderTooltip,
      immediatelyShow,
      immediatelyHide,
    } = this.state;

    const tooltipPosition = position === 'mouse' ? mousePosition : position;

    return (
      /* eslint-disable jsx-a11y/mouse-events-have-key-events */
      <React.Fragment>
        {TargetContainer && (
          <TargetContainer
            onClick={this.handleMouseClick}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleHideTooltip}
            onMouseMove={this.handleMouseMove}
            onMouseDown={this.handleMouseDown}
            onFocus={this.handleFocus}
            onBlur={this.handleHideTooltip}
            ref={(wrapperRef: HTMLElement | null) => {
              this.wrapperRef = wrapperRef;
            }}
          >
            <NodeResolver
              innerRef={(ref: HTMLElement | null) => {
                this.targetRef = ref;
              }}
            >
              {React.Children.only(children)}
            </NodeResolver>
          </TargetContainer>
        )}

        {renderTooltip && this.targetRef && this.fakeMouseElement ? (
          <Portal zIndex={layers.tooltip()}>
            <Popper
              placement={tooltipPosition}
              referenceElement={
                // https://github.com/FezVrasta/react-popper#usage-without-a-reference-htmlelement
                // We are using a popper technique to pass in a faked element when we use mouse.
                (this.shouldPositionTooltipNearMouse()
                  ? this.fakeMouseElement
                  : this.targetRef) as HTMLElement
              }
            >
              {({ ref, style }) =>
                TooltipContainer && (
                  <Animation
                    immediatelyShow={immediatelyShow}
                    immediatelyHide={immediatelyHide}
                    onExited={() => this.setState({ renderTooltip: false })}
                    in={isVisible}
                  >
                    {getAnimationStyles => (
                      <TooltipContainer
                        // innerRef can't be null so shortcircuit to undefined if it is.
                        innerRef={ref || undefined}
                        className="Tooltip"
                        style={{
                          ...getAnimationStyles(),
                          ...style,
                        }}
                        truncate={truncate || false}
                        data-placement={tooltipPosition}
                        data-testid={testId}
                      >
                        {content}
                      </TooltipContainer>
                    )}
                  </Animation>
                )
              }
            </Popper>
          </Portal>
        ) : null}
      </React.Fragment>
      /* eslint-enable */
    );
  }
}

export { Tooltip as TooltipWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export type TooltipType = Tooltip;

export default withAnalyticsContext({
  componentName: 'tooltip',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onHide: unhoveredPayload,
    onShow: createAndFireEventOnAtlaskit({ ...hoveredPayload }),
  })(Tooltip),
);
