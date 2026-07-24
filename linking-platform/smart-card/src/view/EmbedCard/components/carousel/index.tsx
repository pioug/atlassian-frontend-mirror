/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { jsx, keyframes } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import CarouselSlide from './CarouselSlide';
import type { CarouselSize, CarouselItem } from './types';

const styles = cssMap({
	carousel: {
		display: 'flex',
		width: '100%',
		height: '100%',
		position: 'relative',
		overflow: 'hidden',
	},
});

const fadeIn = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
});

const slideWrapperMap = cssMap({
	static: {
		width: '100%',
		height: '100%',
	},
	animated: {
		width: '100%',
		height: '100%',
		animationName: fadeIn,
		animationDuration: '280ms',
		animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		animationFillMode: 'both',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
			animationDuration: '0.01ms',
		},
	},
});

type CarouselProps = {
	/** Provider icon element or URL — passed through to each slide */
	icon?: React.ReactNode | string;
	/** Alt for the icon, e.g. "Figma" */
	iconLabel?: string;
	/** Initial slide index — only used in VR tests via magnetic-di injection */
	initialSlideIndex?: number;
	/** Ordered list of teaser slides */
	items: CarouselItem[];
	/** Called when the user clicks the primary button */
	onPrimaryButtonClick?: () => void;
	/** Text for the auth button, e.g. "Connect to Figma" */
	primaryButtonLabel: string;
	/** testId prefix */
	testId?: string;
};

/**
 * Derives layout size bucket from pixel dimensions.
 * Used instead of CSS @container queries (which are blocked by the linter)
 * to control which elements are shown at different card sizes.
 */
const getSize = (width: number, height: number): CarouselSize => {
	if (width < 200 || height < 100) {
		return 'minimal';
	}
	if (width < 400 || height < 140) {
		return 'compact';
	}
	return 'full';
};

const Carousel = ({
	icon,
	iconLabel,
	initialSlideIndex = 0,
	items,
	onPrimaryButtonClick,
	primaryButtonLabel,
	testId = 'embed-card-teaser-carousel',
}: CarouselProps): React.JSX.Element => {
	const [activeIndex, setActiveIndex] = useState(initialSlideIndex);
	const [size, setSize] = useState<CarouselSize>('full');

	// Tracks whether the user has navigated at least once.
	// The first slide is rendered statically (no animation) to avoid any
	// CSS animation running during SSR or on the initial paint.
	const hasNavigated = useRef(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Observe the carousel container's size and update the layout bucket.
	useEffect(() => {
		const el = containerRef.current;
		if (!el) {
			return;
		}
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setSize(getSize(width, height));
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const goNext = useCallback(() => {
		hasNavigated.current = true;
		setActiveIndex((current) => (current + 1) % items.length);
	}, [items.length]);

	const goPrev = useCallback(() => {
		hasNavigated.current = true;
		setActiveIndex((current) => Math.max(0, current - 1));
	}, []);

	const goTo = useCallback(
		(index: number) => {
			if (index === activeIndex) {
				return;
			}
			hasNavigated.current = true;
			setActiveIndex(index);
		},
		[activeIndex],
	);

	const currentSlide = items[activeIndex];
	const isFirstSlide = activeIndex === 0;
	const isLastSlide = activeIndex === items.length - 1;

	return (
		<Box ref={containerRef} xcss={styles.carousel} testId={testId}>
			<Box
				key={activeIndex}
				xcss={slideWrapperMap[hasNavigated.current ? 'animated' : 'static']}
				aria-live="polite"
			>
				<CarouselSlide
					primaryButtonLabel={primaryButtonLabel}
					description={currentSlide.description}
					icon={icon}
					iconLabel={iconLabel}
					image={currentSlide.image}
					title={currentSlide.title}
					onPrimaryButtonClick={onPrimaryButtonClick}
					onBackClick={!isFirstSlide ? goPrev : undefined}
					onDotClick={goTo}
					onNextClick={!isLastSlide ? goNext : undefined}
					size={size}
					slideIndex={activeIndex}
					testId={`${testId}-slide`}
					totalSlides={items.length}
				/>
			</Box>
		</Box>
	);
};

export default Carousel;
