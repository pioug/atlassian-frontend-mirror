/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import React from 'react';

import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { LARGE, LOADING_CONTENTS_OPACITY } from '../internal/constants';
import {
  Container,
  SpinnerBackdrop,
  SpinnerContainer,
} from '../styled/loading-container-advanced';
import type { SpinnerSizeType } from '../types';

export interface LoadingContainerAdvancedProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  spinnerSize?: SpinnerSizeType;
  contentsOpacity: number | string;
  targetRef?: () => HTMLTableSectionElement | null;
  testId?: string;
  loadingLabel?: string;
}

export default class LoadingContainerAdvanced extends React.Component<
  LoadingContainerAdvancedProps,
  {}
> {
  spinnerRef = React.createRef<HTMLDivElement>();
  containerRef = React.createRef<HTMLDivElement>();

  static defaultProps = {
    isLoading: true,
    spinnerSize: LARGE,
    contentsOpacity: token('opacity.loading', `${LOADING_CONTENTS_OPACITY}`),
    loadingLabel: 'Loading table',
  };

  componentDidMount = () => {
    if (this.props.isLoading && this.hasTargetNode()) {
      this.attachListeners();

      this.updateTargetAppearance();
      this.updateSpinnerPosition();
    }
  };

  UNSAFE_componentWillReceiveProps = (
    nextProps: LoadingContainerAdvancedProps,
  ) => {
    if (!nextProps.isLoading || !this.hasTargetNode(nextProps)) {
      this.detachListeners();
    } else if (!this.props.isLoading) {
      this.attachListeners();
    }
  };

  componentDidUpdate = () => {
    if (this.hasTargetNode()) {
      this.updateTargetAppearance();

      if (this.props.isLoading) {
        this.updateSpinnerPosition();
      }
    }
  };

  componentWillUnmount = () => {
    this.detachListeners();
  };

  getTargetNode = (nextProps: LoadingContainerAdvancedProps = this.props) => {
    const { targetRef } = nextProps;
    const target = targetRef?.();
    return target || this.containerRef.current;
  };

  hasTargetNode = (nextProps?: LoadingContainerAdvancedProps) =>
    !!this.getTargetNode(nextProps);

  isVerticallyVisible = (
    elementRect: { top: number; bottom: number },
    viewportHeight: number,
  ) => {
    const { top, bottom } = elementRect;
    if (bottom <= 0) {
      return false;
    }
    return top < viewportHeight;
  };

  isFullyVerticallyVisible = (
    elementRect: { top: number; bottom: number },
    viewportHeight: number,
  ) => {
    const { top, bottom } = elementRect;
    return top >= 0 && bottom <= viewportHeight;
  };

  attachListeners() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  detachListeners() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.updateSpinnerPosition();
  };

  handleScroll = () => {
    this.updateSpinnerPosition();
  };

  translateSpinner = (
    spinnerNode: HTMLElement,
    transformY: number,
    isFixed?: boolean,
  ) => {
    spinnerNode.style.position = isFixed ? 'fixed' : '';
    spinnerNode.style.transform =
      transformY !== 0 ? `translate3d(0, ${transformY}px, 0)` : '';
  };

  updateTargetAppearance = () => {
    const targetNode = this.getTargetNode();

    const { isLoading, contentsOpacity } = this.props;
    if (
      targetNode &&
      targetNode.style &&
      typeof targetNode.style === 'object'
    ) {
      targetNode.style.pointerEvents = isLoading ? 'none' : '';
      targetNode.style.opacity = isLoading ? contentsOpacity.toString() : '';
    }
  };

  updateSpinnerPosition() {
    const viewportHeight = window.innerHeight;
    const targetNode = this.getTargetNode();
    const spinnerNode = this.spinnerRef?.current;

    if (
      !targetNode ||
      typeof targetNode.getBoundingClientRect !== 'function' ||
      !spinnerNode
    ) {
      return;
    }

    const targetRect = targetNode.getBoundingClientRect();
    const spinnerRect = spinnerNode.getBoundingClientRect();
    const spinnerHeight = spinnerRect.height;
    const isInViewport = this.isVerticallyVisible(targetRect, viewportHeight);
    const { top, bottom, height } = targetRect;

    if (isInViewport) {
      // The spinner may follow the element only if there is enough space:
      // Let's say the element can fit at least three spinners (vertically)
      const canFollow = height >= spinnerHeight * 3;
      if (
        canFollow &&
        !this.isFullyVerticallyVisible(targetRect, viewportHeight)
      ) {
        if (top >= 0) {
          // Only the head of the element is visible
          const viewportSpaceTakenByElement = viewportHeight - top;
          const diff =
            viewportSpaceTakenByElement / 2 + top - spinnerHeight / 2;
          const y =
            viewportSpaceTakenByElement < spinnerHeight * 3
              ? top + spinnerHeight
              : diff;
          this.translateSpinner(spinnerNode, y, true);
        } else if (top < 0 && bottom > viewportHeight) {
          // The element takes all viewport, nor its head nor tail are visible
          const y = viewportHeight / 2 - spinnerHeight / 2;
          this.translateSpinner(spinnerNode, y, true);
        } else {
          // Only the tail of the element is visible
          const diff = bottom / 2 - spinnerHeight / 2;
          const y = diff < spinnerHeight ? diff - (spinnerHeight - diff) : diff;
          this.translateSpinner(spinnerNode, y, true);
        }
        return;
      }
    } else {
      // If both the element and the spinner are off screen - quit
      if (!this.isVerticallyVisible(spinnerRect, viewportHeight)) {
        return;
      }
    }

    // Three options here:
    // 1) the element is fully visible
    // 2) the element is too small for the spinner to follow
    // 3) the spinner might still be visible while the element isn't
    const containerNode = this.containerRef?.current;
    if (
      containerNode &&
      typeof containerNode.getBoundingClientRect === 'function'
    ) {
      const thisTop = containerNode.getBoundingClientRect().top;
      const y = (top - thisTop) / 2;
      this.translateSpinner(spinnerNode, y, false);
    }
  }

  render() {
    const { children, isLoading, spinnerSize, testId, loadingLabel } =
      this.props;

    return (
      <Container
        testId={testId && `${testId}--loading--container--advanced`}
        ref={this.containerRef}
      >
        {children}
        {isLoading && (
          <SpinnerBackdrop testId={testId}>
            <SpinnerContainer ref={this.spinnerRef}>
              <Spinner
                size={spinnerSize}
                testId={testId && `${testId}--loadingSpinner`}
                label={loadingLabel}
              />
            </SpinnerContainer>
          </SpinnerBackdrop>
        )}
      </Container>
    );
  }
}
