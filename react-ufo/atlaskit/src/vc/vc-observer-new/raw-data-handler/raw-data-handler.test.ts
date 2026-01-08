import getViewportHeight from '../metric-calculator/utils/get-viewport-height';
import getViewportWidth from '../metric-calculator/utils/get-viewport-width';
import type { VCObserverEntry, ViewportEntryData, WindowEventEntryData } from '../types';

import RawDataHandler from './index';

// Mock viewport utilities
jest.mock('../metric-calculator/utils/get-viewport-width');
jest.mock('../metric-calculator/utils/get-viewport-height');

const mockGetViewportWidth = getViewportWidth as jest.MockedFunction<typeof getViewportWidth>;
const mockGetViewportHeight = getViewportHeight as jest.MockedFunction<typeof getViewportHeight>;

describe('RawDataHandler', () => {
	let handler: RawDataHandler;

	beforeEach(() => {
		handler = new RawDataHandler();
		mockGetViewportWidth.mockReturnValue(1920);
		mockGetViewportHeight.mockReturnValue(1080);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getRawData - event tracking', () => {
		const startTime = 1000;
		const stopTime = 2000;

		it('should include events in rawData when events occur during the time window', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1500,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result).toBeDefined();
			expect(result?.rawData?.evts).toBeDefined();
			expect(result?.rawData?.evts).toHaveLength(2);
			expect(result?.rawData?.evt).toBeDefined();
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
				2: 'scroll',
			});

			// Verify event observations have correct timestamps
			expect(result?.rawData?.evts?.[0]).toEqual({
				t: 100, // 1100 - 1000
				evt: 1,
			});
			expect(result?.rawData?.evts?.[1]).toEqual({
				t: 500, // 1500 - 1000
				evt: 2,
			});
		});

		it('should map multiple events of the same type to the same ID', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1200,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1300,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(3);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
			});

			// All events should reference the same event type ID
			expect(result?.rawData?.evts?.every((evt) => evt.evt === 1)).toBe(true);
		});

		it('should exclude events outside the time window', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 500, // Before startTime
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1100, // Within time window
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
				{
					time: 2500, // After stopTime
					data: {
						type: 'window:event',
						eventType: 'keydown',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(1);
			expect(result?.rawData?.evts?.[0].evt).toBe(1);
			expect(result?.rawData?.evt).toEqual({
				1: 'scroll',
			});
		});

		it('should handle all event types correctly', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1200,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
				{
					time: 1300,
					data: {
						type: 'window:event',
						eventType: 'keydown',
					} as WindowEventEntryData,
				},
				{
					time: 1400,
					data: {
						type: 'window:event',
						eventType: 'resize',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(4);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
				2: 'scroll',
				3: 'keydown',
				4: 'resize',
			});
		});

		it('should not include events array when no events occur', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'mutation:element',
						elementName: 'div',
						rect: new DOMRect(0, 0, 100, 100),
						visible: true,
					} as ViewportEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toBeUndefined();
			expect(result?.rawData?.evt).toBeUndefined();
		});

		it('should include both viewport entries and events', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'mutation:element',
						elementName: 'div',
						rect: new DOMRect(0, 0, 100, 100),
						visible: true,
					} as ViewportEntryData,
				},
				{
					time: 1200,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1300,
					data: {
						type: 'mutation:element',
						elementName: 'span',
						rect: new DOMRect(10, 10, 50, 50),
						visible: true,
					} as ViewportEntryData,
				},
				{
					time: 1400,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.obs).toBeDefined();
			expect(result?.rawData?.obs).toHaveLength(2);
			expect(result?.rawData?.evts).toBeDefined();
			expect(result?.rawData?.evts).toHaveLength(2);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
				2: 'scroll',
			});
		});

		it('should calculate event timestamps relative to startTime', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1234,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1567,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime: 1000,
				stopTime: 2000,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts?.[0].t).toBe(234); // 1234 - 1000, rounded
			expect(result?.rawData?.evts?.[1].t).toBe(567); // 1567 - 1000, rounded
		});

		it('should handle events at the boundary of the time window', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1000, // Exactly at startTime
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 2000, // Exactly at stopTime
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(2);
			expect(result?.rawData?.evts?.[0].t).toBe(0); // 1000 - 1000
			expect(result?.rawData?.evts?.[1].t).toBe(1000); // 2000 - 1000
		});

		it('should not include events when page is not visible', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: false,
			});

			expect(result?.rawData).toBeUndefined();
			expect(result?.abortReason).toBe('browser_backgrounded');
		});
	});

	describe('getRawData - window event filtering', () => {
		const startTime = 1000;
		const stopTime = 2000;

		it('should only include entries with type window:event and eventType property', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1200,
					data: {
						type: 'mutation:element',
						elementName: 'div',
						rect: new DOMRect(0, 0, 100, 100),
						visible: true,
					} as ViewportEntryData,
				},
				{
					time: 1300,
					data: {
						type: 'layout-shift',
						elementName: 'span',
						rect: new DOMRect(10, 10, 50, 50),
						visible: true,
					} as ViewportEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(1);
			expect(result?.rawData?.evts?.[0].evt).toBe(1);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
			});
		});

		it('should exclude entries where time is less than startTime', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 999, // Just before startTime
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1000, // Exactly at startTime (should be included)
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(1);
			expect(result?.rawData?.evts?.[0].evt).toBe(1);
			expect(result?.rawData?.evt).toEqual({
				1: 'scroll',
			});
		});

		it('should exclude entries where time is greater than stopTime', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 2000, // Exactly at stopTime (should be included)
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 2001, // Just after stopTime
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(1);
			expect(result?.rawData?.evts?.[0].evt).toBe(1);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
			});
		});

		it('should include entries at both boundaries of the time window', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1000, // Exactly at startTime
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1500, // Middle of time window
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
				{
					time: 2000, // Exactly at stopTime
					data: {
						type: 'window:event',
						eventType: 'keydown',
					} as WindowEventEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(3);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
				2: 'scroll',
				3: 'keydown',
			});
		});

		it('should filter out viewport entries from window event collection', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1200,
					data: {
						type: 'mutation:element',
						elementName: 'div',
						rect: new DOMRect(0, 0, 100, 100),
						visible: true,
					} as ViewportEntryData,
				},
				{
					time: 1300,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
				{
					time: 1400,
					data: {
						type: 'mutation:attribute',
						elementName: 'span',
						rect: new DOMRect(10, 10, 50, 50),
						visible: true,
						attributeName: 'class',
					} as ViewportEntryData,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should only have 2 window events, not the viewport entries
			expect(result?.rawData?.evts).toHaveLength(2);
			expect(result?.rawData?.evts?.[0].evt).toBe(1);
			expect(result?.rawData?.evts?.[1].evt).toBe(2);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
				2: 'scroll',
			});

			// Viewport entries should still be in observations
			expect(result?.rawData?.obs).toHaveLength(2);
		});

		it('should handle entries with missing data property', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1200,
					data: null as any, // Missing data
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(1);
			expect(result?.rawData?.evts?.[0].evt).toBe(1);
		});

		it('should verify isWindowEventEntryData type guard correctly identifies window events', async () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1100,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
				{
					time: 1200,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				},
				{
					time: 1300,
					// This has type 'window:event' but missing eventType - should be excluded
					data: {
						type: 'window:event',
					} as any,
				},
			];

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should only include entries with both type === 'window:event' AND eventType property
			expect(result?.rawData?.evts).toHaveLength(2);
			expect(result?.rawData?.evt).toEqual({
				1: 'wheel',
				2: 'scroll',
			});
		});
	});

	describe('getVCCleanStatus - with events', () => {
		it('should detect abort events correctly', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1000,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				},
			];

			const result = handler['getVCCleanStatus'](entries);

			expect(result.isVCClean).toBe(false);
			expect(result.dirtyReason).toBe('wheel');
			expect(result.abortTimestamp).toBe(1000);
		});

		it('should map keydown to keypress in dirtyReason', () => {
			const entries: VCObserverEntry[] = [
				{
					time: 1000,
					data: {
						type: 'window:event',
						eventType: 'keydown',
					} as WindowEventEntryData,
				},
			];

			const result = handler['getVCCleanStatus'](entries);

			expect(result.isVCClean).toBe(false);
			expect(result.dirtyReason).toBe('keypress');
		});
	});

	describe('getRawData - event observations trimming', () => {
		const startTime = 1000;
		const stopTime = 4000;
		const MAX_OBSERVATIONS = 200;

		it('should not trim event observations when count is exactly MAX_OBSERVATIONS', async () => {
			const entries: VCObserverEntry[] = [];
			for (let i = 0; i < MAX_OBSERVATIONS; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.evts).toHaveLength(MAX_OBSERVATIONS);
			expect(result?.rawData?.evt).toBeDefined();
		});

		it('should trim event observations when count exceeds MAX_OBSERVATIONS', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEvents = MAX_OBSERVATIONS + 50; // 150 events

			// Create first event with unique type
			entries.push({
				time: startTime,
				data: {
					type: 'window:event',
					eventType: 'resize',
				} as WindowEventEntryData,
			});

			// Create middle events that should be trimmed
			for (let i = 1; i < totalEvents - MAX_OBSERVATIONS; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'window:event',
						eventType: 'wheel',
					} as WindowEventEntryData,
				});
			}

			// Create last MAX_OBSERVATIONS events that should be kept
			for (let i = totalEvents - MAX_OBSERVATIONS; i < totalEvents; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should have first observation + last MAX_OBSERVATIONS = 101 total
			expect(result?.rawData?.evts).toHaveLength(MAX_OBSERVATIONS + 1);
			// First observation should be the resize event
			const resizeEventId = result?.rawData?.evts?.[0].evt;
			expect(result?.rawData?.evt?.[resizeEventId!]).toBe('resize');
			// Last observations should be scroll events
			const scrollEventId = result?.rawData?.evts?.[MAX_OBSERVATIONS].evt;
			expect(result?.rawData?.evt?.[scrollEventId!]).toBe('scroll');
		});

		it('should remove unreferenced event type map entries after trimming', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEvents = MAX_OBSERVATIONS + 50; // 150 events

			// Create first event with unique type that will be kept
			entries.push({
				time: startTime,
				data: {
					type: 'window:event',
					eventType: 'resize',
				} as WindowEventEntryData,
			});

			// Add a single 'wheel' event as the second element - should be trimmed
			entries.push({
				time: startTime + 5,
				data: {
					type: 'window:event',
					eventType: 'wheel',
				} as WindowEventEntryData,
			});

			for (let i = 0; i < totalEvents; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Verify trimming occurred - should have first + last MAX_OBSERVATIONS
			expect(result?.rawData?.evts).toHaveLength(MAX_OBSERVATIONS + 1);

			// Verify first observation is 'resize'
			const firstEventId = result?.rawData?.evts?.[0].evt;
			expect(result?.rawData?.evt?.[firstEventId!]).toBe('resize');

			// Verify last observation is 'scroll'
			const lastEventId = result?.rawData?.evts?.[MAX_OBSERVATIONS].evt;
			expect(result?.rawData?.evt?.[lastEventId!]).toBe('scroll');

			// Verify that all event IDs in observations are valid
			const allEventIds = new Set(result?.rawData?.evts?.map((evt) => evt.evt) || []);
			for (const evtId of allEventIds) {
				expect(result?.rawData?.evt?.[evtId]).toBeDefined();
			}

			// The important thing is that 'wheel' should not be referenced by any observation
			// (even if it's still in the map due to a bug, it shouldn't be used)
			const wheelEventId = Object.keys(result?.rawData?.evt || {}).find(
				(key) => result?.rawData?.evt?.[Number(key)] === 'wheel',
			);
			if (wheelEventId !== undefined) {
				// If 'wheel' exists in the map, verify it's not used by any observation
				expect(allEventIds.has(Number(wheelEventId))).toBe(false);
			}
		});

		it('should keep first observation even if it uses same event type as last observations', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEvents = MAX_OBSERVATIONS + 50; // 150 events

			// Create first event with 'scroll' type
			entries.push({
				time: startTime,
				data: {
					type: 'window:event',
					eventType: 'scroll',
				} as WindowEventEntryData,
			});

			// Create first event with 'scroll' type
			entries.push({
				time: startTime,
				data: {
					type: 'window:event',
					eventType: 'wheel',
				} as WindowEventEntryData,
			});

			// Create last MAX_OBSERVATIONS events with 'scroll' type (same as first)
			for (let i = 0; i < totalEvents; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'window:event',
						eventType: 'scroll',
					} as WindowEventEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should have first observation + last MAX_OBSERVATIONS = 101 total
			expect(result?.rawData?.evts).toHaveLength(MAX_OBSERVATIONS + 1);

			// Verify first observation is 'scroll'
			const firstEventId = result?.rawData?.evts?.[0].evt;
			expect(result?.rawData?.evt?.[firstEventId!]).toBe('scroll');

			// Verify that all observations reference valid event types
			const allEventIds = new Set(result?.rawData?.evts?.map((evt) => evt.evt) || []);
			for (const evtId of allEventIds) {
				expect(result?.rawData?.evt?.[evtId]).toBeDefined();
			}

			// 'wheel' should not be referenced by any observation
			const wheelEventId = Object.keys(result?.rawData?.evt || {}).find(
				(key) => result?.rawData?.evt?.[Number(key)] === 'wheel',
			);
			if (wheelEventId !== undefined) {
				expect(allEventIds.has(Number(wheelEventId))).toBe(false);
			}
		});

		it('should handle trimming with multiple event types in last observations', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEvents = MAX_OBSERVATIONS + 50; // 150 events

			// Create first event with unique type
			entries.push({
				time: startTime,
				data: {
					type: 'window:event',
					eventType: 'resize',
				} as WindowEventEntryData,
			});

			// Create middle events with 'wheel' type that should be trimmed
			entries.push({
				time: startTime + 5,
				data: {
					type: 'window:event',
					eventType: 'wheel',
				} as WindowEventEntryData,
			});

			// Create last MAX_OBSERVATIONS events with alternating types
			// Use 'scroll' and 'keydown' which haven't been seen yet
			for (let i = 0; i < totalEvents; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'window:event',
						eventType: i % 2 === 0 ? 'scroll' : 'keydown',
					} as WindowEventEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should have first observation + last MAX_OBSERVATIONS = 101 total
			expect(result?.rawData?.evts).toHaveLength(MAX_OBSERVATIONS + 1);

			// Verify first observation is 'resize'
			const firstEventId = result?.rawData?.evts?.[0].evt;
			expect(result?.rawData?.evt?.[firstEventId!]).toBe('resize');

			// Should have resize, scroll, and keydown in the map (at minimum)
			expect(result?.rawData?.evt).toBeDefined();
			const eventTypeValues = Object.values(result?.rawData?.evt || {});
			expect(eventTypeValues).toContain('resize');
			expect(eventTypeValues).toContain('scroll');
			expect(eventTypeValues).toContain('keydown');

			// Verify that all event IDs in observations are in the map
			const allEventIds = new Set(result?.rawData?.evts?.map((evt) => evt.evt) || []);
			for (const evtId of allEventIds) {
				expect(result?.rawData?.evt?.[evtId]).toBeDefined();
			}

			// 'wheel' should not be referenced by any remaining observation
			const wheelEventId = Object.keys(result?.rawData?.evt || {}).find(
				(key) => result?.rawData?.evt?.[Number(key)] === 'wheel',
			);
			if (wheelEventId !== undefined) {
				expect(allEventIds.has(Number(wheelEventId))).toBe(false);
			}
		});
	});

	describe('getRawData - viewport observations trimming with SSR preservation', () => {
		const startTime = 1000;
		const stopTime = 4000;
		const MAX_OBSERVATIONS = 200;

		it('should preserve SSR observation when trimming viewport observations', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEntries = MAX_OBSERVATIONS + 50; // 150 entries

			// Create first entry with unique element name
			entries.push({
				time: startTime,
				data: {
					type: 'mutation:element',
					elementName: 'first-element',
					rect: new DOMRect(0, 0, 100, 100),
					visible: true,
				} as ViewportEntryData,
			});

			// Create SSR entry that should be preserved
			entries.push({
				time: startTime + 10,
				data: {
					type: 'mutation:element',
					elementName: 'SSR',
					rect: new DOMRect(0, 0, 1920, 1080),
					visible: true,
				} as ViewportEntryData,
			});

			// Create middle entries that should be trimmed
			for (let i = 2; i < totalEntries - MAX_OBSERVATIONS; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: `middle-element-${i}`,
						rect: new DOMRect(0, 0, 50, 50),
						visible: true,
					} as ViewportEntryData,
				});
			}

			// Create last MAX_OBSERVATIONS entries that should be kept
			for (let i = totalEntries - MAX_OBSERVATIONS; i < totalEntries; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: `last-element-${i}`,
						rect: new DOMRect(0, 0, 100, 100),
						visible: true,
					} as ViewportEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should have first observation + SSR observation + last MAX_OBSERVATIONS = 102 total
			expect(result?.rawData?.obs).toHaveLength(MAX_OBSERVATIONS + 2);

			// Verify SSR is in the element map
			const elementNames = Object.values(result?.rawData?.eid || {});
			expect(elementNames).toContain('SSR');
			expect(elementNames).toContain('first-element');

			// Verify SSR observation exists in the observations
			const ssrEid = Object.keys(result?.rawData?.eid || {}).find(
				(key) => result?.rawData?.eid?.[Number(key)] === 'SSR',
			);
			expect(ssrEid).toBeDefined();
			const ssrObservationExists = result?.rawData?.obs?.some((obs) => obs.eid === Number(ssrEid));
			expect(ssrObservationExists).toBe(true);
		});

		it('should not duplicate SSR observation when it is the first observation', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEntries = MAX_OBSERVATIONS + 50; // 150 entries

			// Create SSR entry as the first entry
			entries.push({
				time: startTime,
				data: {
					type: 'mutation:element',
					elementName: 'SSR',
					rect: new DOMRect(0, 0, 1920, 1080),
					visible: true,
				} as ViewportEntryData,
			});

			// Create middle entries that should be trimmed
			for (let i = 1; i < totalEntries - MAX_OBSERVATIONS; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: `middle-element-${i}`,
						rect: new DOMRect(0, 0, 50, 50),
						visible: true,
					} as ViewportEntryData,
				});
			}

			// Create last MAX_OBSERVATIONS entries
			for (let i = totalEntries - MAX_OBSERVATIONS; i < totalEntries; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: `last-element-${i}`,
						rect: new DOMRect(0, 0, 100, 100),
						visible: true,
					} as ViewportEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should have first observation (SSR) + last MAX_OBSERVATIONS = 101 total
			// SSR should not be duplicated since it's already the first observation
			expect(result?.rawData?.obs).toHaveLength(MAX_OBSERVATIONS + 1);

			// Verify SSR is in the element map
			const elementNames = Object.values(result?.rawData?.eid || {});
			expect(elementNames).toContain('SSR');

			// Count how many SSR observations exist - should be exactly 1
			const ssrEid = Object.keys(result?.rawData?.eid || {}).find(
				(key) => result?.rawData?.eid?.[Number(key)] === 'SSR',
			);
			const ssrObservationCount = result?.rawData?.obs?.filter(
				(obs) => obs.eid === Number(ssrEid),
			).length;
			expect(ssrObservationCount).toBe(1);
		});

		it('should not duplicate SSR observation when it is in the last MAX_OBSERVATIONS', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEntries = MAX_OBSERVATIONS + 50; // 150 entries

			// Create first entry
			entries.push({
				time: startTime,
				data: {
					type: 'mutation:element',
					elementName: 'first-element',
					rect: new DOMRect(0, 0, 100, 100),
					visible: true,
				} as ViewportEntryData,
			});

			// Create middle entries that should be trimmed
			for (let i = 1; i < totalEntries - MAX_OBSERVATIONS; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: `middle-element-${i}`,
						rect: new DOMRect(0, 0, 50, 50),
						visible: true,
					} as ViewportEntryData,
				});
			}

			// Create last MAX_OBSERVATIONS entries with SSR as one of them
			for (let i = totalEntries - MAX_OBSERVATIONS; i < totalEntries; i++) {
				const isSSR = i === totalEntries - 50; // SSR is in the middle of last observations
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: isSSR ? 'SSR' : `last-element-${i}`,
						rect: new DOMRect(0, 0, 100, 100),
						visible: true,
					} as ViewportEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should have first observation + last MAX_OBSERVATIONS = 101 total
			// SSR should not be duplicated since it's already in the last MAX_OBSERVATIONS
			expect(result?.rawData?.obs).toHaveLength(MAX_OBSERVATIONS + 1);

			// Verify SSR is in the element map
			const elementNames = Object.values(result?.rawData?.eid || {});
			expect(elementNames).toContain('SSR');

			// Count how many SSR observations exist - should be exactly 1
			const ssrEid = Object.keys(result?.rawData?.eid || {}).find(
				(key) => result?.rawData?.eid?.[Number(key)] === 'SSR',
			);
			const ssrObservationCount = result?.rawData?.obs?.filter(
				(obs) => obs.eid === Number(ssrEid),
			).length;
			expect(ssrObservationCount).toBe(1);
		});

		it('should handle case when there is no SSR observation', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEntries = MAX_OBSERVATIONS + 50; // 150 entries

			// Create first entry
			entries.push({
				time: startTime,
				data: {
					type: 'mutation:element',
					elementName: 'first-element',
					rect: new DOMRect(0, 0, 100, 100),
					visible: true,
				} as ViewportEntryData,
			});

			// Create remaining entries without SSR
			for (let i = 1; i < totalEntries; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: `element-${i}`,
						rect: new DOMRect(0, 0, 50, 50),
						visible: true,
					} as ViewportEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Should have first observation + last MAX_OBSERVATIONS = 101 total
			expect(result?.rawData?.obs).toHaveLength(MAX_OBSERVATIONS + 1);

			// Verify SSR is NOT in the element map
			const elementNames = Object.values(result?.rawData?.eid || {});
			expect(elementNames).not.toContain('SSR');
		});

		it('should correctly retain SSR element mapping after trimming', async () => {
			const entries: VCObserverEntry[] = [];
			const totalEntries = MAX_OBSERVATIONS + 50; // 150 entries

			// Create first entry
			entries.push({
				time: startTime,
				data: {
					type: 'mutation:element',
					elementName: 'first-element',
					rect: new DOMRect(0, 0, 100, 100),
					visible: true,
				} as ViewportEntryData,
			});

			// Create SSR entry that should be preserved
			entries.push({
				time: startTime + 10,
				data: {
					type: 'mutation:element',
					elementName: 'SSR',
					rect: new DOMRect(0, 0, 1920, 1080),
					visible: true,
				} as ViewportEntryData,
			});

			// Create entries with a unique element that will be trimmed
			entries.push({
				time: startTime + 20,
				data: {
					type: 'mutation:element',
					elementName: 'trimmed-element',
					rect: new DOMRect(0, 0, 50, 50),
					visible: true,
				} as ViewportEntryData,
			});

			// Create remaining entries
			for (let i = 3; i < totalEntries; i++) {
				entries.push({
					time: startTime + i * 10,
					data: {
						type: 'mutation:element',
						elementName: `element-${i}`,
						rect: new DOMRect(0, 0, 50, 50),
						visible: true,
					} as ViewportEntryData,
				});
			}

			const result = await handler.getRawData({
				entries,
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// Verify SSR is still in the element map
			const elementNames = Object.values(result?.rawData?.eid || {});
			expect(elementNames).toContain('SSR');
			expect(elementNames).toContain('first-element');

			// Verify trimmed-element is NOT in the element map (it was trimmed)
			expect(elementNames).not.toContain('trimmed-element');

			// Verify all observation eids reference valid entries in the eid map
			const allEids = new Set(result?.rawData?.obs?.map((obs) => obs.eid) || []);
			for (const eid of allEids) {
				expect(result?.rawData?.eid?.[eid]).toBeDefined();
			}
		});
	});
});
