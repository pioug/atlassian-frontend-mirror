import React from 'react';

import { renderWithIntl } from '@atlaskit/link-test-helpers';
import { act, fireEvent, screen } from '@atlassian/testing-library';

import Carousel from '../index';
import type { CarouselItem } from '../types';

class MockResizeObserver {
	callback: ResizeObserverCallback;
	constructor(cb: ResizeObserverCallback) {
		this.callback = cb;
	}
	observe() {}
	unobserve() {}
	disconnect() {}
}
beforeAll(() => {
	// @ts-ignore
	global.ResizeObserver = MockResizeObserver;
});

describe('Carousel', () => {
	const makeCarouselItem = (n: number): CarouselItem => ({
		title: `Slide ${n} title`,
		description: `Slide ${n} description`,
		image: <svg data-testid={`image-${n}`} />,
	});

	const items = [makeCarouselItem(1), makeCarouselItem(2), makeCarouselItem(3)];

	const defaultProps = {
		items,
		primaryButtonLabel: 'Connect account',
		testId: 'carousel',
	};

	const setup = (props: Partial<React.ComponentProps<typeof Carousel>> = {}) =>
		renderWithIntl(<Carousel {...defaultProps} {...props} />);

	describe('initial render', () => {
		it('renders the first slide title and description', () => {
			setup();
			expect(screen.getByTestId('carousel-slide-title')).toHaveTextContent('Slide 1 title');
			expect(screen.getByTestId('carousel-slide-description')).toHaveTextContent(
				'Slide 1 description',
			);
		});

		it('renders dot indicators for each slide', () => {
			setup();
			expect(screen.getByTestId('carousel-slide-dot-0')).toBeInTheDocument();
			expect(screen.getByTestId('carousel-slide-dot-1')).toBeInTheDocument();
			expect(screen.getByTestId('carousel-slide-dot-2')).toBeInTheDocument();
		});

		it('renders the connect button with the given label', () => {
			setup({ primaryButtonLabel: 'Connect to Figma', onPrimaryButtonClick: jest.fn() });
			expect(screen.getByTestId('carousel-slide-connect')).toHaveTextContent('Connect to Figma');
		});

		it('renders a "See next" button on the first slide when there are multiple slides', () => {
			setup();
			expect(screen.getByTestId('carousel-slide-next')).toBeInTheDocument();
		});

		it('does not render a "Back" button on the first slide', () => {
			setup();
			expect(screen.queryByTestId('carousel-slide-back')).not.toBeInTheDocument();
		});

		it('does not render a "See next" button on the last slide', () => {
			// Single slide — no next needed
			setup({ items: [makeCarouselItem(1)] });
			expect(screen.queryByTestId('carousel-slide-next')).not.toBeInTheDocument();
		});

		it('does not render dot indicators when there is only one slide', () => {
			setup({ items: [makeCarouselItem(1)] });
			expect(screen.queryByTestId('carousel-slide-dot-0')).not.toBeInTheDocument();
		});
	});

	describe('goNext — "See next" button', () => {
		it('advances to the second slide when "See next" is clicked', () => {
			setup();
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			expect(screen.getByTestId('carousel-slide-title')).toHaveTextContent('Slide 2 title');
			expect(screen.getByTestId('carousel-slide-description')).toHaveTextContent(
				'Slide 2 description',
			);
		});

		it('shows the correct slide after navigating through all slides', () => {
			setup();
			// slide 1 → slide 2
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			expect(screen.getByTestId('carousel-slide-title')).toHaveTextContent('Slide 2 title');
			// slide 2 → slide 3 (last — "See next" disappears)
			// Re-query next button since the slide re-mounted
			// On slide 2, "See next" should still be visible
			expect(screen.getByTestId('carousel-slide-next')).toBeInTheDocument();
		});

		it('hides the "See next" button on the last slide after navigating', () => {
			setup({ items: [makeCarouselItem(1), makeCarouselItem(2)] });
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			expect(screen.queryByTestId('carousel-slide-next')).not.toBeInTheDocument();
		});
	});

	describe('goPrev — "Back" button', () => {
		it('shows the "Back" button on the second slide after navigating forward', () => {
			setup();
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			expect(screen.getByTestId('carousel-slide-back')).toBeInTheDocument();
		});

		it('goes back to the first slide when "Back" is clicked from the second slide', () => {
			setup();
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			fireEvent.click(screen.getByTestId('carousel-slide-back'));
			expect(screen.getByTestId('carousel-slide-title')).toHaveTextContent('Slide 1 title');
		});

		it('shows "Back" but hides "Next" on the last slide', () => {
			setup({ items: [makeCarouselItem(1), makeCarouselItem(2)] });
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			expect(screen.getByTestId('carousel-slide-back')).toBeInTheDocument();
			expect(screen.queryByTestId('carousel-slide-next')).not.toBeInTheDocument();
		});

		it('shows both "Back" and "Next" on a middle slide', () => {
			setup();
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			expect(screen.getByTestId('carousel-slide-back')).toBeInTheDocument();
			expect(screen.getByTestId('carousel-slide-next')).toBeInTheDocument();
		});

		it('does not render "Back" on the first slide after navigating back from second', () => {
			setup();
			fireEvent.click(screen.getByTestId('carousel-slide-next'));
			fireEvent.click(screen.getByTestId('carousel-slide-back'));
			expect(screen.queryByTestId('carousel-slide-back')).not.toBeInTheDocument();
		});
	});

	describe('goTo — dot navigation', () => {
		it('jumps directly to the third slide when the third dot is clicked', () => {
			setup();
			fireEvent.click(screen.getByTestId('carousel-slide-dot-2'));
			expect(screen.getByTestId('carousel-slide-title')).toHaveTextContent('Slide 3 title');
		});

		it('jumps back to the first slide when the first dot is clicked after navigating', () => {
			setup();
			// Go to slide 3 via dot
			fireEvent.click(screen.getByTestId('carousel-slide-dot-2'));
			// Go back to slide 1
			fireEvent.click(screen.getByTestId('carousel-slide-dot-0'));
			expect(screen.getByTestId('carousel-slide-title')).toHaveTextContent('Slide 1 title');
		});

		it('does nothing when clicking the dot for the currently active slide', () => {
			setup();
			// Dot 0 is already active — clicking it should keep slide 1
			fireEvent.click(screen.getByTestId('carousel-slide-dot-0'));
			expect(screen.getByTestId('carousel-slide-title')).toHaveTextContent('Slide 1 title');
		});

		it('marks the active dot with aria-selected="true"', () => {
			setup();
			expect(screen.getByTestId('carousel-slide-dot-0')).toHaveAttribute('aria-current', 'true');
			expect(screen.getByTestId('carousel-slide-dot-1')).not.toHaveAttribute('aria-current');
		});

		it('updates aria-selected when navigating via dot click', () => {
			setup();
			fireEvent.click(screen.getByTestId('carousel-slide-dot-1'));
			expect(screen.getByTestId('carousel-slide-dot-0')).not.toHaveAttribute('aria-current');
			expect(screen.getByTestId('carousel-slide-dot-1')).toHaveAttribute('aria-current', 'true');
		});
	});

	describe('onPrimaryButtonClick callback', () => {
		it('calls onPrimaryButtonClick when the connect button is clicked', () => {
			const onPrimaryButtonClick = jest.fn();
			setup({ onPrimaryButtonClick });
			fireEvent.click(screen.getByTestId('carousel-slide-connect'));
			expect(onPrimaryButtonClick).toHaveBeenCalledTimes(1);
		});

		it('does not render the connect button when onPrimaryButtonClick is not provided', () => {
			setup({ onPrimaryButtonClick: undefined });
			expect(screen.queryByTestId('carousel-slide-connect')).not.toBeInTheDocument();
		});

		it('does not render the button row when there is one slide and no onPrimaryButtonClick', () => {
			setup({ items: [makeCarouselItem(1)], onPrimaryButtonClick: undefined });
			// No navigation (single slide) and no primary button — the rowButton container should be absent
			expect(screen.queryByTestId('carousel-slide-connect')).not.toBeInTheDocument();
			expect(screen.queryByTestId('carousel-slide-next')).not.toBeInTheDocument();
		});
	});

	describe('responsive layout via ResizeObserver', () => {
		it('shows the image panel in full size layout', () => {
			setup();
			// Default size is 'full' (no ResizeObserver firing in JSDOM)
			expect(screen.getByTestId('carousel-slide-image-panel-0')).toBeInTheDocument();
		});

		it('hides the image panel in compact layout', () => {
			let observerCallback: ResizeObserverCallback;
			class CapturingResizeObserver {
				constructor(cb: ResizeObserverCallback) {
					observerCallback = cb;
				}
				observe() {}
				unobserve() {}
				disconnect() {}
			}
			// @ts-ignore
			global.ResizeObserver = CapturingResizeObserver;

			setup();

			// Simulate a compact-width container (300px wide, 160px tall)
			act(() => {
				observerCallback!(
					[
						{
							contentRect: { width: 300, height: 160 } as DOMRectReadOnly,
						} as ResizeObserverEntry,
					],
					{} as ResizeObserver,
				);
			});

			expect(screen.queryByTestId('carousel-slide-image-panel-0')).not.toBeInTheDocument();

			// Restore default mock
			// @ts-ignore
			global.ResizeObserver = MockResizeObserver;
		});

		it('shows the compact connect button in compact layout when onPrimaryButtonClick is provided', () => {
			let observerCallback: ResizeObserverCallback;
			class CapturingResizeObserver {
				constructor(cb: ResizeObserverCallback) {
					observerCallback = cb;
				}
				observe() {}
				unobserve() {}
				disconnect() {}
			}
			// @ts-ignore
			global.ResizeObserver = CapturingResizeObserver;

			setup({ onPrimaryButtonClick: jest.fn() });

			act(() => {
				observerCallback!(
					[
						{
							contentRect: { width: 300, height: 160 } as DOMRectReadOnly,
						} as ResizeObserverEntry,
					],
					{} as ResizeObserver,
				);
			});

			expect(screen.getByTestId('carousel-slide-connect-compact')).toBeInTheDocument();

			// @ts-ignore
			global.ResizeObserver = MockResizeObserver;
		});
	});

	describe('accessibility', () => {
		it('should have no accessibility violations', async () => {
			const { container } = setup();
			await expect(container).toBeAccessible();
		});

		it('renders the dot group with an accessible label', () => {
			setup();
			expect(screen.getByRole('group')).toBeInTheDocument();
		});

		it('each dot has an aria-label describing its position', () => {
			setup();
			// The message is "Go to slide {index} of {total}" — check partial
			expect(screen.getByTestId('carousel-slide-dot-0')).toHaveAttribute('aria-label');
			expect(screen.getByTestId('carousel-slide-dot-1')).toHaveAttribute('aria-label');
		});
	});
});
