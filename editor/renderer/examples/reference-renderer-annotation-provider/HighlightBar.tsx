/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';
import { Popup } from './internal-ui/Popup';
import { usePosition } from './internal-ui/Position';

const HighlightBarInternal = ({
	children,
	portalContainer,
	top,
	left,
}: {
	children: React.ReactNode;
	left: number;
	portalContainer: Element;
	top: number;
}) => {
	const WINDOW_PADDING = 20;
	const popupRef = React.useRef<HTMLDivElement>(null);

	const [popupLeft, setPopupLeft] = React.useState(left);

	React.useLayoutEffect(() => {
		if (!popupRef.current) {
			return;
		}

		const { left: elementLeft, right } = popupRef.current.getBoundingClientRect();

		// WS-1703 - If the popup menu is off either side of the screen, set it so it's inside the WINDOW_PADDING
		if (elementLeft < 0) {
			setPopupLeft(left - elementLeft + WINDOW_PADDING);
		} else if (right > window.innerWidth) {
			setPopupLeft(left - (right - window.innerWidth) - WINDOW_PADDING);
		} else {
			setPopupLeft(left);
		}
	}, [left]);

	return ReactDOM.createPortal(
		<Popup top={top} left={popupLeft} ref={popupRef}>
			{children}
		</Popup>,
		portalContainer,
	);
};

export function HighlightBar({
	range,
	stickyHeaderHeight,
	portalContainer,
	children,
}: {
	children: React.ReactNode;
	portalContainer: Element;
	range: Range;
	stickyHeaderHeight: number;
}) {
	const position = usePosition({ range, portalContainer });

	return (
		<HighlightBarInternal
			top={stickyHeaderHeight + position.top}
			left={position.left}
			portalContainer={portalContainer}
		>
			{children}
		</HighlightBarInternal>
	);
}
