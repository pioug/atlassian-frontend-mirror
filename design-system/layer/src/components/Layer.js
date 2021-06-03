/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styled from 'styled-components';
import rafSchedule from 'raf-schd';
import Popper from 'popper.js'; // eslint-disable-line import/extensions
import ScrollBlock from './internal/ScrollBlock';
import {
  getFlipBehavior,
  positionPropToPopperPosition,
} from './internal/helpers';
import ContentContainer from '../styledContentContainer';

// We create a dummy target when making the menu fixed so that we can force popper.js to use fixed positioning
// without affecting child layout of the actual target since children of fixed position elements can't use percentage
// heights/widths.
const FixedTarget = styled.div`
  ${({ fixedOffset, targetRef }) => {
    if (fixedOffset && targetRef) {
      const actualTarget = targetRef.firstChild;
      const rect = actualTarget.getBoundingClientRect();
      return `
        position: fixed;
        top: ${fixedOffset.top}px;
        left: ${fixedOffset.left}px;
        height: ${rect.height}px;
        width: ${rect.width}px;
        z-index: -1;
      `;
    }
    return 'display: none;';
  }};
`;

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/layer has been deprecated. It is an internal component and should not be used directly.',
  );
}

export default class Layer extends Component {
  popper;

  targetRef;

  contentRef;

  fixedRef;

  // working with extract-react-types
  static defaultProps = {
    autoFlip: true,
    boundariesElement: 'viewport',
    children: null,
    content: null,
    offset: '0, 0',
    onFlippedChange: () => {},
    position: 'right middle',
    zIndex: 400,
    lockScroll: false,
    isAlwaysFixed: false,
    onPositioned: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      hasExtractedStyles: false,
      position: null,
      transform: null,
      flipped: false,
      actualPosition: null,
      // We set these default offsets to prevent a flash of popper content in the wrong position
      // which can cause incorrect height calculations. Popper will calculate these values
      offsets: {
        popper: {
          left: -9999,
          top: -9999,
        },
      },
      originalPosition: null,
      // fix Safari parent width: https://product-fabric.atlassian.net/browse/ED-1784
      cssPosition: 'absolute',
      originalHeight: null,
      maxHeight: null,
      fixedOffset: null,
    };

    this.extractStyles = rafSchedule(this.extractStyles.bind(this));
  }

  componentDidMount() {
    this.applyPopper(this.props);
    this.calculateFixedOffset(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.applyPopper(nextProps);
    this.calculateFixedOffset(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    const { onFlippedChange, onPositioned } = this.props;
    const {
      flipped,
      actualPosition,
      originalPosition,
      hasExtractedStyles,
    } = this.state;

    if (prevState.flipped !== flipped && onFlippedChange) {
      onFlippedChange({ flipped, actualPosition, originalPosition });
    }

    // This flag is set the first time the position is calculated from Popper and applied to the content
    if (!prevState.hasExtractedStyles && hasExtractedStyles && onPositioned) {
      onPositioned();
    }
  }

  componentWillUnmount() {
    this.extractStyles.cancel();
    if (this.popper) {
      this.popper.destroy();
    }
  }

  /* Calculate the max height of the popper if it's height is greater than the viewport to prevent
   * the bottom of the popper not being viewable.
   * Only works if the popper uses viewport as the boundary and has a fixed position ancestor.
   */
  calculateMaxHeight(originalHeight, currentHeight, positionTop, cssPosition) {
    let DocumentElementClientHeight = 0;

    if (document.documentElement) {
      DocumentElementClientHeight = document.documentElement.clientHeight;
    }
    if (
      cssPosition !== 'fixed' ||
      this.props.boundariesElement !== 'viewport'
    ) {
      return null;
    }
    const viewportHeight = Math.max(
      DocumentElementClientHeight,
      window.innerHeight || 0,
    );
    return viewportHeight < originalHeight &&
      currentHeight + positionTop >= viewportHeight - 50
      ? // allow some spacing either side of viewport height
        viewportHeight - 12
      : null;
  }

  /* Popper may return either a fixed or absolute position which would be applied to the
   * content style. In order to overcome clipping issues for overflow containing blocks when
   * the position is absolute, we create a fixed position wrapper.
   */
  calculateFixedOffset(props) {
    const { isAlwaysFixed } = props;

    if (isAlwaysFixed && this.targetRef) {
      const actualTarget = this.targetRef.firstChild;
      this.setState({
        fixedOffset: {
          top: actualTarget.getBoundingClientRect().top,
          left: actualTarget.getBoundingClientRect().left,
        },
      });
    } else if (!isAlwaysFixed && this.state.fixedOffset !== null) {
      this.setState({
        fixedOffset: null,
      });
    }
  }

  /* Clamp fixed position to the window for fixed position poppers that flow off the top of the
   * window.
   * A fixed position popper is a popper who has an ancestor with position: fixed.
   *
   * It is too difficult to fix this for non-fixed position poppers without re-implementing popper's
   * offset functionality or fixing the issue upstream.
   */
  // eslint-disable-next-line class-methods-use-this
  fixPositionTopUnderflow(popperTop, cssPosition) {
    return popperTop >= 0 || cssPosition !== 'fixed'
      ? Math.round(popperTop)
      : 0;
  }

  extractStyles = (state) => {
    if (state) {
      const popperHeight = state.offsets.popper.height;
      const left = Math.round(state.offsets.popper.left);
      // The offset position is sometimes an object and sometimes just a string...
      const cssPosition =
        typeof state.offsets.popper.position === 'object'
          ? state.offsets.popper.position.position
          : state.offsets.popper.position;
      const top = this.fixPositionTopUnderflow(
        state.offsets.popper.top,
        cssPosition,
      );

      const originalHeight = this.state.originalHeight || popperHeight;
      const maxHeight = this.calculateMaxHeight(
        originalHeight,
        popperHeight,
        top,
        cssPosition,
      );
      this.setState({
        // position: fixed or absolute
        cssPosition,
        hasExtractedStyles: true,
        transform: `translate3d(${left}px, ${top}px, 0px)`,
        // state.flipped is either true or undefined
        flipped: !!state.flipped,
        actualPosition: state.position,
        originalPosition: state.originalPosition,
        originalHeight,
        maxHeight,
      });
    }
  };

  applyPopper(props) {
    if (!this.fixedRef || !this.targetRef || !this.contentRef) {
      return;
    }

    if (this.popper) {
      this.popper.destroy();
    }

    // "new Popper(...)" operation is very expensive when called on virtual DOM.
    // This condition reduces the number of calls so we can run our tests faster
    // (time was reduced from 100s to 13s).
    if (!props.content) {
      return;
    }

    // we wrap our target in a div so that we can safely get a reference to it, but we pass the
    // actual target to popper
    const actualTarget = props.isAlwaysFixed
      ? this.fixedRef
      : this.targetRef.firstChild;
    const popperOpts = {
      placement: positionPropToPopperPosition(props.position),
      onCreate: this.extractStyles,
      onUpdate: this.extractStyles,
      modifiers: {
        applyStyle: {
          enabled: false,
        },
        hide: {
          enabled: false,
        },
        offset: {
          enabled: true,
          offset: this.props.offset,
        },
        flip: {
          enabled: !!this.props.autoFlip,
          flipVariations: true,
          boundariesElement: this.props.boundariesElement,
          padding: 0, // leave 0 pixels between popper and the boundariesElement
        },
        preventOverflow: {
          enabled: !!this.props.autoFlip,
          escapeWithReference: !(
            this.props.boundariesElement === 'scrollParent'
          ),
        },
      },
      positionFixed: props.isAlwaysFixed,
    };

    const flipBehavior = getFlipBehavior(props);
    if (flipBehavior) {
      popperOpts.modifiers.flip.behavior = flipBehavior;
    }

    this.popper = new Popper(actualTarget, this.contentRef, popperOpts);
  }

  render() {
    const { zIndex, lockScroll } = this.props;
    const {
      cssPosition,
      transform,
      hasExtractedStyles,
      maxHeight,
      fixedOffset,
    } = this.state;
    const opacity = hasExtractedStyles ? {} : { opacity: 0 };

    return (
      <div>
        <div
          ref={(ref) => {
            this.targetRef = ref;
          }}
        >
          {this.props.children}
        </div>
        <FixedTarget targetRef={this.targetRef} fixedOffset={fixedOffset}>
          <div
            style={{ height: '100%', width: '100%' }}
            ref={(ref) => {
              this.fixedRef = ref;
            }}
          />
        </FixedTarget>
        {lockScroll && <ScrollBlock />}
        <ContentContainer maxHeight={maxHeight}>
          <div
            ref={(ref) => {
              this.contentRef = ref;
            }}
            style={{
              top: 0,
              left: 0,
              position: cssPosition,
              transform,
              zIndex,
              ...opacity,
            }}
          >
            {this.props.content}
          </div>
        </ContentContainer>
      </div>
    );
  }
}
