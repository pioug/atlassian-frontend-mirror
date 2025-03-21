// FIXME - FAB-1732 looking at making a shared component for this

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { type MouseEventHandler, PureComponent, type ReactNode, type UIEvent } from 'react';

const emojiScrollable = css({
	border: `1px solid ${token('color.border', '#fff')}`,
	borderRadius: token('border.radius.100', '3px'),
	display: 'block',
	margin: '0',
	overflowX: 'hidden',
	overflowY: 'auto',
	padding: '0',
});

export interface OnScroll {
	(element: Element, event: UIEvent<any>): void;
}

export interface Props {
	className?: string;
	maxHeight?: string;
	children?: ReactNode;
	onScroll?: OnScroll;
	onMouseLeave?: MouseEventHandler<any>;
}

export default class Scrollable extends PureComponent<Props, {}> {
	private scrollableDiv: HTMLElement | null = null;

	// API
	reveal = (child: HTMLElement, forceToTop?: boolean): void => {
		if (child && this.scrollableDiv) {
			// Not using Element.scrollIntoView as it scrolls even to top/bottom of view even if
			// already visible
			const scrollableRect = this.scrollableDiv.getBoundingClientRect();
			const elementRect = child.getBoundingClientRect();
			if (forceToTop || elementRect.top < scrollableRect.top) {
				this.scrollableDiv.scrollTop += elementRect.top - scrollableRect.top;
			} else if (elementRect.bottom > scrollableRect.bottom) {
				this.scrollableDiv.scrollTop += elementRect.bottom - scrollableRect.bottom;
			}
		}
	};

	scrollToBottom = (): void => {
		if (this.scrollableDiv) {
			this.scrollableDiv.scrollTop = this.scrollableDiv.scrollHeight;
		}
	};

	private handleScroll = (event: UIEvent<HTMLDivElement>) => {
		const sampleOffset = 10;
		let firstElement;
		if (this.scrollableDiv) {
			const scrollableRect = this.scrollableDiv.getBoundingClientRect();
			firstElement = document.elementFromPoint(
				scrollableRect.left + sampleOffset,
				scrollableRect.top + sampleOffset,
			);
		}
		if (this.props.onScroll && firstElement) {
			this.props.onScroll(firstElement, event);
		}
	};

	private handleRef = (ref: HTMLElement | null) => {
		this.scrollableDiv = ref;
	};

	render() {
		const { children, className, maxHeight, onMouseLeave } = this.props;

		const style = maxHeight ? { maxHeight } : {};

		return (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={`emoji-scrollable ${className}`}
				css={emojiScrollable}
				onMouseLeave={onMouseLeave}
				onScroll={this.handleScroll}
				ref={this.handleRef}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
			>
				{children}
			</div>
		);
	}
}
