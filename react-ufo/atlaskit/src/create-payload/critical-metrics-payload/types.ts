import type { InteractionType } from '../../common';
import { type NavigationMetrics } from '../utils/get-navigation-metrics';

export interface CriticalMetricsPayloadProperties {
	// Basic metadata
	'event:hostname': string;
	'event:product': string;
	'event:schema': string;
	'event:region': string;
	'event:source': {
		name: string;
		version: string;
	};
	'experience:key': string;
	'experience:name': string;

	// Browser metadata (nested structure for efficiency)
	browser?: {
		name: string;
		version: string;
	};
	device?: {
		cpus?: number;
		memory?: number;
	};
	network?: {
		effectiveType: string;
		rtt: number;
		downlink: number;
	};
	time: {
		localHour: number;
		localDayOfWeek: number;
		localTimezoneOffset: number;
	};

	metrics: {
		/**
		 * First Paint
		 */
		fp?: number;
		/**
		 * First Contentful Paint
		 */
		fcp?: number;
		/**
		 * Largest Contentful Paint
		 */
		lcp?: number;
		/**
		 * Time to App Idle
		 */
		ttai?: number;
		/**
		 * Time to Interactive
		 * This is legacy metric, that was marked manually by the team
		 */
		tti?: number;
		/**
		 * First Meaningful Paint
		 */
		fmp?: number;
		/**
		 * Total Blocking Time
		 */
		tbt?: number;
		/**
		 * Total Blocking Time Observed
		 */
		tbtObserved?: number;
		/**
		 * Cumulative Layout Shift
		 */
		cls?: number;
		/**
		 * Time to Visually Complete
		 * Contains array of multiple versions of the metric
		 */
		ttvc?: {
			/**
			 * Revision of the metric. e.g. 'fy25.02'
			 */
			revision: string;
			/**
			 * Time to Visually Complete 90% of the view port
			 */
			vc90: number;
		}[];
		/**
		 * Earliest Hold Start, for Interaction Response
		 */
		earliestHoldStart?: number;
		/**
		 * Input Delay
		 */
		inputDelay?: number;
		/**
		 * Input to Next Paint
		 */
		inp?: number;
		/**
		 * Navigation metrics, only valid for initial page load from:
		 *  https://www.w3.org/TR/resource-timing/
		 *  https://www.w3.org/TR/navigation-timing-2/
		 */
		navigation?: NavigationMetrics;
	};

	interactionId: string;
	type: InteractionType | 'page_segment_load';
	rate: number;
	routeName?: string;

	// Performance timings
	start: number;
	end: number;

	// Status and outcome
	status: string;
	abortReason?: string;
	previousInteractionName?: string;
	isPreviousInteractionAborted?: boolean;
	abortedByInteractionName?: string;
	pageVisibilityAtTTAI?: string;
	pageVisibilityAtTTI?: string;

	// Basic error count
	errorCount: number;

	// Cohorting custom data
	cohortingCustomData?: Record<string, number | boolean | string | null | undefined>;
}

export interface CriticalMetricsPayload {
	actionSubject: 'experience';
	action: 'measured';
	eventType: 'operational';
	source: 'measured';
	tags: ['observability'];
	attributes: {
		properties: CriticalMetricsPayloadProperties;
	};
}
