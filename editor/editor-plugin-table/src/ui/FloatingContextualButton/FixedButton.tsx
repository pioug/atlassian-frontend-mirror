import React, { useEffect, useMemo, useRef } from 'react';

import rafSchedule from 'raf-schd';
import { createPortal } from 'react-dom';

import { akEditorTableCellOnStickyHeaderZIndex } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { RowStickyState } from '../../pm-plugins/sticky-headers';
import { TableCssClassName as ClassName } from '../../types';
import { insertColumnButtonOffset } from '../common-styles';

const BUTTON_WIDTH = 20;

interface Props {
	children: React.ReactNode;
	mountTo: HTMLElement;
	offset: number;
	stickyHeader: RowStickyState;
	targetCellPosition: number;
	targetCellRef: HTMLElement;
	tableWrapper: HTMLElement;
	isContextualMenuOpen: boolean | undefined;
}

interface CalcLeftPosData {
	buttonWidth: number;
	cellRectLeft: number;
	cellRefWidth: number;
	offset: number;
}

export const calcLeftPos = ({
	buttonWidth,
	cellRectLeft,
	cellRefWidth,
	offset,
}: CalcLeftPosData) => {
	return cellRectLeft + cellRefWidth - buttonWidth - offset;
};

export const calcObserverTargetMargin = (
	tableWrapper: HTMLElement,
	fixedButtonRefCurrent: HTMLElement,
) => {
	const tableWrapperRect = tableWrapper.getBoundingClientRect();
	const fixedButtonRect = fixedButtonRefCurrent.getBoundingClientRect();
	const scrollLeft = tableWrapper.scrollLeft;
	return fixedButtonRect.left - tableWrapperRect.left + scrollLeft;
};

export const FixedButton = ({
	children,
	isContextualMenuOpen,
	mountTo,
	offset,
	stickyHeader,
	tableWrapper,
	targetCellPosition,
	targetCellRef,
}: Props) => {
	const fixedButtonRef = useRef<HTMLDivElement | null>(null);
	const observerTargetRef = useRef<HTMLDivElement | null>(null);

	// Using refs here rather than state to prevent heaps of renders on scroll
	const scrollDataRef = useRef(0);
	const leftPosDataRef = useRef(0);

	useEffect(() => {
		const observerTargetRefCurrent = observerTargetRef.current;
		const fixedButtonRefCurrent = fixedButtonRef.current;

		if (fixedButtonRefCurrent && observerTargetRefCurrent) {
			scrollDataRef.current = tableWrapper.scrollLeft;
			leftPosDataRef.current = 0;
			// Hide the button initially in case there's a flash of the button being
			// outside the table before the Intersection Observer fires
			fixedButtonRefCurrent.style.visibility = 'hidden';

			const margin = calcObserverTargetMargin(tableWrapper, fixedButtonRefCurrent);

			// Much more simple and predictable to add this margin to the observer target
			// rather than using it to calculate the rootMargin values
			observerTargetRefCurrent.style.marginLeft = `${margin}px`;

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							fixedButtonRefCurrent.style.visibility = 'visible';
						} else {
							fixedButtonRefCurrent.style.visibility = 'hidden';
						}
					});
				},
				{
					root: tableWrapper,
					rootMargin: `0px ${insertColumnButtonOffset}px 0px 0px`,
					threshold: 1,
				},
			);

			const handleScroll = rafSchedule((event) => {
				if (fixedButtonRef.current) {
					const delta = event.target.scrollLeft - scrollDataRef.current;
					const style = `translateX(${leftPosDataRef.current - delta}px)`;
					fixedButtonRef.current.style.transform = style;

					scrollDataRef.current = event.target.scrollLeft;
					leftPosDataRef.current = leftPosDataRef.current - delta;
				}
			});

			observer.observe(observerTargetRefCurrent);
			tableWrapper.addEventListener('scroll', handleScroll);

			return () => {
				tableWrapper.removeEventListener('scroll', handleScroll);
				fixedButtonRefCurrent.style.transform = '';
				observer.unobserve(observerTargetRefCurrent);
			};
		}
	}, [
		fixedButtonRef,
		observerTargetRef,
		tableWrapper,
		targetCellPosition,
		targetCellRef,
		isContextualMenuOpen,
	]);

	const fixedButtonTop = fg('platform_editor_breakout_use_css') ? 0 : stickyHeader.top;

	const containerLeft = useMemo(() => {
		if (!fg('platform_editor_breakout_use_css')) {
			return 0;
		}

		const container = targetCellRef.closest('[data-testid="ak-editor-fp-content-area"]');
		return container?.getBoundingClientRect().left || 0;
	}, [targetCellRef]);

	const left = useMemo(() => {
		const targetCellRect = targetCellRef.getBoundingClientRect();
		const baseLeft = calcLeftPos({
			buttonWidth: BUTTON_WIDTH,
			cellRectLeft: targetCellRect.left,
			cellRefWidth: targetCellRef.clientWidth,
			offset,
		});

		return baseLeft - containerLeft;
	}, [containerLeft, targetCellRef, offset]);

	// Using a portal here to ensure wrapperRef has the tableWrapper as an
	// ancestor. This is required to make the Intersection Observer work.
	return createPortal(
		// Using observerTargetRef here for our Intersection Observer. There is issues
		// getting the observer to work just using the fixedButtonRef, possible due
		// to using position fixed on this Element, or possibly due to its position
		// being changed on scroll.
		<div
			ref={observerTargetRef}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				position: 'absolute',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				top: token('space.0', '0px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				left: token('space.0', '0px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: token('space.250', '20px'), // BUTTON_WIDTH
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: token('space.250', '20px'), // BUTTON_WIDTH
			}}
		>
			<div
				ref={fixedButtonRef}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'fixed',
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					top: fixedButtonTop + stickyHeader.padding + offset * 2,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					zIndex: akEditorTableCellOnStickyHeaderZIndex,
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					left,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: token('space.250', '20px'), // BUTTON_WIDTH
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					height: token('space.250', '20px'), // BUTTON_WIDTH
				}}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={ClassName.CONTEXTUAL_MENU_BUTTON_FIXED}
			>
				{children}
			</div>
		</div>,
		mountTo,
	);
};

export default FixedButton;
