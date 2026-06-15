import { computeFallbackPosition } from '../../src/internal/anchor-positioning-fallback';
import { getPlacement } from '../../src/internal/resolve-placement';

// Tests use the default 8px gap (matches `space.100`) when not overridden.
const DEFAULT_GAP_PX = 8;
const ZERO_CROSS_AXIS_SHIFT = { value: 0, direction: 'forwards' as const };

describe('anchor positioning fallback', () => {
	const createMockPopoverElement = (width: number, height: number): HTMLElement => {
		const element = document.createElement('div');
		Object.defineProperty(element, 'offsetWidth', { value: width, configurable: true });
		Object.defineProperty(element, 'offsetHeight', { value: height, configurable: true });
		return element;
	};

	const createTriggerRect = ({
		top = 100,
		left = 100,
		width = 50,
		height = 50,
	}: {
		top?: number;
		left?: number;
		width?: number;
		height?: number;
	} = {}): DOMRect => {
		return {
			top,
			left,
			right: left + width,
			bottom: top + height,
			width,
			height,
			x: left,
			y: top,
			toJSON: () => ({}),
		};
	};

	const viewport = { width: 400, height: 400 };

	describe('block-axis placement (above/below)', () => {
		it('positions below trigger with the default gap and center align', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'center' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.top).toBe(triggerRect.bottom + DEFAULT_GAP_PX);
			expect(position.left).toBe(triggerRect.left + triggerRect.width / 2 - 40 / 2);
		});

		it('snaps left edge to trigger left when align is start', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'start' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.top).toBe(triggerRect.bottom + DEFAULT_GAP_PX);
			expect(position.left).toBe(triggerRect.left);
		});

		it('snaps right edge to trigger right when align is end', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'end' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.top).toBe(triggerRect.bottom + DEFAULT_GAP_PX);
			expect(position.left).toBe(triggerRect.right - 40);
		});

		it('positions above trigger with the default gap when edge is start', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'start', align: 'center' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.top).toBe(triggerRect.top - 30 - DEFAULT_GAP_PX);
		});
	});

	describe('inline-axis placement (left/right)', () => {
		it('positions right of trigger with the default gap and center align', () => {
			const placement = getPlacement({
				placement: { axis: 'inline', edge: 'end', align: 'center' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.left).toBe(triggerRect.right + DEFAULT_GAP_PX);
			expect(position.top).toBe(triggerRect.top + triggerRect.height / 2 - 30 / 2);
		});

		it('snaps top edge to trigger top when align is start', () => {
			const placement = getPlacement({
				placement: { axis: 'inline', edge: 'end', align: 'start' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.left).toBe(triggerRect.right + DEFAULT_GAP_PX);
			expect(position.top).toBe(triggerRect.top);
		});

		it('snaps bottom edge to trigger bottom when align is end', () => {
			const placement = getPlacement({
				placement: { axis: 'inline', edge: 'end', align: 'end' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.left).toBe(triggerRect.right + DEFAULT_GAP_PX);
			expect(position.top).toBe(triggerRect.bottom - 30);
		});

		it('positions left of trigger with the default gap when edge is start', () => {
			const placement = getPlacement({
				placement: { axis: 'inline', edge: 'start', align: 'center' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.left).toBe(triggerRect.left - 40 - DEFAULT_GAP_PX);
		});
	});

	describe('viewport flipping', () => {
		it('flips above when there is no room below', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'center' },
			});
			const triggerRect = createTriggerRect({ top: 380, height: 20 });
			const popoverEl = createMockPopoverElement(40, 100);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.top).toBe(triggerRect.top - 100 - DEFAULT_GAP_PX);
		});

		it('flips left when there is no room right', () => {
			const placement = getPlacement({
				placement: { axis: 'inline', edge: 'end', align: 'center' },
			});
			const triggerRect = createTriggerRect({ left: 380, width: 20 });
			const popoverEl = createMockPopoverElement(100, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.left).toBe(triggerRect.left - 100 - DEFAULT_GAP_PX);
		});
	});

	describe('viewport clamping', () => {
		it('clamps top to 0 when popover would go above viewport', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'start', align: 'center' },
			});
			const triggerRect = createTriggerRect({ top: 0, height: 50 });
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.top).toBeGreaterThanOrEqual(0);
		});

		it('clamps left to 0 when popover would go left of viewport', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'start' },
			});
			const triggerRect = createTriggerRect({ left: 0, width: 20 });
			const popoverEl = createMockPopoverElement(100, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.left).toBeGreaterThanOrEqual(0);
		});
	});

	describe('consumer-supplied gap', () => {
		it('uses the provided gap value along the main axis', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'center' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: 20,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.top).toBe(triggerRect.bottom + 20);
		});

		it('uses zero gap when explicitly set', () => {
			const placement = getPlacement({
				placement: { axis: 'inline', edge: 'end', align: 'center' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: 0,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});

			expect(position.left).toBe(triggerRect.right);
		});
	});

	describe('consumer-supplied shift', () => {
		// Block-axis placement → shift moves left/right.
		it('shifts inline-end (positive left) for block axis with align start + forwards', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'start' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: { value: 10, direction: 'forwards' },
			});

			expect(position.left).toBe(triggerRect.left + 10);
		});

		it('inverts shift sign when align is end', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'end' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: { value: 10, direction: 'forwards' },
			});

			// align: 'end' → forwards pushes the popover toward start (negative).
			expect(position.left).toBe(triggerRect.right - 40 - 10);
		});

		it('inverts shift sign when direction is backwards', () => {
			const placement = getPlacement({
				placement: { axis: 'block', edge: 'end', align: 'start' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const position = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: { value: 10, direction: 'backwards' },
			});

			expect(position.left).toBe(triggerRect.left - 10);
		});

		// Inline-axis placement → shift moves up/down.
		it('shifts top for inline axis', () => {
			const placement = getPlacement({
				placement: { axis: 'inline', edge: 'end', align: 'center' },
			});
			const triggerRect = createTriggerRect();
			const popoverEl = createMockPopoverElement(40, 30);

			const baseline = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: ZERO_CROSS_AXIS_SHIFT,
			});
			const shifted = computeFallbackPosition({
				triggerRect,
				popoverEl,
				placement,
				viewport,
				gap: DEFAULT_GAP_PX,
				crossAxisShift: { value: 12, direction: 'forwards' },
			});

			expect(shifted.top).toBe(baseline.top + 12);
			expect(shifted.left).toBe(baseline.left);
		});
	});
});
