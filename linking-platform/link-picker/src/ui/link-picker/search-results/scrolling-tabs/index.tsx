/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { IconButton, type IconButtonProps } from '@atlaskit/button/new';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { N0, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
	calculateConditionalButtons,
	type ConditionalButtons,
	createGhost,
	getTabList,
	scrollBack,
	scrollForward,
} from './scrolling-tabs';

function isTouchDevice() {
	return (
		'ontouchstart' in window ||
		// eslint-disable-next-line compat/compat
		navigator.maxTouchPoints > 0
	);
}

type ScrollingTabListProps = {
	children: JSX.Element;
};

const initialConditionalButtonsState: ConditionalButtons = {
	back: false,
	forward: false,
};

const scrollingContainerStyles = css({
	overflowX: 'auto',
	scrollBehavior: 'smooth',
	scrollPadding: '0 24px',
	scrollbarWidth: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-webkit-scrollbar': {
		display: 'none',
	},
	'&::before': {
		content: '""',
		borderRadius: token('radius.xsmall'),
		bottom: 0,
		margin: 0,
		position: 'absolute',
		width: 'inherit',
		left: token('space.100', '8px'),
		right: token('space.100', '8px'),
		height: 2,
		backgroundColor: token('color.border', N30),
	},
});

const containerStyles = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[role="tablist"]': {
		'&::before': {
			display: 'none',
		},
	},
	// Overrides Atlaskit tabs styles to stop overflowing with ellipsis
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[role="tab"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		overflow: 'unset !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		textOverflow: 'unset !important',
	},
});

const backButtonStyles = css({
	position: 'absolute',
	top: token('space.050', '4px'),
	zIndex: 999,
	backgroundColor: token('elevation.surface', N0),
	left: 0,
});

const nextButtonStyles = css({
	position: 'absolute',
	top: token('space.050', '4px'),
	zIndex: 999,
	backgroundColor: token('elevation.surface', N0),
	right: 0,
});

/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
export const ScrollingTabList = (props: ScrollingTabListProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);
	const [conditionalButtons, setConditionalButtons] = useState<ConditionalButtons>(
		initialConditionalButtonsState,
	);
	const ghost = useMemo(() => createGhost(), []);

	const onTabClick = useCallback((e: Event) => {
		const target = e.currentTarget as Element;
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center',
			});
		}
	}, []);

	React.useLayoutEffect(() => {
		const container = ref.current;

		let scrollingContainer: HTMLElement | null | undefined;
		let tabs: Element[];

		const handleConditionalButtonsChange = () => {
			const buttons = calculateConditionalButtons(scrollingContainer, isTouchDevice());

			setConditionalButtons(buttons);
		};

		const observerCallback: MutationCallback = (mutationList) => {
			const tablist = getTabList(ref);

			for (const mutation of mutationList) {
				if (mutation.type === 'childList') {
					const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[];
					const found = addedNodes.find((node) => node.getAttribute('role') === 'tab');

					if (found && tablist) {
						ghost.remove();
						const tabs = Array.from(tablist.children);
						tabs.forEach((tab) => {
							tab.removeEventListener('click', onTabClick);
							tab.addEventListener('click', onTabClick);
						});
						tablist.appendChild(ghost);
						handleConditionalButtonsChange();
					}
				}
			}
		};

		const observer = new MutationObserver(observerCallback);

		if (container) {
			const tablist = getTabList(ref);
			scrollingContainer = tablist?.parentElement;

			observer.observe(container, {
				attributes: false,
				childList: true,
				subtree: true,
			});

			if (scrollingContainer instanceof HTMLElement && tablist) {
				tablist.appendChild(ghost);
				tabs = Array.from(tablist.children);

				tabs.forEach((tab) => tab.addEventListener('click', onTabClick));

				handleConditionalButtonsChange();

				scrollingContainer.addEventListener('scroll', handleConditionalButtonsChange);
			}

			return () => {
				if (scrollingContainer) {
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					scrollingContainer.removeEventListener('scroll', handleConditionalButtonsChange);
				}
				if (tabs.length) {
					tabs.forEach((tab) => tab.removeEventListener('click', onTabClick));
				}
			};
		}
	}, [onTabClick, ghost, ref]);

	const buttonProps: Partial<IconButtonProps> = {
		appearance: 'subtle',
		spacing: 'compact',
	};

	return (
		<div css={containerStyles} ref={ref} data-testid="scrolling-tabs">
			{conditionalButtons.back && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				<div className="back" css={backButtonStyles}>
					<IconButton
						data-test-id="back"
						onClick={() => scrollBack(ref)}
						label="back"
						icon={(iconProps) => <ChevronLeftIcon {...iconProps} size="small" />}
						{...buttonProps}
					/>
				</div>
			)}
			<div css={scrollingContainerStyles}>{props.children}</div>
			{conditionalButtons.forward && (
				<div css={nextButtonStyles}>
					<IconButton
						data-test-id="forward"
						onClick={() => scrollForward(ref)}
						{...buttonProps}
						label="forward"
						icon={(iconProps) => <ChevronRightIcon {...iconProps} size="small" />}
					/>
				</div>
			)}
		</div>
	);
};
