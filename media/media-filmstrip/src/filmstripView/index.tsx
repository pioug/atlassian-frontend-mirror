import React from 'react';
import { ReactNode, WheelEvent, MouseEvent, ReactElement } from 'react';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import ArrowRight from '@atlaskit/icon/glyph/arrow-right';
import debounce from 'debounce';
import {
  FilmStripViewWrapper,
  FilmStripListWrapper,
  FilmStripList,
  ArrowLeftWrapper,
  ArrowRightWrapper,
  ShadowLeft,
  ShadowRight,
  FilmStripListItem,
} from './styled';

const DURATION_MIN = 0.5;
const DURATION_MAX = 1.0;

const EXTRA_PADDING = 4;

export const MUTATION_CONFIG = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true,
};

export interface ChildOffset {
  left: number;
  right: number;
}

export interface SizeEvent {
  width: number;
  offset: number;
  offsets: ChildOffset[];
  minOffset: number;
  maxOffset: number;
}

export interface ScrollEvent {
  direction: 'left' | 'right';
  offset: number;
  animate: boolean;
}

export interface FilmstripViewProps {
  /**  A **boolean**. Defaults to **false**.
   *  When true, any change to the **offset** property will be animated.
   * Having **animate=true** results in an awkward UX when changing the **offset** property before the
   * animation finishes.
   */
  animate?: boolean;
  /** A **number**. Defaults to 0.
   * Determines the visible portion of the filmstrip.
   */
  offset?: number;
  /** Any React **node** */
  children?: ReactNode;
  /** A **function** called when the size of the filmstrip has been changed e.g. when mounted, after the window is resized or the children have changed.
   * **Arguments:**
   * - event:
   * - width - A number. The visible width of the filmstrip;
   * - offset - A number.
   * - offsets: ChildOffset[];
   * - minOffset - A number.
   * - maxOffset - A number.
   */
  onSize?: (event: SizeEvent) => void;
  /** A **function** called when the user has indicated they wish to change the visible porition of the filmstrip e.g. clicked the left or right arrows, or scrolled the scroll wheel.
   * **Arguments:**
   * - event:
   * - direction - Either **"left"** or **"right"**. The direction the user wants to move the filmstrip.
   * - offset - A **number**. The desired offset.
   * - animate - A **boolean**. Whether the change should be animated (this arg could probably do with a better name!)
   */
  onScroll?: (event: ScrollEvent) => void;
  testId?: string;
}

export interface FilmstripViewState {
  bufferWidth: number;
  windowWidth: number;
}

export interface ArrowProps {
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
}

export const MediaFilmStripListItemSelector = 'media-filmstrip-list-item';

export const LeftArrow: React.SFC<ArrowProps> = ({ onClick }: ArrowProps) => (
  <ShadowLeft>
    <ArrowLeftWrapper className="arrow" onClick={onClick}>
      <ArrowLeft label="left" />
    </ArrowLeftWrapper>
  </ShadowLeft>
);

export const RightArrow: React.SFC<ArrowProps> = ({ onClick }: ArrowProps) => (
  <ShadowRight>
    <ArrowRightWrapper className="arrow" onClick={onClick}>
      <ArrowRight label="right" />
    </ArrowRightWrapper>
  </ShadowRight>
);

export class FilmstripView extends React.Component<
  FilmstripViewProps,
  FilmstripViewState
> {
  static defaultProps: Partial<FilmstripViewProps> = {
    animate: false,
    offset: 0,
  };

  bufferElement?: HTMLElement;
  windowElement?: HTMLElement;

  mutationObserver?: MutationObserver;

  childOffsets: ChildOffset[];
  previousOffset: number = 0;

  state = {
    bufferWidth: 0,
    windowWidth: 0,
  };

  constructor(props: FilmstripViewProps) {
    super(props);
    this.childOffsets = [];
    try {
      this.mutationObserver = new MutationObserver(
        debounce(this.handleMutation, 30, true),
      );
    } catch (e) {
      // in the case where we are running on an unsupported browser,
      // or where tests include the FilmstripView but do not mock the MutationObserver - we catch it and handle safely here.
      // NOTE: this won't effect the component, it just means mutations won't be observerd
    }
  }

  get offset() {
    const { offset } = this.props;
    if (!offset) {
      return 0;
    }
    return Math.min(this.maxOffset, Math.max(this.minOffset, offset));
  }

  get minOffset() {
    return 0;
  }

  /**
   * The furthest we can scroll, where the end of the buffer is just in view
   */
  get maxOffset() {
    const { bufferWidth, windowWidth } = this.state;
    return Math.max(this.minOffset, bufferWidth - windowWidth - 1);
  }

  get canGoLeft() {
    return this.offset > this.minOffset;
  }

  get canGoRight() {
    return this.offset < this.maxOffset;
  }

  get transitionDuration() {
    const { animate } = this.props;
    const { windowWidth } = this.state;
    if (!animate) {
      return 0;
    }
    if (Math.abs(this.offset - this.previousOffset) < 1e-6) {
      return DURATION_MIN;
    } else {
      const diff = Math.abs(this.offset - this.previousOffset);
      const relativeOffset = diff / windowWidth;
      const duration = DURATION_MAX - DURATION_MIN * relativeOffset;
      return Math.max(Math.min(duration, DURATION_MAX), DURATION_MIN);
    }
  }

  initMutationObserver() {
    const { mutationObserver } = this;
    if (mutationObserver && this.bufferElement) {
      mutationObserver.disconnect();
      mutationObserver.observe(this.bufferElement, MUTATION_CONFIG);
    }
  }

  triggerScrollEvent() {
    if (!this.windowElement) {
      return;
    }
    const event = document.createEvent('MouseEvents');
    event.initEvent('scroll', true, true);
    this.windowElement.dispatchEvent(event);
  }

  // find the child that is cut off on the left edge of the window and change the window offset to
  // start to the left of that child
  getClosestForLeft(offset: number): number {
    const leftWindowEdge = Math.min(
      this.maxOffset,
      Math.max(this.minOffset, offset),
    );
    for (let i = 0; i < this.childOffsets.length; ++i) {
      const childBounds = this.childOffsets[i];
      if (
        leftWindowEdge >= childBounds.left &&
        leftWindowEdge <= childBounds.right
      ) {
        const newOffset = childBounds.left;
        if (newOffset >= EXTRA_PADDING) {
          return newOffset - EXTRA_PADDING; // show extra padding from the next sibling for aesthetic reasons
        } else {
          return newOffset;
        }
      }
    }
    return Math.min(this.maxOffset, Math.max(this.minOffset, offset));
  }

  // find the child that is cut off on the right edge of the window and change the window offset
  // to finish at start of the next child
  getClosestForRight(offset: number): number {
    const { windowWidth } = this.state;
    const rightWindowEdge =
      Math.min(this.maxOffset, Math.max(this.minOffset, offset)) + windowWidth;
    for (let i = 0; i < this.childOffsets.length; ++i) {
      const childBounds = this.childOffsets[i];
      if (
        rightWindowEdge >= childBounds.left &&
        rightWindowEdge <= childBounds.right
      ) {
        const newOffset = childBounds.right - windowWidth;
        if (newOffset + EXTRA_PADDING <= this.maxOffset) {
          return newOffset + EXTRA_PADDING; // show extra padding from the next sibling for aesthetic reasons
        } else {
          return newOffset;
        }
      }
    }
    return Math.min(this.maxOffset, Math.max(this.minOffset, offset));
  }

  handleSizeChange = () => {
    // get the new widths
    const { windowElement, bufferElement } = this;
    let bufferWidth = 0;
    let windowWidth = 0;
    let childOffsets: ChildOffset[] = [];

    if (windowElement && bufferElement) {
      bufferWidth = bufferElement.getBoundingClientRect().width;
      windowWidth = windowElement.getBoundingClientRect().width;

      // we're calculating `left` based on `width` because `rect.left` can be a negative value after resizing the window (considered scrolled??)
      const children: Element[] = Array.prototype.slice.call(
        bufferElement.children,
        0,
      );
      let left = 0;
      childOffsets = children.map((child: Element, index: number) => {
        const width = child.getBoundingClientRect().width;

        const offset = {
          left,
          right: left + width - 1,
        };
        left += width;
        return offset;
      });
    }

    // make sure the state has changed before we update state and notify the integrator
    // (otherwise, since this method() is called in componentDidUpdate() we'll recurse until the stack size is exceeded)
    const {
      bufferWidth: prevBufferWidth,
      windowWidth: prevWindowWidth,
    } = this.state;

    if (bufferWidth === prevBufferWidth && windowWidth === prevWindowWidth) {
      // NOTE: we're not checking here if childOffsets has changed... if the children change size but
      // result in the exact same size buffer, we're not going to update, resulting in incorrect navigations
      return;
    }

    // store the widths
    this.setState(
      {
        bufferWidth,
        windowWidth,
      },
      () => {
        this.childOffsets = childOffsets;

        // notify the integrator
        const { onSize } = this.props;
        if (onSize) {
          onSize({
            offset: Math.min(this.maxOffset, this.offset),
            offsets: childOffsets,
            width: windowWidth,
            minOffset: this.minOffset,
            maxOffset: this.maxOffset,
          });
        }
      },
    );
  };

  handleWindowElementChange = (windowElement: HTMLElement) => {
    this.windowElement = windowElement;
    this.handleSizeChange();
  };

  handleBufferElementChange = (bufferElement: HTMLElement) => {
    if (!bufferElement) {
      return;
    }

    this.bufferElement = bufferElement;
    this.handleSizeChange();

    this.initMutationObserver();
  };

  handleMutation = (mutationList: MutationRecord[]) => {
    // there are edge cases where the DOM may change outside of the normal React life-cycle
    // https://product-fabric.atlassian.net/browse/MSW-425
    this.handleSizeChange();
  };

  handleLeftClick = (event: MouseEvent<HTMLDivElement, any>) => {
    // Stop the click event from bubling up and being handled by other components
    // See https://product-fabric.atlassian.net/browse/MSW-165
    event.stopPropagation();

    const { onScroll } = this.props;
    if (onScroll) {
      const { windowWidth } = this.state;
      const newOffset = this.getClosestForLeft(this.offset - windowWidth);
      onScroll({
        direction: 'left',
        offset: newOffset,
        animate: true,
      });
    }
  };

  handleRightClick = (event: MouseEvent<HTMLDivElement, any>) => {
    // Stop the click event from bubling up and being handled by other components
    // See https://product-fabric.atlassian.net/browse/MSW-165
    event.stopPropagation();

    const { onScroll } = this.props;
    if (onScroll) {
      const { windowWidth } = this.state;
      const newOffset = this.getClosestForRight(this.offset + windowWidth);
      onScroll({
        direction: 'right',
        offset: newOffset,
        animate: true,
      });
    }
  };

  handleScroll = (event: WheelEvent<HTMLDivElement>) => {
    const isHorizontalScroll = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontalScroll) {
      return;
    }

    // don't actually let the element scroll because we'll fake scrolling with `transform: translateX()`
    event.preventDefault();

    // notify the integrator of the offset change
    const { onScroll } = this.props;
    if (onScroll && isHorizontalScroll) {
      const newOffset = Math.max(
        this.minOffset,
        Math.min(this.maxOffset, this.offset + event.deltaX),
      );
      onScroll({
        direction: event.deltaX < 0 ? 'left' : 'right',
        offset: newOffset,
        animate: false,
      });
    }
  };

  renderLeftArrow() {
    const { canGoLeft } = this;
    if (!canGoLeft) {
      return null;
    }
    return <LeftArrow onClick={this.handleLeftClick} />;
  }

  renderRightArrow() {
    const { canGoRight } = this;
    if (!canGoRight) {
      return null;
    }
    return <RightArrow onClick={this.handleRightClick} />;
  }

  componentDidMount() {
    this.previousOffset = this.offset;
    window.addEventListener('resize', this.handleSizeChange);
  }

  componentWillUnmount() {
    const { mutationObserver } = this;

    window.removeEventListener('resize', this.handleSizeChange);

    if (mutationObserver) {
      mutationObserver.disconnect();
    }
  }

  componentDidUpdate() {
    this.previousOffset = this.offset;

    // trigger a "real" scroll event so lazily loaded cards realize they've been shown
    // note: we have to wait for the transition to end, otherwise the cards not visible when the scroll
    // event is triggered will be forever stuck in the loading screen (due to the lazy load)
    window.setTimeout(
      () => this.triggerScrollEvent(),
      this.transitionDuration * 1000,
    );
  }

  render(): JSX.Element {
    const { animate, children, testId } = this.props;

    const transform = `translateX(${-this.offset}px)`;
    const transitionProperty = animate ? 'transform' : 'none';
    const transitionDuration = `${this.transitionDuration}s`;

    return (
      <FilmStripViewWrapper data-testid={testId}>
        {this.renderLeftArrow()}
        <FilmStripListWrapper
          innerRef={this.handleWindowElementChange}
          onWheel={this.handleScroll}
        >
          <FilmStripList
            innerRef={this.handleBufferElementChange}
            style={{ transform, transitionProperty, transitionDuration }}
          >
            {React.Children.map(children, mapReactChildToReactNode)}
          </FilmStripList>
        </FilmStripListWrapper>
        {this.renderRightArrow()}
      </FilmStripViewWrapper>
    );
  }
}

function mapReactChildToReactNode(child: ReactNode, index: number): ReactNode {
  const key = (isReactElement(child) && child.key) || index;
  return (
    <FilmStripListItem
      className={MediaFilmStripListItemSelector}
      data-testid="media-filmstrip-list-item"
      key={key}
    >
      {child}
    </FilmStripListItem>
  );
}

function isReactElement<P>(child: ReactNode): child is ReactElement<P> {
  return !!(child as ReactElement<P>).type;
}
