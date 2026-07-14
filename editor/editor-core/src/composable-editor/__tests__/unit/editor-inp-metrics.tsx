/* eslint-disable @atlassian/a11y/require-jest-coverage -- EditorINPMetrics renders null (no DOM output), so accessibility assertions are not applicable. */
import React from 'react';

import { act, render } from '@testing-library/react';

import { fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { FireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { setupINPTracking } from '@atlaskit/editor-performance-metrics/inp';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { addUFOCustomData } from '@atlaskit/react-ufo/custom-data';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { EditorINPMetrics } from '../../editor-inp-metrics';

jest.mock('@atlaskit/editor-common/analytics', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/analytics'),
	fireAnalyticsEvent: jest.fn(),
}));

jest.mock('@atlaskit/editor-performance-metrics/inp', () => ({
	setupINPTracking: jest.fn(() => jest.fn()),
}));

jest.mock('@atlaskit/react-ufo/interaction-metrics', () => ({
	getActiveInteraction: jest.fn(),
}));

jest.mock('@atlaskit/react-ufo/custom-data', () => ({
	addUFOCustomData: jest.fn(),
}));

// Builds a per-instance ref whose view.dom contains `childCount` descendant
// elements, so getEditorDomSize resolves to `childCount`.
const buildViewRef = (childCount: number) => {
	const dom = document.createElement('div');
	for (let i = 0; i < childCount; i++) {
		dom.appendChild(document.createElement('span'));
	}
	return { current: { dom } as unknown as EditorView };
};

describe('EditorINPMetrics', () => {
	let mockFire: ReturnType<FireAnalyticsEvent>;

	beforeEach(() => {
		jest.useFakeTimers();
		// Force the setTimeout fallback in createIdleCallback for deterministic timing.
		(window as unknown as { requestIdleCallback?: unknown }).requestIdleCallback = undefined;
		mockFire = jest.fn();
		(fireAnalyticsEvent as jest.Mock).mockReturnValue(mockFire);
		(getActiveInteraction as jest.Mock).mockReturnValue({ ufoName: 'test-ufo' });
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	// Renders the component, runs the idle callback so INP tracking is set up,
	// then invokes the captured INP callback and flushes the debounce window.
	const triggerINP = (viewRef: { current: EditorView | null }, value: number) => {
		render(<EditorINPMetrics editorViewRef={viewRef} />);

		// Fire the requestIdleCallback fallback -> setupINPTracking is registered.
		act(() => {
			jest.runOnlyPendingTimers();
		});

		const inpCallback = (setupINPTracking as jest.Mock).mock.calls[0]?.[0] as (param: {
			value: number;
		}) => void;

		act(() => {
			inpCallback({ value });
			// sendAnalytics is debounced by 1000ms (trailing).
			jest.advanceTimersByTime(1000);
		});
	};

	eeTest.describe('platform_editor_dom_node_count', 'gate on').variant(true, () => {
		it('includes editorDomSize in the INP event', () => {
			triggerINP(buildViewRef(3), 250);

			expect(mockFire).toHaveBeenCalledWith({
				payload: expect.objectContaining({
					action: 'inp',
					attributes: expect.objectContaining({
						inp: 250,
						ufoName: 'test-ufo',
						editorDomSize: 3,
					}),
				}),
			});
		});

		it('leaves editorDomSize undefined when the editor view is not available', () => {
			triggerINP({ current: null }, 250);

			expect(mockFire).toHaveBeenCalledWith({
				payload: expect.objectContaining({
					attributes: expect.objectContaining({ inp: 250, editorDomSize: undefined }),
				}),
			});
		});

		it('never reports editorDomSize to UFO from the INP handler', () => {
			triggerINP(buildViewRef(3), 250);

			// The INP callback runs inside an async PerformanceObserver, so it must not
			// push custom data onto whatever interaction happens to be active.
			expect(addUFOCustomData).not.toHaveBeenCalled();
		});
	});

	eeTest.describe('platform_editor_dom_node_count', 'gate off').variant(false, () => {
		it('leaves editorDomSize undefined', () => {
			triggerINP(buildViewRef(3), 250);

			expect(mockFire).toHaveBeenCalledWith({
				payload: expect.objectContaining({
					action: 'inp',
					attributes: expect.objectContaining({
						inp: 250,
						ufoName: 'test-ufo',
						editorDomSize: undefined,
					}),
				}),
			});
		});
	});
});
