// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import rafSchedule from 'raf-schd';

const containerDivStyle: React.CSSProperties = {
	width: '100%',
	position: 'relative',
};

// Not using styled-components here for performance
// and framework-agnostic reasons.
const sizerStyle: React.CSSProperties = {
	display: 'block',
	position: 'absolute',
	top: 0,
	left: 0,
	height: 0,
	width: '100%',
	opacity: 0,
	overflow: 'hidden',
	pointerEvents: 'none',
	zIndex: -1,
};

type WidthDetectorProps = {
	children: (width?: number) => React.ReactNode;
	onResize?: (width: number) => void;
	/**
	 * Optional styles to be applied to the containing element
	 */
	containerStyle?: React.CSSProperties;
};

type State = {
	width?: number;
};

// add a definition for a data field to the resize object
// since HTMLElements do not have this.
type ResizeObject = HTMLObjectElement & {
	data: String;
	contentDocument: HTMLDocument;
};

/**
 * @deprecated use WidthObserver instead
 *
 * This component uses iframes for rendering and is currently
 * not performant. It will be DEPRECATED in the future.
 * It is recommended that you instead use WidthObserver from @atlaskit/width-detector
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class WidthDetector extends React.Component<WidthDetectorProps, State> {
	state: State = {};
	container?: HTMLDivElement;
	resizeObjectDocument?: Window;
	resizeObject?: ResizeObject;

	constructor(props: WidthDetectorProps) {
		super(props);

		// eslint-disable-next-line no-console
		console.warn(
			'WidthDetector will be deprecated, please use WidthObserver from @atlaskit/width-detector instead.',
		);
	}

	static defaultProps = {
		containerStyle: {},
	};

	handleResize: (() => void) & {
		cancel(): void;
	} = rafSchedule((): void => {
		const { container } = this;
		if (!container) {
			return;
		}

		const width = container.offsetWidth;

		this.setState({
			width,
		});

		if (this.props.onResize) {
			this.props.onResize(width);
		}
	});

	componentDidMount(): void {
		if (this.resizeObject) {
			this.resizeObject.data = 'about:blank';
		}
		// Calculate width first time, after object has loaded.
		// Prevents it from getting in a weird state where width is always 0.
		this.handleResize();
	}

	componentWillUnmount(): void {
		this.handleResize.cancel();

		if (this.resizeObjectDocument) {
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.resizeObjectDocument.removeEventListener('resize', this.handleResize);
		}
	}

	handleContainerRef = (ref: HTMLDivElement): void => {
		if (!ref) {
			return;
		}
		this.container = ref;
	};

	handleObjectRef = (ref: ResizeObject): void => {
		if (!ref) {
			return;
		}
		this.resizeObject = ref;
	};

	handleObjectLoad = (): void => {
		if (!this.resizeObject) {
			return;
		}

		this.resizeObjectDocument = this.resizeObject.contentDocument.defaultView as Window;
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		this.resizeObjectDocument.addEventListener('resize', this.handleResize);
		this.handleResize();
	};

	render(): React.JSX.Element {
		// @TODO: Add alternative method using IntersectionObserver or ResizeObserver

		const sizerEl = (
			<>
				{/* we're using aria-hidden here */}
				{/* eslint-disable-next-line @atlassian/a11y/alt-text */}
				<object
					type="text/html"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={sizerStyle}
					ref={this.handleObjectRef}
					onLoad={this.handleObjectLoad}
					aria-hidden
					tabIndex={-1}
				/>
			</>
		);
		// pluck non-DOM props off the props so we can safely spread remaining items
		const { containerStyle, onResize, children, ...props } = this.props;
		return (
			<div
				{...props}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ ...containerDivStyle, ...containerStyle }}
				ref={this.handleContainerRef}
			>
				{children(this.state.width)}
				{sizerEl}
			</div>
		);
	}
}
