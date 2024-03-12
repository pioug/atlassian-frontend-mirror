import React, { Component, ReactNode } from 'react';

import Popper, { Boundary, Data } from 'popper.js'; // eslint-disable-line import/extensions
import rafSchedule from 'raf-schd';

import { positionPropToPopperPosition } from './internal/helpers';

export type Props = {
  content: ReactNode | null;
  offset: string;
  position: string;
  onPositioned: () => void;
  children?: React.ReactNode;
};

export type State = {
  hasExtractedStyles: boolean;
  position?: string;
  transform?: string;
  offsets: {
    popper: {
      left: number;
      top: number;
    };
  };
  cssPosition: string; // 'fixed' or 'absolute'
  originalHeight: number | null;
  maxHeight: number | null;
};

const defaultState = {
  hasExtractedStyles: false,
  // We set these default offsets to prevent a flash of popper content in the wrong position
  // which can cause incorrect height calculations. Popper will calculate these values
  offsets: {
    popper: {
      left: -9999,
      top: -9999,
      position: null,
    },
  },
  // fix Safari parent width: https://product-fabric.atlassian.net/browse/ED-1784
  cssPosition: 'absolute',
  originalHeight: null,
  maxHeight: null,
};

export default class Layer extends Component<Props, State> {
  private popper: Popper | undefined;
  private targetRef = React.createRef<HTMLDivElement>();
  private contentRef = React.createRef<HTMLDivElement>();

  // working with extract-react-types
  static defaultProps = {
    boundariesElement: 'viewport',
    children: null,
    content: null,
    offset: '0, 0',
    position: 'right middle',
    zIndex: 400,
    lockScroll: false,
    isAlwaysFixed: false,
    onPositioned: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state = defaultState;

    this.extractStyles = rafSchedule(this.extractStyles.bind(this));
  }

  componentDidMount() {
    this.applyPopper(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.applyPopper(nextProps);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { onPositioned } = this.props;
    const { hasExtractedStyles } = this.state;

    // This flag is set the first time the position is calculated from Popper and applied to the content
    if (!prevState.hasExtractedStyles && hasExtractedStyles && onPositioned) {
      onPositioned();
    }
  }

  componentWillUnmount() {
    // this.extractStyles.cancel();
    if (this.popper) {
      this.popper.destroy();
    }
  }

  /* Calculate the max height of the popper if it's height is greater than the viewport to prevent
   * the bottom of the popper not being viewable.
   * Only works if the popper uses viewport as the boundary and has a fixed position ancestor.
   */
  calculateMaxHeight(
    originalHeight: number,
    currentHeight: number,
    positionTop: number,
    cssPosition: string,
  ) {
    let DocumentElementClientHeight = 0;

    if (document.documentElement) {
      DocumentElementClientHeight = document.documentElement.clientHeight;
    }
    if (cssPosition !== 'fixed') {
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

  extractStyles = (state: Data) => {
    if (state) {
      const popperHeight = state.offsets.popper.height;
      const left = Math.round(state.offsets.popper.left);
      const top = Math.round(state.offsets.popper.top);
      const cssPosition = 'absolute';

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
        originalHeight,
        maxHeight,
      });
    }
  };

  applyPopper(props: Props) {
    if (!this.targetRef.current || !this.contentRef.current) {
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
    const isAlwaysFixed = false;
    const actualTarget = this.targetRef.current.children[0];
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
          enabled: false,
          flipVariations: true,
          boundariesElement: 'viewport' as Boundary,
          padding: 0, // leave 0 pixels between popper and the boundariesElement
        },
        preventOverflow: {
          enabled: false,
          escapeWithReference: true,
        },
      },
      positionFixed: isAlwaysFixed,
    };
    if (actualTarget) {
      this.popper = new Popper(
        actualTarget,
        this.contentRef.current,
        popperOpts,
      );
    }
  }

  render() {
    const { transform, hasExtractedStyles, maxHeight } = this.state;
    const opacity = hasExtractedStyles ? {} : { opacity: 0 };

    return (
      <div>
        <div ref={this.targetRef}>{this.props.children}</div>
        <div
          ref={this.contentRef}
          style={{
            top: 0,
            left: 0,
            position: 'absolute',
            transform,
            maxHeight: maxHeight ? maxHeight : 'auto',
            ...opacity,
          }}
        >
          {this.props.content}
        </div>
      </div>
    );
  }
}
