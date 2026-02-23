import React from 'react';
import { type ReactNode, type WheelEvent, type MouseEvent, type ReactElement } from 'react';

import debounce from 'debounce';
import {
	FilmStripList,
	FilmStripListItem,
	FilmStripListWrapper,
	FilmStripViewWrapper,
	LeftArrow,
	RightArrow,
} from './wrappers';

export { LeftArrow, RightArrow } from './wrappers';

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
	/** A **string** property that will be assigned to the top level DOM element as **data-testid** attribute.*/
	testId?: string;
}

export interface FilmstripViewState {
	bufferWidth: number;
	windowWidth: number;
	touchMoveStartPosition: number;
	isTouchMoveInProgress: boolean;
}

export interface ArrowProps {
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
}

export const MediaFilmStripListItemSelector = 'media-filmstrip-list-item';

export class FilmstripView extends React.Component<FilmstripViewProps, FilmstripViewState> {
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
		touchMoveStartPosition: 0,
		isTouchMoveInProgress: false,
	};

	constructor(props: FilmstripViewProps) {
		super(props);
		this.childOffsets = [];
		try {
			this.mutationObserver = new MutationObserver(debounce(this.handleMutation, 30, true));
			// eslint-disable-next-line no-unused-vars
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

	get canGoLeft(): boolean {
		return this.offset > this.minOffset;
	}

	get canGoRight(): boolean {
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

	initMutationObserver(): void {
		const { mutationObserver } = this;
		if (mutationObserver && this.bufferElement) {
			mutationObserver.disconnect();
			mutationObserver.observe(this.bufferElement, MUTATION_CONFIG);
		}
	}

	// find the child that is cut off on the left edge of the window and change the window offset to
	// start to the left of that child
	getClosestForLeft(offset: number): number {
		const leftWindowEdge = Math.min(this.maxOffset, Math.max(this.minOffset, offset));
		for (let i = 0; i < this.childOffsets.length; ++i) {
			const childBounds = this.childOffsets[i];
			if (leftWindowEdge >= childBounds.left && leftWindowEdge <= childBounds.right) {
				const newOffset = i === 0 ? childBounds.left : childBounds.right;
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
			if (rightWindowEdge >= childBounds.left && rightWindowEdge <= childBounds.right) {
				const newOffset =
					(i === this.childOffsets.length - 1 ? childBounds.right : childBounds.left) - windowWidth;
				if (newOffset + EXTRA_PADDING <= this.maxOffset) {
					return newOffset + EXTRA_PADDING; // show extra padding from the next sibling for aesthetic reasons
				} else {
					return newOffset;
				}
			}
		}
		return Math.min(this.maxOffset, Math.max(this.minOffset, offset));
	}

	handleSizeChange = (): void => {
		// get the new widths
		const { windowElement, bufferElement } = this;
		let bufferWidth = 0;
		let windowWidth = 0;
		let childOffsets: ChildOffset[] = [];

		if (windowElement && bufferElement) {
			bufferWidth = bufferElement.getBoundingClientRect().width;
			windowWidth = windowElement.getBoundingClientRect().width;

			// we're calculating `left` based on `width` because `rect.left` can be a negative value after resizing the window (considered scrolled??)
			const children: Element[] = Array.prototype.slice.call(bufferElement.children, 0);
			let left = 0;
			childOffsets = children.map((child: Element, _index: number) => {
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
		const { bufferWidth: prevBufferWidth, windowWidth: prevWindowWidth } = this.state;

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

	handleWindowElementChange = (windowElement: HTMLDivElement): void => {
		this.windowElement = windowElement;
		this.handleSizeChange();
	};

	handleBufferElementChange = (bufferElement: HTMLUListElement): void => {
		if (!bufferElement) {
			return;
		}

		this.bufferElement = bufferElement;
		this.handleSizeChange();

		this.initMutationObserver();
	};

	handleMutation = (_mutationList: MutationRecord[]): void => {
		// there are edge cases where the DOM may change outside of the normal React life-cycle
		// https://product-fabric.atlassian.net/browse/MSW-425
		this.handleSizeChange();
	};

	handleLeftClick = (event: MouseEvent<HTMLDivElement, any>): void => {
		// Stop the click event from bubling up and being handled by other components
		// See https://product-fabric.atlassian.net/browse/MSW-165
		event.stopPropagation();

		const { onScroll } = this.props;
		if (onScroll) {
			const { windowWidth } = this.state;
			let newOffset = this.getClosestForLeft(this.offset - windowWidth);
			if (newOffset >= this.offset) {
				// if for some reason we tried to scroll left but it didn't scroll or scrolls right instead (can happen when container is too narrow)
				// just try to scroll by the windowWidth
				newOffset = Math.max(this.offset - windowWidth, this.minOffset);
			}
			onScroll({
				direction: 'left',
				offset: newOffset,
				animate: true,
			});
		}
	};

	handleRightClick = (event: MouseEvent<HTMLDivElement, any>): void => {
		// Stop the click event from bubling up and being handled by other components
		// See https://product-fabric.atlassian.net/browse/MSW-165
		event.stopPropagation();

		const { onScroll } = this.props;
		if (onScroll) {
			const { windowWidth } = this.state;
			let newOffset = this.getClosestForRight(this.offset + windowWidth);
			if (newOffset <= this.offset) {
				// if for some reason we tried to scroll right but it didn't scroll or scrolls left instead (can happen when container is too narrow)
				// just try to scroll by the windowWidth
				newOffset = Math.min(this.offset + windowWidth, this.maxOffset);
			}
			onScroll({
				direction: 'right',
				offset: newOffset,
				animate: true,
			});
		}
	};

	handleScroll = (event: WheelEvent<HTMLDivElement>): void => {
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

	handleTouchStart = (event: React.TouchEvent): void => {
		if (event.touches[0]) {
			this.setState({
				touchMoveStartPosition: event.touches[0].clientX,
				isTouchMoveInProgress: true,
			});
		}
	};

	handleTouchEnd = (event: React.TouchEvent): void => {
		if (event.touches[0]) {
			this.setState({
				touchMoveStartPosition: event.touches[0].clientX,
				isTouchMoveInProgress: false,
			});
		}
	};

	handleTouchMove = (event: React.TouchEvent): void => {
		const { onScroll } = this.props;

		if (this.state.isTouchMoveInProgress && onScroll) {
			const currentPosition = event.touches[0].clientX;
			const newOffset = this.state.touchMoveStartPosition
				? this.offset - (currentPosition - this.state.touchMoveStartPosition)
				: this.offset;

			onScroll({
				direction: newOffset > this.offset ? 'left' : 'right',
				offset: newOffset,
				animate: false,
			});
		}
	};

	renderLeftArrow(): React.JSX.Element | null {
		const { canGoLeft } = this;
		if (!canGoLeft) {
			return null;
		}
		return <LeftArrow onClick={this.handleLeftClick} />;
	}

	renderRightArrow(): React.JSX.Element | null {
		const { canGoRight } = this;
		if (!canGoRight) {
			return null;
		}
		return <RightArrow onClick={this.handleRightClick} />;
	}

	componentDidMount(): void {
		this.previousOffset = this.offset;
		window.addEventListener('resize', this.handleSizeChange);
	}

	componentWillUnmount(): void {
		const { mutationObserver } = this;

		window.removeEventListener('resize', this.handleSizeChange);

		if (mutationObserver) {
			mutationObserver.disconnect();
		}
	}

	componentDidUpdate(): void {
		this.previousOffset = this.offset;
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
					ref={this.handleWindowElementChange}
					onWheel={this.handleScroll}
					onTouchStart={this.handleTouchStart}
					onTouchMove={this.handleTouchMove}
					onTouchEnd={this.handleTouchEnd}
					data-testid="filmstrip-list-wrapper"
				>
					<FilmStripList
						ref={this.handleBufferElementChange}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
		<FilmStripListItem key={key} index={key}>
			{child}
		</FilmStripListItem>
	);
}

function isReactElement<P>(child: ReactNode): child is ReactElement<P> {
	return !!(child as ReactElement<P>).type;
}
