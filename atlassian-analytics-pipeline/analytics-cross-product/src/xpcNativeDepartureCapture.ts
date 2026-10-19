import { XpcActivationCoordinator, type XpcActivationToken } from './xpcActivationCoordinator';
import type { XpcDestinationResolution, XpcSource } from './xpcDestinationResolver';
import {
	type CompatibleXpis,
	XpcNavigationObservation,
	type XpcNavigationReporter,
	type XpcSurface,
} from './xpcNavigationObservation';

type PendingNativeActivation = {
	anchor: HTMLAnchorElement;
	event: MouseEvent;
	token: XpcActivationToken;
};

export type XpcNativeDepartureCaptureOptions = {
	baseUrl: string;
	coordinator?: XpcActivationCoordinator;
	isEnabled?: () => boolean;
	parseCompatibleXpis?: (encodedValue: string) => CompatibleXpis | null;
	reporter: XpcNavigationReporter;
	resolveDestination: (url: string) => XpcDestinationResolution;
	root: Document;
	scheduleAfterDispatch?: (callback: () => void) => () => void;
	source: XpcSource;
	surface: XpcSurface;
};

const defaultScheduleAfterDispatch = (callback: () => void): (() => void) => {
	const timeout = setTimeout(callback, 0);
	return () => clearTimeout(timeout);
};

const findAnchor = (event: MouseEvent): HTMLAnchorElement | undefined => {
	for (const target of event.composedPath()) {
		if (target instanceof HTMLAnchorElement) {
			return target;
		}
	}

	return undefined;
};

const isQualifyingActivation = (event: MouseEvent, anchor: HTMLAnchorElement): boolean =>
	(event.button === 0 || event.button === 1) &&
	Boolean(anchor.href) &&
	!anchor.hasAttribute('download');

export class XpcNativeDepartureCapture {
	readonly coordinator: XpcActivationCoordinator;

	private readonly cancelScheduled = new Set<() => void>();
	private readonly pendingActivations = new Set<PendingNativeActivation>();
	private started = false;

	constructor(private readonly options: XpcNativeDepartureCaptureOptions) {
		this.coordinator = options.coordinator ?? new XpcActivationCoordinator();
	}

	start(): void {
		if (this.started || this.options.isEnabled?.() === false) {
			return;
		}

		this.started = true;
		this.options.root.addEventListener('click', this.onActivation, true);
		this.options.root.addEventListener('auxclick', this.onActivation, true);
		this.options.root.defaultView?.addEventListener('pagehide', this.flushPending);
	}

	stop(): void {
		if (!this.started) {
			return;
		}

		this.started = false;
		this.options.root.removeEventListener('click', this.onActivation, true);
		this.options.root.removeEventListener('auxclick', this.onActivation, true);
		this.options.root.defaultView?.removeEventListener('pagehide', this.flushPending);
		for (const cancel of this.cancelScheduled) {
			cancel();
		}
		this.cancelScheduled.clear();
		for (const activation of this.pendingActivations) {
			this.coordinator.cancel(activation.token);
		}
		this.pendingActivations.clear();
	}

	private readonly onActivation = (event: MouseEvent): void => {
		if (this.options.isEnabled?.() === false) {
			return;
		}

		const anchor = findAnchor(event);
		if (!anchor || !isQualifyingActivation(event, anchor)) {
			return;
		}

		const activation: PendingNativeActivation = {
			anchor,
			event,
			token: this.coordinator.beginNativeCandidate(event),
		};
		this.pendingActivations.add(activation);

		const schedule = this.options.scheduleAfterDispatch ?? defaultScheduleAfterDispatch;
		let cancel = (): void => {};
		cancel = schedule(() => {
			this.cancelScheduled.delete(cancel);
			this.finalize(activation);
		});
		if (this.pendingActivations.has(activation)) {
			this.cancelScheduled.add(cancel);
		}
	};

	private readonly flushPending = (): void => {
		for (const activation of [...this.pendingActivations]) {
			this.finalize(activation);
		}
	};

	private finalize(activation: PendingNativeActivation): void {
		if (!this.pendingActivations.delete(activation)) {
			return;
		}

		if (this.options.isEnabled?.() === false) {
			this.coordinator.cancel(activation.token);
			return;
		}

		if (!this.coordinator.isNativeFallbackPending(activation.token)) {
			return;
		}

		if (activation.event.defaultPrevented) {
			this.coordinator.cancel(activation.token);
			return;
		}

		try {
			const destination = this.options.resolveDestination(activation.anchor.href);
			const xpis = XpcNavigationObservation.inspectXpis({
				baseUrl: this.options.baseUrl,
				parseCompatibleValue: this.options.parseCompatibleXpis,
				url: activation.anchor.href,
			});
			if (xpis.kind === 'unreadable') {
				this.coordinator.cancel(activation.token);
				return;
			}

			const observation = XpcNavigationObservation.createDeparture({
				captureMethod: 'nativeDocument',
				destination,
				handoffOutcome: 'accepted',
				navigationMechanism: 'nativeAnchor',
				source: this.options.source,
				surface: this.options.surface,
				xpis,
			});
			this.coordinator.completeOnce(activation.token, () => {
				this.options.reporter.reportDeparture(observation);
			});
		} catch {
			this.coordinator.cancel(activation.token);
		}
	}
}
