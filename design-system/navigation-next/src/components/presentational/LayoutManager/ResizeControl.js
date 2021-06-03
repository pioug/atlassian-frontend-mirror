import React, { Fragment, PureComponent } from 'react';

import { Global } from '@emotion/core';
import raf from 'raf-schd';

import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left';
import ChevronRight from '@atlaskit/icon/glyph/chevron-right';
import * as colors from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';

import { navigationExpandedCollapsed } from '../../../common/analytics';
import {
  CONTENT_NAV_WIDTH,
  CONTENT_NAV_WIDTH_COLLAPSED,
  GLOBAL_NAV_COLLAPSE_THRESHOLD,
  GLOBAL_NAV_WIDTH,
} from '../../../common/constants';
import { Shadow } from '../../../common/primitives';

const HANDLE_OFFSET = 4;
const INNER_WIDTH = 20;
const OUTER_WIDTH = INNER_WIDTH + HANDLE_OFFSET;
const HANDLE_WIDTH = 2;
const shouldResetGrabArea = (width) => {
  return width >= GLOBAL_NAV_COLLAPSE_THRESHOLD && width < CONTENT_NAV_WIDTH;
};
const preventDefault = (event) => event.preventDefault();

export const BodyDragCursor = () => (
  <Global
    styles={{
      body: {
        cursor: 'ew-resize',
      },
    }}
  />
);

const Outer = (props) => (
  <div
    css={{
      bottom: 0,
      left: '100%',
      position: 'absolute',
      top: 0,
      transform: 'translateZ(0)',
      width: OUTER_WIDTH,
      zIndex: 3, // higher than the scroll hint lines
    }}
    {...props}
  />
);

export const GrabArea = ({ showHandle, isBold, ...props }) => (
  <div
    css={{
      cursor: 'ew-resize',
      height: '100%',
      left: -HANDLE_OFFSET,
      position: 'relative',
      width: OUTER_WIDTH,
    }}
    {...props}
  >
    <div
      css={{
        backgroundColor: isBold ? colors.B200 : colors.B100,
        opacity: showHandle ? 1 : 0,
        height: '100%',
        left: HANDLE_OFFSET - HANDLE_WIDTH / 2, // the handle should "straddle" the dividing line
        position: 'absolute',
        transition: 'opacity 200ms',
        width: HANDLE_WIDTH,
      }}
    />
  </div>
);
const largeHitArea = {
  left: -8,
  right: -12,
  bottom: -8,
  top: -8,
};
const smallHitArea = {
  left: -4,
  right: -4,
  bottom: -4,
  top: -4,
};

const Button = ({
  children,
  hasHighlight,
  innerRef,
  isVisible,
  hitAreaSize,
  ...props
}) => (
  <button
    className="ak-navigation-resize-button"
    type="button"
    ref={innerRef}
    css={{
      background: 0,
      backgroundColor: 'white',
      border: 0,
      borderRadius: '50%',
      boxShadow: `0 0 0 1px ${colors.N30A}, 0 2px 4px 1px ${colors.N30A}`,
      color: hasHighlight ? colors.B100 : colors.N200,
      cursor: 'pointer',
      height: 24,
      opacity: isVisible ? 1 : 0,
      outline: 0,
      padding: 0,
      position: 'absolute',
      top: 32,
      transition: `
        background-color 100ms linear,
        color 100ms linear,
        opacity 300ms cubic-bezier(0.2, 0, 0, 1),
        transform 300ms cubic-bezier(0.2, 0, 0, 1)
      `,
      transform: `translate(-50%)`,
      width: 24,

      ':hover': {
        backgroundColor: colors.B100,
        color: 'white',
      },
      ':active': {
        backgroundColor: colors.B200,
        color: 'white',
      },
      ':focus': {
        opacity: 1,
        backgroundColor: colors.B200,
        color: 'white',
      },
    }}
    {...props}
  >
    <div
      // increase hit-area
      css={{
        position: 'absolute',
        ...(hitAreaSize === 'small' ? smallHitArea : largeHitArea),
      }}
    />
    {children}
  </button>
);

// tinker with the DOM directly by setting style properties, updates the grab bar position by changing padding-left and width.
function updateResizeAreaPosition(elements, width) {
  elements.forEach(({ property, ref }) => {
    const newValue = `${width}px`;
    const oldValue = ref.style.getPropertyValue(property);

    // avoid thrashing
    if (oldValue === newValue) return;

    // direct attribute manipulation
    ref.style.setProperty(property, newValue);
  });
}

// helper for tooltip content keyboard shortcut highlight
function makeTooltipNode({ text, char }) {
  return (
    <div
      css={{
        alignItems: 'baseline',
        display: 'flex',
        lineHeight: 1.3,
        paddingBottom: 1,
        paddingTop: 1,
      }}
    >
      <span>{text}</span>
      <div
        css={{
          backgroundColor: colors.N400,
          borderRadius: 2,
          lineHeight: 1.2,
          marginLeft: 4,
          padding: '1px 8px',
        }}
      >
        {char}
      </div>
    </div>
  );
}

/* NOTE: experimental props use an underscore */
class ResizeControl extends PureComponent {
  invalidDragAttempted = false;

  lastWidth;

  wrapper;

  state = {
    delta: 0,
    didDragOpen: false,
    isDragging: false,
    initialWidth: 0,
    initialX: 0,
    mouseIsDown: false,
    mouseIsOverGrabArea: false,
    showGrabArea: true,
    width: this.props.navigation.state.productNavWidth,
  };

  static defaultProps = {
    isGrabAreaDisabled: false,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      // eslint-disable-next-line camelcase
      experimental_flyoutOnHover: EXPERIMENTAL_FLYOUT_ON_HOVER,
      flyoutIsOpen,
      navigation,
    } = props;
    const { isCollapsed } = navigation.state;

    // resolve "hover locking" issue with resize grab area
    if (EXPERIMENTAL_FLYOUT_ON_HOVER) {
      const showGrabArea = !isCollapsed && !flyoutIsOpen;
      const mouseIsOverGrabArea = showGrabArea
        ? state.mouseIsOverGrabArea
        : false;

      return {
        mouseIsOverGrabArea,
        showGrabArea,
      };
    }

    return null;
  }

  onResizerChevronClick = () => {
    const trigger = this.props.flyoutIsOpen ? 'chevronHover' : 'chevron';
    this.toggleCollapse(trigger);
  };

  mouseEnterGrabArea = () => {
    this.setState({ mouseIsOverGrabArea: true });
  };

  mouseLeaveGrabArea = () => {
    this.setState({ mouseIsOverGrabArea: false });
  };

  toggleCollapse = (trigger) => {
    const { navigation, createAnalyticsEvent } = this.props;
    const newCollapsedState = !navigation.state.isCollapsed;
    navigation.toggleCollapse();
    navigationExpandedCollapsed(createAnalyticsEvent, {
      trigger,
      isCollapsed: newCollapsedState,
    });
  };

  handleResizeStart = (event) => {
    const initialX = event.pageX;

    this.setState({ initialX, mouseIsDown: true });

    // attach handlers (handleResizeStart is a bound to onMouseDown)
    window.addEventListener('mousemove', this.handleResize);
    window.addEventListener('mouseup', this.handleResizeEnd);
  };

  initializeDrag = (event) => {
    const { navigation } = this.props;
    const delta = event.pageX - this.state.initialX;
    const { isCollapsed } = navigation.state;

    // only initialize when drag intention is "expand"
    if (isCollapsed && delta <= 0) {
      this.invalidDragAttempted = true;
      return;
    }

    let initialWidth = navigation.state.productNavWidth;
    let didDragOpen = false;

    // NOTE
    // if the product nav is collapsed and the consumer starts dragging it open
    // we must expand it and drag should start from 0.
    if (isCollapsed) {
      initialWidth = CONTENT_NAV_WIDTH_COLLAPSED;
      didDragOpen = true;
      navigation.manualResizeStart({
        productNavWidth: CONTENT_NAV_WIDTH_COLLAPSED,
        isCollapsed: false,
      });
    } else {
      navigation.manualResizeStart(navigation.state);
    }

    this.setState({ didDragOpen, initialWidth, isDragging: true });
  };

  handleResize = raf((event) => {
    const { mutationRefs } = this.props;
    const { initialX, initialWidth, isDragging, mouseIsDown } = this.state;

    // on occasion a mouse move event occurs before the event listeners
    // have a chance to detach
    if (!mouseIsDown) return;

    // initialize dragging
    if (!isDragging) {
      this.initializeDrag(event);
      return;
    }

    // allow the product nav to be 75% of the available page width
    const maxWidth = Math.round((window.innerWidth / 4) * 3);
    const minWidth = CONTENT_NAV_WIDTH_COLLAPSED;
    const adjustedMax = maxWidth - initialWidth - GLOBAL_NAV_WIDTH;
    const adjustedMin = minWidth - initialWidth;

    const delta = Math.max(
      Math.min(event.pageX - initialX, adjustedMax),
      adjustedMin,
    );
    const width = initialWidth + delta;

    // apply updated styles to the applicable DOM nodes
    updateResizeAreaPosition(mutationRefs, width);

    // NOTE: hijack the maual resize and force collapse, cancels mouse events
    if (event.clientX < 0) {
      this.setState({ width: CONTENT_NAV_WIDTH_COLLAPSED });
      this.handleResizeEnd();
    } else {
      // maintain internal width, applied to navigation state on resize end
      this.setState({ delta, width });
    }
  });

  handleResizeEnd = () => {
    const { navigation, createAnalyticsEvent } = this.props;
    const { delta, didDragOpen, isDragging, width: currentWidth } = this.state;
    const expandThreshold = 24;
    const resizerClicked = !isDragging && !this.invalidDragAttempted;
    let publishWidth = currentWidth;
    let shouldCollapse = false;

    // check if the intention was just a click, and toggle
    if (resizerClicked) {
      publishWidth = Math.max(CONTENT_NAV_WIDTH, currentWidth);
      this.toggleCollapse('resizerClick');
    }

    // prevent the user from creating an unusable width
    if (publishWidth < CONTENT_NAV_WIDTH) {
      publishWidth = CONTENT_NAV_WIDTH;
      if (didDragOpen && delta > expandThreshold) {
        shouldCollapse = false;
      } else if (currentWidth < GLOBAL_NAV_COLLAPSE_THRESHOLD) {
        shouldCollapse = true;
      }
    } else {
      shouldCollapse = navigation.state.isCollapsed;
    }

    if (
      !resizerClicked &&
      ((didDragOpen && !shouldCollapse) || (!didDragOpen && shouldCollapse))
    ) {
      navigationExpandedCollapsed(createAnalyticsEvent, {
        trigger: 'resizerDrag',
        isCollapsed: shouldCollapse,
      });
    }

    // reset everything
    this.invalidDragAttempted = false;
    this.setState({
      didDragOpen: false,
      isDragging: false,
      mouseIsDown: false,
      width: publishWidth,
    });

    // publish the new width, once resizing completes
    navigation.manualResizeEnd({
      productNavWidth: publishWidth,
      isCollapsed: shouldCollapse,
    });

    if (shouldResetGrabArea(currentWidth)) {
      updateResizeAreaPosition(this.props.mutationRefs, CONTENT_NAV_WIDTH);
    }

    // cleanup
    window.removeEventListener('mousemove', this.handleResize);
    window.removeEventListener('mouseup', this.handleResizeEnd);
  };

  render() {
    const {
      isDragging,
      mouseIsDown,
      mouseIsOverGrabArea,
      showGrabArea,
    } = this.state;
    const {
      collapseToggleTooltipContent,
      expandCollapseAffordanceRef,
      flyoutIsOpen,
      isDisabled: isResizeDisabled,
      isGrabAreaDisabled,
      onMouseOverButtonBuffer,
      navigation,
    } = this.props;
    const { isCollapsed } = navigation.state;

    // the button shouldn't "flip" until the drag is complete
    let ButtonIcon = ChevronLeft;
    if (isCollapsed) ButtonIcon = ChevronRight;

    const button = (
      <Button
        onClick={this.onResizerChevronClick}
        onMouseDown={preventDefault}
        hitAreaSize={onMouseOverButtonBuffer ? 'large' : 'small'}
        // maintain styles when user is dragging
        isVisible={isCollapsed || mouseIsDown}
        hasHighlight={mouseIsDown || mouseIsOverGrabArea}
        innerRef={expandCollapseAffordanceRef}
        aria-expanded={!isCollapsed}
        aria-label="Toggle navigation"
      >
        <ButtonIcon />
      </Button>
    );
    const shadowDirection = flyoutIsOpen ? 'to right' : 'to left';

    return (
      <Outer>
        {isDragging && <BodyDragCursor />}
        <Shadow direction={shadowDirection} isBold={mouseIsDown} />
        {!isResizeDisabled && (
          <Fragment>
            {!isGrabAreaDisabled && showGrabArea && (
              <GrabArea
                isBold={mouseIsDown}
                showHandle={mouseIsDown || mouseIsOverGrabArea}
                onMouseEnter={this.mouseEnterGrabArea}
                onMouseLeave={this.mouseLeaveGrabArea}
                onMouseDown={this.handleResizeStart}
              />
            )}
            <div onMouseOver={!flyoutIsOpen ? onMouseOverButtonBuffer : null}>
              {collapseToggleTooltipContent ? (
                <Tooltip
                  content={makeTooltipNode(
                    collapseToggleTooltipContent(isCollapsed),
                  )}
                  delay={600}
                  hideTooltipOnClick
                  position="right"
                >
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </div>
          </Fragment>
        )}
      </Outer>
    );
  }
}

export { ResizeControl as ResizeControlBase };

export default withAnalyticsEvents()(ResizeControl);
