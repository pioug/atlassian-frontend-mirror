import {
	type InteractionMetrics,
	type ReactProfilerTiming,
	type SegmentInfo,
} from '../../../../common';
import { createSegmentMetricsPayloads } from '../create-segment-metrics';

// Mock the config
jest.mock('../../../../config', () => ({
	getConfig: () => ({
		product: 'test-product',
		region: 'test-region',
	}),
}));

// Mock other dependencies
jest.mock('../../../utils/get-browser-metadata', () => ({
	__esModule: true,
	default: () => ({
		browser: { name: 'chrome', version: '91.0' },
		device: { type: 'desktop' },
		network: { type: 'wifi' },
		time: { timezone: 'UTC' },
	}),
}));

jest.mock('../../../utils/get-page-visibility-up-to-ttai', () => ({
	__esModule: true,
	default: () => 'visible',
}));

jest.mock('../get-segment-id', () => ({
	__esModule: true,
	default: (labelStack: any[]) => {
		if (labelStack && labelStack.length > 0) {
			// Return a concatenated segment ID for nested segments
			return labelStack.map((l: any) => l.segmentId).join('.');
		}
		return null;
	},
}));

jest.mock('../get-is-root-segment', () => ({
	__esModule: true,
	default: (labelStack: any[]) => labelStack.length === 1,
}));

jest.mock('../get-segment-status', () => ({
	__esModule: true,
	default: () => ({ status: 'SUCCEEDED', abortReason: undefined }),
}));

describe('createSegmentMetricsPayloads', () => {
	it('should create only one payload per segment name when multiple segments with same name exist', async () => {
		// Create mock segments with the same name but different segmentIds
		// Make them non-root segments by adding a parent segment
		const knownSegments: SegmentInfo[] = [
			{
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ImageAttachment', segmentId: 'seg1' },
				],
			},
			{
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ImageAttachment', segmentId: 'seg2' },
				],
			},
			{
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ImageAttachment', segmentId: 'seg3' },
				],
			},
			{
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'CommentBox', segmentId: 'seg4' },
				],
			},
		];

		// Create mock profiler timings for each segment
		const reactProfilerTimings: ReactProfilerTiming[] = [
			// First ImageAttachment (earliest)
			{
				type: 'mount',
				actualDuration: 10,
				baseDuration: 10,
				startTime: 100,
				commitTime: 110,
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ImageAttachment', segmentId: 'seg1' },
				],
			},
			{
				type: 'update',
				actualDuration: 5,
				baseDuration: 5,
				startTime: 120,
				commitTime: 125,
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ImageAttachment', segmentId: 'seg1' },
				],
			},
			// Second ImageAttachment (later)
			{
				type: 'mount',
				actualDuration: 12,
				baseDuration: 12,
				startTime: 200,
				commitTime: 212,
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ImageAttachment', segmentId: 'seg2' },
				],
			},
			// Third ImageAttachment (middle)
			{
				type: 'mount',
				actualDuration: 8,
				baseDuration: 8,
				startTime: 150,
				commitTime: 158,
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ImageAttachment', segmentId: 'seg3' },
				],
			},
			// CommentBox (different name)
			{
				type: 'mount',
				actualDuration: 15,
				baseDuration: 15,
				startTime: 300,
				commitTime: 315,
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'CommentBox', segmentId: 'seg4' },
				],
			},
		];

		const mockInteraction: InteractionMetrics = {
			id: 'test-interaction',
			start: 50,
			end: 400,
			ufoName: 'test-ufo',
			isPreviousInteractionAborted: false,
			type: 'page_load',
			marks: [],
			customData: [],
			cohortingCustomData: new Map(),
			customTimings: [],
			spans: [],
			requestInfo: [],
			holdInfo: [],
			holdExpInfo: [],
			holdActive: new Map(),
			holdExpActive: new Map(),
			reactProfilerTimings,
			measureStart: 50,
			rate: 1,
			cancelCallbacks: [],
			cleanupCallbacks: [],
			metaData: {},
			errors: [],
			apdex: [],
			labelStack: null,
			routeName: 'test-route',
			knownSegments,
			awaitReactProfilerCount: 0,
			redirects: [],
			timerID: undefined,
			changeTimeout: () => {},
			trace: null,
		};

		const payloads = await createSegmentMetricsPayloads('test-interaction', mockInteraction);

		// Should create only 2 payloads: one for ImageAttachment and one for CommentBox
		expect(payloads).toHaveLength(2);

		// Check that we have one payload for each unique segment name
		const payloadNames = payloads.map((p) => p.attributes.properties['experience:name']);
		expect(payloadNames).toContain('ImageAttachment');
		expect(payloadNames).toContain('CommentBox');

		// Check that the ImageAttachment payload uses the earliest segment (seg1 with startTime 100)
		const imageAttachmentPayload = payloads.find(
			(p) => p.attributes.properties['experience:name'] === 'ImageAttachment',
		);
		expect(imageAttachmentPayload).toBeDefined();
		expect(imageAttachmentPayload!.attributes.properties.start).toBe(100); // First mount time
		expect(imageAttachmentPayload!.attributes.properties.end).toBe(125); // Last commit time for seg1

		// Check that the CommentBox payload is correct
		const commentBoxPayload = payloads.find(
			(p) => p.attributes.properties['experience:name'] === 'CommentBox',
		);
		expect(commentBoxPayload).toBeDefined();
		expect(commentBoxPayload!.attributes.properties.start).toBe(300);
		expect(commentBoxPayload!.attributes.properties.end).toBe(315);
	});

	it('should handle segments with no mount timing by skipping them', async () => {
		const knownSegments: SegmentInfo[] = [
			{
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'NoMountSegment', segmentId: 'seg1' },
				],
			},
			{
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ValidSegment', segmentId: 'seg2' },
				],
			},
		];

		const reactProfilerTimings: ReactProfilerTiming[] = [
			// No mount timing for seg1, only update
			{
				type: 'update',
				actualDuration: 5,
				baseDuration: 5,
				startTime: 100,
				commitTime: 105,
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'NoMountSegment', segmentId: 'seg1' },
				],
			},
			// Valid mount timing for seg2
			{
				type: 'mount',
				actualDuration: 10,
				baseDuration: 10,
				startTime: 200,
				commitTime: 210,
				labelStack: [
					{ name: 'IssueView', segmentId: 'root' },
					{ name: 'ValidSegment', segmentId: 'seg2' },
				],
			},
		];

		const mockInteraction: InteractionMetrics = {
			id: 'test-interaction',
			start: 50,
			end: 300,
			ufoName: 'test-ufo',
			isPreviousInteractionAborted: false,
			type: 'page_load',
			marks: [],
			customData: [],
			cohortingCustomData: new Map(),
			customTimings: [],
			spans: [],
			requestInfo: [],
			holdInfo: [],
			holdExpInfo: [],
			holdActive: new Map(),
			holdExpActive: new Map(),
			reactProfilerTimings,
			measureStart: 50,
			rate: 1,
			cancelCallbacks: [],
			cleanupCallbacks: [],
			metaData: {},
			errors: [],
			apdex: [],
			labelStack: null,
			routeName: 'test-route',
			knownSegments,
			awaitReactProfilerCount: 0,
			redirects: [],
			timerID: undefined,
			changeTimeout: () => {},
			trace: null,
		};

		const payloads = await createSegmentMetricsPayloads('test-interaction', mockInteraction);

		// Should create only 1 payload for ValidSegment, NoMountSegment should be skipped
		expect(payloads).toHaveLength(1);
		expect(payloads[0].attributes.properties['experience:name']).toBe('ValidSegment');
	});
});
