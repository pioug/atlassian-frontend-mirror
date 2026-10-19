import type { XpcActivationCoordinator } from './xpcActivationCoordinator';
import type { XpcDestinationResolution, XpcSource } from './xpcDestinationResolver';
import {
	type CompatibleXpis,
	type XpcCaptureMethod,
	XpcNavigationObservation,
	type XpcNavigationMechanism,
	type XpcNavigationReporter,
	type XpcSurface,
} from './xpcNavigationObservation';

export type XpcFinalSinkHandoff = {
	event?: Event;
	handoffOutcome: 'accepted' | 'unknown';
	url: string;
};

export type XpcFinalSinkDepartureCaptureOptions = {
	baseUrl: string;
	coordinator: XpcActivationCoordinator;
	isEnabled?: () => boolean;
	parseCompatibleXpis?: (encodedValue: string) => CompatibleXpis | null;
	reporter: XpcNavigationReporter;
	resolveDestination: (url: string) => XpcDestinationResolution;
	source: XpcSource;
	surface: XpcSurface;
};

export class XpcFinalSinkDepartureCapture {
	constructor(private readonly options: XpcFinalSinkDepartureCaptureOptions) {}

	observeRendererHandoff({ event, handoffOutcome, url }: XpcFinalSinkHandoff): void {
		this.observeHandoff({ event, handoffOutcome, url }, 'rendererFinalSink', 'rendererCallback');
	}

	observeImperativeHandoff(handoff: XpcFinalSinkHandoff): void {
		this.observeHandoff(handoff, 'imperativeFinalSink', 'imperativeApi');
	}

	observeRouterHandoff(handoff: XpcFinalSinkHandoff): void {
		this.observeHandoff(handoff, 'routerFinalSink', 'routerExternal');
	}

	private observeHandoff(
		{ event, handoffOutcome, url }: XpcFinalSinkHandoff,
		captureMethod: XpcCaptureMethod,
		navigationMechanism: XpcNavigationMechanism,
	): void {
		if (this.options.isEnabled?.() === false) {
			return;
		}

		const nativeToken = event ? this.options.coordinator.getNativeCandidate(event) : undefined;
		if (event && nativeToken) {
			this.options.coordinator.claimNativeCandidate(event);
		}
		const token = nativeToken ?? this.options.coordinator.beginOwnedHandoff();

		try {
			const destination = this.options.resolveDestination(url);
			const xpis = XpcNavigationObservation.inspectXpis({
				baseUrl: this.options.baseUrl,
				parseCompatibleValue: this.options.parseCompatibleXpis,
				url,
			});
			if (xpis.kind === 'unreadable') {
				this.options.coordinator.cancel(token);
				return;
			}

			const observation = XpcNavigationObservation.createDeparture({
				captureMethod,
				destination,
				handoffOutcome,
				navigationMechanism,
				source: this.options.source,
				surface: this.options.surface,
				xpis,
			});
			this.options.coordinator.completeOnce(token, () => {
				this.options.reporter.reportDeparture(observation);
			});
		} catch {
			this.options.coordinator.cancel(token);
		}
	}
}
