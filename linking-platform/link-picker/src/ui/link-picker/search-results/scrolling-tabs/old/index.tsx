/* eslint-disable @atlassian/tangerine/import/no-parent-imports */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { IconButton, type IconButtonProps } from '@atlaskit/button/new';
import ChevronLeftIcon from '@atlaskit/icon/utility/migration/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/utility/migration/chevron-right';

import {
	calculateConditionalButtons,
	type ConditionalButtons,
	createGhost,
	getTabList,
	scrollBack,
	scrollForward,
} from '../scrolling-tabs';

import {
	backButtonStyles,
	containerStyles,
	nextButtonStyles,
	scrollingContainerStyles,
} from './styles';

function isTouchDevice() {
	return (
		'ontouchstart' in window ||
		// eslint-disable-next-line compat/compat
		navigator.maxTouchPoints > 0
	);
}

interface ScrollingTabListProps {
	children: JSX.Element;
}

const initialConditionalButtonsState: ConditionalButtons = {
	back: false,
	forward: false,
};

/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
export const ScrollingTabListOld = (props: ScrollingTabListProps) => {
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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={containerStyles} ref={ref} data-testid="scrolling-tabs">
			{conditionalButtons.back && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div className="back" css={backButtonStyles}>
					<IconButton
						data-test-id="back"
						onClick={() => scrollBack(ref)}
						label="back"
						icon={ChevronLeftIcon}
						{...buttonProps}
					/>
				</div>
			)}
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div css={scrollingContainerStyles}>{props.children}</div>
			{conditionalButtons.forward && (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={nextButtonStyles}>
					<IconButton
						data-test-id="forward"
						onClick={() => scrollForward(ref)}
						{...buttonProps}
						label="forward"
						icon={ChevronRightIcon}
					/>
				</div>
			)}
		</div>
	);
};
