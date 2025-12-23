import React from 'react';
import { ScrollableStyle } from './styles';

export interface Props {
	children?: React.ReactNode | React.ReactNode[];
}

export default class Scrollable extends React.PureComponent<Props, {}> {
	private scrollableDiv?: HTMLDivElement | null;

	revealRef = (ref: React.RefObject<HTMLDivElement>): void => {
		if (ref && ref.current && this.scrollableDiv) {
			// Not using Element.scrollIntoView as it scrolls even to top/bottom of view even if
			// already visible
			const scrollableRect = this.scrollableDiv.getBoundingClientRect();
			const elementRect = ref.current.getBoundingClientRect();
			if (elementRect.top < scrollableRect.top) {
				this.scrollableDiv.scrollTop += elementRect.top - scrollableRect.top;
			} else if (elementRect.bottom > scrollableRect.bottom) {
				this.scrollableDiv.scrollTop += elementRect.bottom - scrollableRect.bottom;
			}
		}
	};

	private handleRef = (ref: HTMLDivElement | null) => {
		this.scrollableDiv = ref;
	};

	render(): React.JSX.Element {
		return <ScrollableStyle ref={this.handleRef}>{this.props.children}</ScrollableStyle>;
	}
}
