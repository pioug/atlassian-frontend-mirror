/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import rafSchedule from 'raf-schd';
import type { IntlShape } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/floating-toolbar';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import ChevronLeftLargeIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightLargeIcon from '@atlaskit/icon/core/chevron-right';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const toolbarScrollButtons = css({
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gridGap: token('space.050', '4px'),
	padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
	borderLeft: `solid ${token('color.border', N30)} 1px`,
	flexShrink: 0,
	alignItems: 'center',
});

const LeftIcon = ChevronLeftLargeIcon;
const RightIcon = ChevronRightLargeIcon;

interface ScrollButtonsProps {
	areAnyNewToolbarFlagsEnabled: boolean;
	disabled: boolean;
	intl: IntlShape;
	node: Node;
	scrollContainerRef: React.RefObject<HTMLDivElement>;
}

// Remove this component (replaced by ScrollButton) as part of platform_editor_controls clean up
export const ScrollButtons = ({
	intl,
	scrollContainerRef,
	node,
	disabled,
	areAnyNewToolbarFlagsEnabled,
}: ScrollButtonsProps) => {
	const buttonsContainerRef = useRef<HTMLDivElement>(null);
	const [needScroll, setNeedScroll] = useState(false);
	const [canScrollLeft, setCanScrollLeft] = useState(true);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const setCanScrollDebounced = rafSchedule(() => {
		// Refs are null before mounting and after unmount
		if (!scrollContainerRef.current) {
			return;
		}
		const { scrollLeft, scrollWidth, offsetWidth } = scrollContainerRef.current;
		setCanScrollLeft(scrollLeft > 0);
		setCanScrollRight(scrollLeft + offsetWidth < scrollWidth - 1); // -1 to account for half pixel
	});

	const onScroll = () => setCanScrollDebounced();

	const scrollLeft = () => {
		const { width: scrollContainerWidth = 0 } =
			scrollContainerRef.current?.getBoundingClientRect() || {};

		const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

		// scroll to current position - scroll container width
		const scrollTo = scrollLeft - scrollContainerWidth;

		scrollContainerRef.current?.scrollTo({
			top: 0,
			left: scrollTo,
			behavior: 'smooth',
		});
	};

	const scrollRight = () => {
		const { width: scrollContainerWidth = 0 } =
			scrollContainerRef.current?.getBoundingClientRect() || {};

		const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

		// scroll to current position + scroll container width
		const scrollTo = scrollLeft + scrollContainerWidth;

		scrollContainerRef.current?.scrollTo({
			top: 0,
			left: scrollTo,
			behavior: 'smooth',
		});
	};

	const resizeObserver = new ResizeObserver((t) => {
		const widthNeededToShowAllItems = scrollContainerRef.current?.scrollWidth || 0;
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const availableSpace = (scrollContainerRef.current?.parentNode as HTMLElement)?.offsetWidth;

		if (availableSpace >= widthNeededToShowAllItems) {
			setNeedScroll(false);
		} else {
			setNeedScroll(true);
			onScroll();
		}
	});

	useEffect(() => {
		onScroll();
		const scrollContainerRefCurrent = scrollContainerRef.current;
		if (scrollContainerRefCurrent) {
			// enable/disable scroll buttons depending on scroll position
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			scrollContainerRefCurrent.addEventListener('scroll', onScroll);

			// watch for toolbar resize and show/hide scroll buttons if needed
			resizeObserver.observe(scrollContainerRefCurrent);
		}

		return () => {
			if (scrollContainerRefCurrent) {
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				scrollContainerRefCurrent.removeEventListener('scroll', onScroll);
				resizeObserver.unobserve(scrollContainerRefCurrent);
			}
			setCanScrollDebounced.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const scrollContainerRefCurrent = scrollContainerRef.current;
		if (scrollContainerRefCurrent) {
			// reset scroll position when switching from one node with toolbar to another
			// scroll to made optional as it may not be rendered in testing env
			scrollContainerRefCurrent.scrollTo?.({
				left: 0,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [node.type]);

	return needScroll ? (
		<div
			ref={buttonsContainerRef}
			css={toolbarScrollButtons}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="scroll-buttons"
		>
			<Button
				title={intl.formatMessage(messages.floatingToolbarScrollLeft)}
				icon={
					<LeftIcon label={intl.formatMessage(messages.floatingToolbarScrollLeft)} size="small" />
				}
				onClick={scrollLeft}
				disabled={!canScrollLeft || disabled}
				areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
			/>
			<Button
				title={intl.formatMessage(messages.floatingToolbarScrollRight)}
				icon={
					<RightIcon label={intl.formatMessage(messages.floatingToolbarScrollRight)} size="small" />
				}
				onClick={scrollRight}
				disabled={!canScrollRight || disabled}
				areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
			/>
		</div>
	) : null;
};
