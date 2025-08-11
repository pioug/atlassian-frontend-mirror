/* eslint-disable playwright/no-conditional-expect */
/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import type { SegmentInfo } from '../../src/common';
import type { RootSegment } from '../../src/common/react-ufo-payload-schema';

import { expect, test } from './fixtures';

/**
 * Recursively counts objects with a specific "n" property value in a nested object structure
 * @param obj - The object to search through
 * @param targetName - The value to match against the "n" property
 * @returns The count of objects with matching "n" property
 */
function countObjectsWithName(obj: any, targetName: string): number {
	let count = 0;

	// Handle the RootSegment structure which has an "r" property
	if (obj && typeof obj === 'object' && obj.r) {
		return countObjectsWithName(obj.r, targetName);
	}

	// Check if current object has the target "n" property
	if (obj && typeof obj === 'object' && obj.n === targetName) {
		count++;
	}

	// Recursively search through "c" (children) property if it exists
	if (obj && typeof obj === 'object' && obj.c) {
		for (const key in obj.c) {
			if (obj.c.hasOwnProperty(key)) {
				count += countObjectsWithName(obj.c[key], targetName);
			}
		}
	}

	return count;
}

function countObjectsWithNameInInteraction(segments: any[], targetName: string): number {
	let count = 0;
	segments.forEach((element) => {
		const subarray = element.labelStack;
		if (subarray.length > 0 && subarray[subarray.length - 1].n === targetName) {
			count++;
		}
	});
	return count;
}

test.describe('React UFO: Segments threshold configuration', () => {
	test.use({
		examplePage: 'multiple-segments-labelstack-tree',
		viewport: {
			width: 1920,
			height: 1080,
		},
		featureFlags: ['platform_ufo_add_segments_count_threshold'],
	});

	test(`UFO Segment threshold is applied correctly`, async ({ page, waitForReactUFOPayload }) => {
		const mainDiv = page.locator('[data-testid="page-container"]');
		await expect(mainDiv).toBeVisible();
		const payload = await waitForReactUFOPayload();
		expect(payload).toBeDefined();
		const segments = payload?.attributes.properties.interactionMetrics.segments as RootSegment;

		const level1_3_count = countObjectsWithName(segments, 'level1-3');
		expect(level1_3_count).toBe(3);
	});
});

test.describe('React UFO: Segments threshold configuration fg disabled', () => {
	test.use({
		examplePage: 'multiple-segments-labelstack-tree',
		viewport: {
			width: 1920,
			height: 1080,
		},
		featureFlags: [],
	});

	test(`UFO Segment threshold is applied correctly fg disabled`, async ({
		page,
		waitForReactUFOPayload,
	}) => {
		const mainDiv = page.locator('[data-testid="page-container"]');
		await expect(mainDiv).toBeVisible();
		const payload = await waitForReactUFOPayload();
		expect(payload).toBeDefined();
		const segments = payload?.attributes.properties.interactionMetrics.segments as RootSegment;

		const level1_3_count = countObjectsWithName(segments, 'level1-3');
		expect(level1_3_count).toBe(6);
	});
});

test.describe('ReactUFO: Interactions Segments threshold configuration', () => {
	test.use({
		examplePage: 'multiple-segments-labelstack-tree',
		featureFlags: ['platform_ufo_add_segments_count_threshold'],
	});
	test('segments limited to 3', async ({ page, waitForReactUFOInteractionPayload }) => {
		const mainDiv = page.locator('[data-testid="page-container"]');
		await expect(mainDiv).toBeVisible();

		await page.getByText('Toggle new segments').click();

		const reactUFOPayload = await waitForReactUFOInteractionPayload();
		expect(reactUFOPayload).toBeDefined();
		const segments = reactUFOPayload?.attributes.properties.interactionMetrics
			.segments as SegmentInfo[];
		const level1_3_count = countObjectsWithNameInInteraction(segments, 'level1-3');
		expect(level1_3_count).toBe(3);
	});
});

test.describe('ReactUFO: Interactions Segments threshold configuration fg disabled', () => {
	test.use({
		examplePage: 'multiple-segments-labelstack-tree',
		featureFlags: [],
	});
	test('segments no limited', async ({ page, waitForReactUFOInteractionPayload }) => {
		const mainDiv = page.locator('[data-testid="page-container"]');
		await expect(mainDiv).toBeVisible();

		await page.getByText('Toggle new segments').click();

		const reactUFOPayload = await waitForReactUFOInteractionPayload();
		expect(reactUFOPayload).toBeDefined();
		const segments = reactUFOPayload?.attributes.properties.interactionMetrics
			.segments as SegmentInfo[];
		const level1_3_count = countObjectsWithNameInInteraction(segments, 'level1-3');
		expect(level1_3_count).toBe(6);
	});
});
