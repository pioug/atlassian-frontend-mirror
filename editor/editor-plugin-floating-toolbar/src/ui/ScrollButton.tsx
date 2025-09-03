import React, { useEffect, useState } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';
import rafSchedule from 'raf-schd';
import type { IntlShape } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import { messages } from '@atlaskit/editor-common/floating-toolbar';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import ChevronLeftLargeIcon from '@atlaskit/icon/core/migration/chevron-left--chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/core/migration/chevron-right--chevron-right-large';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const rightSideStyles = xcss({
	borderLeft: `solid ${token('color.border')} 1px`,
	right: 'space.0',
	borderTopRightRadius: 'radius.small',
	borderBottomRightRadius: 'radius.small',
});

const leftSideStyles = xcss({
	borderRight: `solid ${token('color.border')} 1px`,
	left: 'space.0',
	borderTopLeftRadius: 'radius.small',
	borderBottomLeftRadius: 'radius.small',
});

const buttonCommonStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	zIndex: '1',
	position: 'absolute',
});

type ScrollButtonProps = {
	disabled: boolean;
	intl: IntlShape;
	node: Node;
	scrollContainerRef: React.RefObject<HTMLDivElement>;
	side: 'left' | 'right';
};

export const ScrollButton = ({
	intl,
	scrollContainerRef,
	node,
	disabled,
	side,
}: ScrollButtonProps) => {
	const [needScroll, setNeedScroll] = useState(false);
	const [canScrollToSide, setCanScrollToSide] = useState(true);

	const setCanScrollDebounced = rafSchedule(() => {
		// Refs are null before mounting and after unmount
		if (!scrollContainerRef.current) {
			return;
		}
		const { scrollLeft, scrollWidth, offsetWidth } = scrollContainerRef.current;

		setCanScrollToSide(
			// -1 to account for pixel rounding error
			side === 'left' ? scrollLeft > 0 : scrollLeft < scrollWidth - offsetWidth - 1,
		);
	});

	const onScroll = () => {
		setCanScrollDebounced();
	};

	const onClick = () => {
		const { width: scrollContainerWidth = 0 } =
			scrollContainerRef.current?.getBoundingClientRect() || {};

		const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

		const scrollTo =
			side === 'left' ? scrollLeft - scrollContainerWidth : scrollLeft + scrollContainerWidth;

		scrollContainerRef.current?.scrollTo({
			top: 0,
			left: scrollTo,
			behavior: 'smooth',
		});
	};

	const resizeObserver = new ResizeObserver((t) => {
		const widthNeededToShowAllItems = scrollContainerRef.current?.scrollWidth || 0;

		const parentNode = scrollContainerRef.current?.parentNode;
		let availableSpace: number = -1;

		if (parentNode instanceof HTMLElement) {
			availableSpace = parentNode.offsetWidth;
		}

		if (availableSpace === -1) {
			return;
		}

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
		let unbind: UnbindFn | undefined;

		if (scrollContainerRefCurrent) {
			// Adding/removing scroll button depending on scroll position
			unbind = bind(scrollContainerRefCurrent, {
				type: 'scroll',
				listener: onScroll,
			});

			// watch for toolbar resize and show/hide scroll buttons if needed
			resizeObserver.observe(scrollContainerRefCurrent);
		}

		return () => {
			if (scrollContainerRefCurrent) {
				unbind?.();
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
	}, [node.type, scrollContainerRef]);

	const Icon = side === 'left' ? ChevronLeftLargeIcon : ChevronRightLargeIcon;
	return (
		needScroll &&
		((side === 'left' && canScrollToSide) || (side === 'right' && canScrollToSide)) && (
			<Box
				padding="space.050"
				xcss={[side === 'left' ? leftSideStyles : rightSideStyles, buttonCommonStyles]}
			>
				<IconButton
					appearance="subtle"
					label={intl.formatMessage(
						side === 'left'
							? messages.floatingToolbarScrollLeft
							: messages.floatingToolbarScrollRight,
					)}
					onClick={onClick}
					isDisabled={disabled}
					icon={(iconProps) => <Icon label={iconProps.label} size="small" />}
					isTooltipDisabled={false}
					tooltip={{ position: 'top' }}
				/>
			</Box>
		)
	);
};
