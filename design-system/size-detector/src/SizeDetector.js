/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import rafSchedule from 'raf-schd';

// Need to make outer div full height in case consumer wants to align
// child content vertically center. These styles can be overridden by the
// product using the optional SizeDetector.containerStyle prop.
const containerDivStyle = {
  height: '100%',
  flex: '1 0 auto',
  position: 'relative',
};

// Not using styled-components here for performance
// and framework-agnostic reasons.
const objectStyle = {
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  opacity: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: -1,
};

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/size-detector has been deprecated. Please use the @atlaskit/width-detector package instead.',
  );
}

export default class SizeDetector extends Component {
  resizeObjectDocument;

  containerRef = React.createRef();

  objectElementRef = React.createRef();

  static defaultProps = {
    containerStyle: {},
  };

  state = {
    sizeMetrics: {
      width: null,
      height: null,
    },
  };

  componentDidMount() {
    if (this.objectElementRef.current) {
      this.objectElementRef.current.data = 'about:blank';
    }
    this.handleResize();
  }

  componentWillUnmount() {
    this.handleResize.cancel();

    if (this.resizeObjectDocument) {
      this.resizeObjectDocument.removeEventListener(
        'resize',
        this.handleResize,
      );
    }
  }

  // Attach the resize event to object when it loads
  handleObjectLoad = () => {
    if (!this.objectElementRef.current) {
      return;
    }

    this.resizeObjectDocument = this.objectElementRef.current.contentDocument.defaultView;
    this.resizeObjectDocument.addEventListener('resize', this.handleResize);

    this.handleResize();
  };

  // limit the resize event occure only once per requestAnimationFrame
  handleResize = rafSchedule(() => {
    const { containerRef } = this;
    if (!containerRef.current) {
      return;
    }

    const sizeMetrics = {
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    };

    this.setState({
      sizeMetrics,
    });

    if (this.props.onResize) {
      this.props.onResize(sizeMetrics);
    }
  });

  render() {
    const { sizeMetrics } = this.state;
    const { children } = this.props;
    return (
      <div
        style={{ ...containerDivStyle, ...this.props.containerStyle }}
        ref={this.containerRef}
      >
        {/* eslint-disable jsx-a11y/alt-text */}
        <object
          type="text/html"
          style={objectStyle}
          ref={this.objectElementRef}
          onLoad={this.handleObjectLoad}
          aria-hidden
          tabIndex={-1}
        />
        {children(sizeMetrics)}
      </div>
    );
  }
}
