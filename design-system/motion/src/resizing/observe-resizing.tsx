import type { ResizingOpts } from './use-resizing';

interface Dimensions {
	width: number;
	height: number;
}

export interface ResizingObserver {
	suppress: () => void;
	disconnect: () => void;
}

function resolveToken(value: string, computed: CSSStyleDeclaration): string {
	// Web Animations timing options need resolved values rather than CSS var() references.
	if (!value.startsWith('var(')) {
		return value;
	}
	const contents = value.slice(4, -1);
	const comma = contents.indexOf(',');
	const property = comma === -1 ? contents : contents.slice(0, comma);
	return (
		computed.getPropertyValue(property.trim()).trim() ||
		resolveToken(comma === -1 ? '' : contents.slice(comma + 1).trim(), computed)
	);
}

/**
 * Observe natural sizes and let the browser own the animation timeline. A mutation
 * temporarily detaches the effect so the next observation sees the natural size.
 * If that size is unchanged, reattach the same effect without restarting its clock.
 * This keeps content mounted and preserves CSS constraints and text truncation.
 */
export function observeResizing(
	element: HTMLElement,
	getOptions: () => ResizingOpts & { shouldAnimate: boolean },
): ResizingObserver {
	// The last observed size: natural when idle, or displayed while an animation is attached.
	// Keep the destination separately so an interruption can start from the displayed size.
	let current: Dimensions | undefined;
	let running:
		| { animation: Animation; effect: KeyframeEffect; destination: Dimensions }
		| undefined;
	let skipNext = false;
	let disconnected = false;
	let vertical = false;

	const stop = () => {
		if (running) {
			running.animation.onfinish = null;
			running.animation.cancel();
			running = undefined;
		}
	};
	const reobserve = () => {
		// Request an entry even when the natural size matches the last displayed frame.
		resizeObserver.unobserve(element);
		resizeObserver.observe(element, { box: 'border-box' });
	};
	const resizeObserver = new ResizeObserver((entries) => {
		if (disconnected) {
			return;
		}
		const entry = entries.find((entry) => entry.target === element);
		if (!entry) {
			return;
		}
		const computed = running?.effect.target ? undefined : getComputedStyle(element);
		if (computed) {
			vertical =
				computed.writingMode.startsWith('vertical') || computed.writingMode.startsWith('sideways');
		}
		const box = entry.borderBoxSize[0];
		// Observer sizes use logical axes; animation keyframes use physical width and height.
		const next = {
			width: vertical ? box.blockSize : box.inlineSize,
			height: vertical ? box.inlineSize : box.blockSize,
		};
		if (running?.effect.target) {
			// Our own width/height animation also triggers observations. Cache its displayed size
			// for interruptions, but do not mistake each animation frame for a new destination.
			current = next;
			return;
		}
		const { dimension, duration, easing, shouldAnimate, onStartMotion, onFinishMotion } =
			getOptions();
		const changed = (before: Dimensions) =>
			(dimension !== 'height' && before.width !== next.width) ||
			(dimension !== 'width' && before.height !== next.height);
		if (running && shouldAnimate && !skipNext && !changed(running.destination)) {
			// ARIA, color and other mutations can leave layout unchanged. The browser
			// keeps advancing this animation while its effect is detached.
			running.effect.target = element;
			return;
		}
		const previous = current;
		stop();
		current = next;
		const suppressed = skipNext || !shouldAnimate;
		skipNext = false;
		if (!previous) {
			// The first observation establishes a baseline; mounting alone should not animate.
			return;
		}
		if (suppressed || !changed(previous) || !computed || typeof element.animate !== 'function') {
			onFinishMotion?.();
			return;
		}
		const durationValue = resolveToken(duration, computed);
		const parsed = parseFloat(durationValue);
		const durationMs = parsed * (durationValue.endsWith('ms') ? 1 : 1000);
		if (!Number.isFinite(durationMs) || durationMs <= 0) {
			onFinishMotion?.();
			return;
		}
		onStartMotion?.();
		const frame = (size: Dimensions): Keyframe => ({
			boxSizing: 'border-box',
			...(dimension !== 'height' && { width: `${size.width}px` }),
			...(dimension !== 'width' && { height: `${size.height}px` }),
		});
		const animation = element.animate([frame(previous), frame(next)], {
			duration: durationMs,
			easing: resolveToken(easing, computed) || 'ease',
		});
		running = { animation, effect: animation.effect as KeyframeEffect, destination: next };
		current = previous;
		animation.onfinish = () => {
			current = next;
			// Remove the animation effect so normal CSS sizing controls the element again.
			stop();
			getOptions().onFinishMotion?.();
		};
	});

	const mutations = new MutationObserver(() => {
		if (running?.effect.target) {
			// Animated dimensions can hide a content change's natural size. Temporarily release
			// them so ResizeObserver can report the new destination without a synchronous read.
			// Detaching changes no inline styles and does not cancel or pause the timeline.
			// The observer reattaches it before paint, or replaces it if the size changed.
			running.effect.target = null;
			reobserve();
		}
	});
	mutations.observe(element, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
	});
	if (element.parentElement) {
		mutations.observe(element.parentElement, { attributes: true });
	}
	resizeObserver.observe(element, { box: 'border-box' });
	return {
		suppress: () => {
			// Accept the next natural size without animating back from the interrupted frame.
			skipNext = true;
			stop();
			reobserve();
		},
		disconnect: () => {
			disconnected = true;
			mutations.disconnect();
			resizeObserver.disconnect();
			stop();
		},
	};
}
