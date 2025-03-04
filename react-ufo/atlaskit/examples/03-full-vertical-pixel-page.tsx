/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React, { useLayoutEffect, useMemo, useState } from 'react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const PREFIX_TESTID = 'sectionVertical';

class SectionsVisibleEvent extends EventTarget {
	constructor() {
		super();
	}

	private emitSectionVisibleEvent(id: number) {
		this.dispatchEvent(new CustomEvent(`section-visible:${id}`));
	}

	sectionVisible(testid: string) {
		if (!testid.startsWith(PREFIX_TESTID)) {
			return;
		}

		const id = parseInt(testid.replace(/^\D+/g, ''), 10);
		this.emitSectionVisibleEvent(id);
	}

	onSectionVisible(id: number, cb: () => void) {
		this.addEventListener(`section-visible:${id}`, cb, {
			once: true,
			passive: true,
		});
	}
}
// Custom hook for visibility detection
const useVisibilityObserver = (emitter: SectionsVisibleEvent) => {
	useLayoutEffect(() => {
		const intersectionObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				const { target } = entry;

				if (!(target instanceof HTMLElement)) {
					continue;
				}
				const testId = target.dataset.testid;
				if (!testId) {
					continue;
				}
				emitter.sectionVisible(testId);
				intersectionObserver.unobserve(target);
			}
		});

		const observer = new MutationObserver((records) => {
			for (const record of records) {
				for (const target of record.addedNodes) {
					if (!(target instanceof HTMLElement)) {
						continue;
					}

					intersectionObserver.observe(target);
				}
			}
		});

		const divExamples = document.querySelector('#examples');
		if (divExamples) {
			observer.observe(divExamples, {
				childList: true,
				subtree: true,
			});
		}

		return () => {
			intersectionObserver.disconnect();

			observer.disconnect();
		};
	}, [emitter]);
};

// Custom hook for visibility delay
const useCounterToVisible = (
	base: number,
	widthViewport: number,
	sectionVerticalEmitter: SectionsVisibleEvent,
) => {
	const [visibleAt, setVisible] = useState<false | number>(false);

	useLayoutEffect(() => {
		// To speed up tests, if the base pixel is below 85% of the screen
		// We will render it as soon as possible
		const p85 = Math.ceil(widthViewport * 0.85);
		if (base <= p85) {
			setTimeout(() => {
				setVisible(performance.now());
			}, base);

			return;
		}

		// After half of the screen was rendered we need to slow down the rendering
		// We render the next section only after the previous one is painted
		const previousSectionId = base - 1;
		sectionVerticalEmitter.onSectionVisible(previousSectionId, () => {
			setVisible(performance.now());
		});
	}, [base, widthViewport, sectionVerticalEmitter]);

	return visibleAt;
};

// Generic Section Component
const Section = ({
	base,
	testId,
	widthViewport,
	sectionVerticalEmitter,
}: {
	base: number;
	testId: string;
	widthViewport: number;
	sectionVerticalEmitter: SectionsVisibleEvent;
}) => {
	const visibleAt = useCounterToVisible(base, widthViewport, sectionVerticalEmitter);

	if (!visibleAt) {
		return <UFOLoadHold name={testId}></UFOLoadHold>;
	}

	return (
		<div
			data-testid={testId}
			style={{
				backgroundColor: base % 2 === 0 ? 'black' : 'red',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '1px',
				height: '100%',
			}}
		></div>
	);
};

function getViewportWidth(document = window.document) {
	let documentWidth;
	try {
		documentWidth = document.documentElement.clientWidth || 0;
	} catch (e) {
		documentWidth = 0;
	}
	return Math.max(documentWidth, window.innerWidth || 0);
}

// Main App component
/*
 *
 * ⚠️ This example exist only to run with packages/react-ufo/atlaskit/__tests__/playwright/full-pixel.spec.ts
 *
 *	This React App example creates a series of vertical sections (1px wide bars) that fill the viewport width,
 *	rendering them progressively with a controlled timing mechanism. The sections alternate between black and red colors.
 *
 *
 *	Sections within 75% of viewport width render quickly, after that, there is hardcoded delay implemented.
 *
 *	The next section component needs to wait for the previous one to be printed before rendering itself
 */
export default function Example() {
	const widthViewport = useMemo(() => getViewportWidth(), []);
	const sectionNumbers = useMemo(() => {
		return Array.from({ length: widthViewport }, (_, i) => i + 1);
	}, [widthViewport]);
	const sectionVerticalEvent = useMemo(() => {
		return new SectionsVisibleEvent();
	}, []);
	useVisibilityObserver(sectionVerticalEvent);

	return (
		<UFOSegment name="app-root">
			<div
				data-testid="main"
				style={{
					display: 'flex',
					width: '100vw',
					height: '100vh',
				}}
			>
				{sectionNumbers.map((num) => (
					<Section
						key={num}
						base={num}
						widthViewport={widthViewport}
						sectionVerticalEmitter={sectionVerticalEvent}
						testId={`${PREFIX_TESTID}${num}`}
					/>
				))}
			</div>
		</UFOSegment>
	);
}
