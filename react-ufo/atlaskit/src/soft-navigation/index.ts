import { BufferWithMaxLength } from '../additional-payload/utils/lighthouse-metrics/utils/buffer';

// Entry shapes from the Soft Navigations API (https://github.com/WICG/soft-navigations),
// which TypeScript's DOM lib doesn't include yet.
interface InteractionContentfulPaintEntry extends PerformanceEntry {
	readonly interactionId: number;
	readonly largestContentfulPaint?: {
		readonly renderTime: number;
		readonly loadTime: number;
	};
}

interface SoftNavigationEntry extends PerformanceEntry {
	readonly interactionId: number;
	readonly paintTime?: number;
	readonly presentationTime?: number;
	readonly getLargestInteractionContentfulPaint?: () => InteractionContentfulPaintEntry | null;
}

type SoftNavigation = {
	interactionId: number;
	startTime: number;
	firstContentfulPaint?: number;
	largestContentfulPaint?: number;
};

export type SoftNavigationPaintMetrics = {
	fcp?: number;
	lcp?: number;
};

const MAX_TRACKED_SOFT_NAVIGATIONS = 20;

// A soft navigation's startTime is the interaction that triggered it, so it comes slightly before
// the UFO transition starts. Ignore soft navigations that started too long before the transition,
// as they most likely belong to an earlier navigation.
const MAX_SOFT_NAVIGATION_LEAD_TIME = 1000;

// Only plain timestamps are kept, so long-lived sessions don't retain the painted DOM elements.
const softNavigations = new BufferWithMaxLength<SoftNavigation>(MAX_TRACKED_SOFT_NAVIGATIONS);

let observer: PerformanceObserver | null = null;

// Same check as web-vitals' checkSoftNavsEnabled (src/lib/softNavs.ts).
function isSoftNavigationSupported(): boolean {
	return (
		(globalThis.PerformanceObserver?.supportedEntryTypes?.includes('soft-navigation') ?? false) &&
		// Older implementations expose the value as an attribute rather than the method. Only the
		// method shipped to stable.
		typeof (globalThis as { PerformanceSoftNavigation?: { prototype?: SoftNavigationEntry } })
			.PerformanceSoftNavigation?.prototype?.getLargestInteractionContentfulPaint === 'function'
	);
}

// Each contentful paint is larger than the one before, so the latest one is the LCP.
function setLargestContentfulPaint(
	softNavigation: SoftNavigation | undefined,
	entry: InteractionContentfulPaintEntry | null | undefined,
) {
	const paint = entry?.largestContentfulPaint;
	// `||` rather than `??` on purpose: renderTime is 0 when the browser withholds it (e.g. cross-origin
	// images without Timing-Allow-Origin), and no real paint here can happen at time 0.
	const paintTime = paint?.renderTime || paint?.loadTime;
	if (softNavigation !== undefined && paintTime) {
		softNavigation.largestContentfulPaint = paintTime;
	}
}

function handleEntries(entries: PerformanceEntryList) {
	entries.forEach((entry) => {
		if (entry.entryType === 'soft-navigation') {
			const softNavigationEntry = entry as SoftNavigationEntry;
			const softNavigation: SoftNavigation = {
				interactionId: softNavigationEntry.interactionId,
				startTime: softNavigationEntry.startTime,
				// presentationTime is null where unsupported, and a paint after an interaction can't be at 0.
				firstContentfulPaint:
					softNavigationEntry.presentationTime || softNavigationEntry.paintTime || undefined,
			};
			softNavigations.push(softNavigation);
			// Paints for this interaction that happened before the soft navigation was detected.
			setLargestContentfulPaint(
				softNavigation,
				softNavigationEntry.getLargestInteractionContentfulPaint?.(),
			);
		} else if (entry.entryType === 'interaction-contentful-paint') {
			// These are emitted for any interaction that paints, not only soft navigations, so only keep
			// the ones for a tracked soft navigation.
			const contentfulPaint = entry as InteractionContentfulPaintEntry;
			setLargestContentfulPaint(
				softNavigations
					.getAll()
					.find((softNavigation) => softNavigation.interactionId === contentfulPaint.interactionId),
				contentfulPaint,
			);
		}
	});
}

function findSoftNavigation(start: number): SoftNavigation | undefined {
	return softNavigations.getAll().reduce<SoftNavigation | undefined>((match, softNavigation) => {
		if (
			softNavigation.startTime <= start &&
			softNavigation.startTime >= start - MAX_SOFT_NAVIGATION_LEAD_TIME &&
			(match === undefined || match.startTime < softNavigation.startTime)
		) {
			return softNavigation;
		}
		return match;
	}, undefined);
}

export function ensureSoftNavigationObserved(): void {
	if (observer !== null || !isSoftNavigationSupported()) {
		return;
	}

	try {
		observer = new PerformanceObserver((list) => handleEntries(list.getEntries()));
		observer.observe({ type: 'soft-navigation', buffered: true });
		if (PerformanceObserver.supportedEntryTypes.includes('interaction-contentful-paint')) {
			observer.observe({ type: 'interaction-contentful-paint', buffered: true });
		}
	} catch {
		// A later observe() can throw after an earlier one succeeded, so stop the half-started observer
		// rather than leaving it filling the buffers while the next call starts another one.
		observer?.disconnect();
		observer = null;
	}
}

/**
 * Returns FCP and LCP for the soft navigation behind a transition, relative to the transition's
 * start so they line up with the other transition metrics. LCP is the largest paint so far, as
 * web-vitals reports it, so it isn't cut off at the transition end. Metrics with no value are
 * omitted.
 */
export function getSoftNavigationPaintMetrics(start: number): SoftNavigationPaintMetrics {
	// UFO init runs before jira-spa installs its platform flag resolver, so fg() there skips Jira's
	// overrides (e.g. ?fg=) and can read the un-overridden value. Soft navigations only happen once
	// the page has loaded, and buffered entries replay the ones from before the observer started.
	ensureSoftNavigationObserved();
	if (observer === null) {
		return {};
	}
	handleEntries(observer.takeRecords());

	const softNavigation = findSoftNavigation(start);
	if (softNavigation === undefined) {
		return {};
	}

	const metrics: SoftNavigationPaintMetrics = {};
	if (softNavigation.firstContentfulPaint) {
		metrics.fcp = Math.round(Math.max(softNavigation.firstContentfulPaint - start, 0));
	}

	if (softNavigation.largestContentfulPaint) {
		metrics.lcp = Math.round(Math.max(softNavigation.largestContentfulPaint - start, 0));
	}

	return metrics;
}
