import React from 'react';

import { render } from '@atlassian/testing-library/render';

import { getConfig } from '../../config';
import { getActiveInteraction } from '../../interaction-metrics';
import { clearState } from '../ssr-render-profiler/clear-state';
import { flushSsrRenderProfilerTraces } from '../ssr-render-profiler/flush-traces';
import SsrRenderProfiler from '../ssr-render-profiler/ssr-render-profiler';
import { SsrRenderProfilerInner } from '../ssr-render-profiler/ssr-render-profiler-inner';
import type { GlobalThis, Span } from '../ssr-render-profiler/types';

jest.mock('../../config', () => ({ getConfig: jest.fn() }));
jest.mock('../../interaction-metrics', () => ({ getActiveInteraction: jest.fn() }));

// Deliberately exercise the old public entry: compatibility must preserve identity,
// not introduce a second component/context or a separate tracing store.
const legacy = jest.requireActual<typeof import('../ssr-render-profiler')>(
	'@atlaskit/react-ufo/ssr-render-profiler',
);
const direct = jest.requireActual<typeof import('../ssr-render-profiler/flush-traces')>(
	'@atlaskit/react-ufo/flush-ssr-render-profiler-traces',
);

const labelStack = [{ name: 'segment', segmentId: 'segment' }];
const vm = globalThis as GlobalThis;
const originalInternals = vm.__vm_internals__;
let spans: Span[];
let startSpan: jest.Mock;

beforeEach(() => {
	spans = [];
	jest
		.mocked(getConfig)
		.mockReturnValue({ ssr: { enableNativeTracing: true } } as ReturnType<typeof getConfig>);
	jest.mocked(getActiveInteraction).mockReturnValue(undefined);
	startSpan = jest.fn(() => {
		const spanId = `span-${spans.length}`;
		const span: Span = {
			end: jest.fn(),
			setAttribute: jest.fn(),
			addEvent: jest.fn(),
			getSpanContext: () => ({
				spanId,
				traceId: 'trace',
				isSampled: true,
				isRemote: false,
			}),
		};
		spans.push(span);
		return span;
	});
	vm.__vm_internals__ = { telemetry: { startSpan, forceFlush: jest.fn() } };
	clearState();
});

afterEach(() => {
	clearState();
	vm.__vm_internals__ = originalInternals;
	jest.restoreAllMocks();
});

it('preserves every legacy runtime binding and the segment flush re-export', () => {
	expect(legacy.default).toBe(SsrRenderProfiler);
	expect(legacy.SsrRenderProfilerInner).toBe(SsrRenderProfilerInner);
	expect(legacy.clearState).toBe(clearState);
	expect(legacy.flushSsrRenderProfilerTraces).toBe(flushSsrRenderProfilerTraces);
	expect(direct.flushSsrRenderProfilerTraces).toBe(flushSsrRenderProfilerTraces);
	expect(jest.requireActual('@atlaskit/react-ufo/segment').flushSsrRenderProfilerTraces).toBe(
		flushSsrRenderProfilerTraces,
	);
});

it('shares one span across legacy/direct renders and flushes its latest end only once', () => {
	const now = jest.spyOn(performance, 'now').mockReturnValue(10);
	const onRender = jest.fn();
	const view = render(
		<legacy.SsrRenderProfilerInner labelStack={labelStack} onRender={onRender} />,
	);
	now.mockReturnValue(30);
	view.rerender(<SsrRenderProfilerInner labelStack={labelStack} onRender={onRender} />);
	expect(startSpan).toHaveBeenCalledTimes(1);
	expect(onRender).toHaveBeenLastCalledWith('mount', 20, 0, 10, 30);
	direct.flushSsrRenderProfilerTraces();
	expect(spans[0].end).toHaveBeenCalledWith(30);
	legacy.flushSsrRenderProfilerTraces();
	expect(spans[0].end).toHaveBeenCalledTimes(1);

	// Flushing removes spans, not start marks: a later render still measures
	// from the original attempt until reset or an interaction change.
	now.mockReturnValue(40);
	view.rerender(<SsrRenderProfilerInner labelStack={labelStack} onRender={onRender} />);
	expect(startSpan).toHaveBeenCalledTimes(2);
	expect(onRender).toHaveBeenLastCalledWith('mount', 30, 0, 10, 40);
});

it('legacy reset clears direct-render state without ending discarded spans', () => {
	const view = render(<SsrRenderProfilerInner labelStack={labelStack} onRender={jest.fn()} />);
	legacy.clearState();
	view.rerender(<SsrRenderProfilerInner labelStack={labelStack} onRender={jest.fn()} />);
	expect(startSpan).toHaveBeenCalledTimes(2);
	direct.flushSsrRenderProfilerTraces();
	expect(spans[0].end).not.toHaveBeenCalled();
	expect(spans[1].end).toHaveBeenCalledTimes(1);
});

it('discards the previous interaction spans and start times when the interaction changes', () => {
	const active = jest.mocked(getActiveInteraction);
	active.mockReturnValue({ id: 'first' } as ReturnType<typeof getActiveInteraction>);
	const now = jest.spyOn(performance, 'now').mockReturnValue(10);
	const onRender = jest.fn();
	const view = render(<SsrRenderProfilerInner labelStack={labelStack} onRender={onRender} />);
	active.mockReturnValue({ id: 'second' } as ReturnType<typeof getActiveInteraction>);
	now.mockReturnValue(30);
	view.rerender(<legacy.SsrRenderProfilerInner labelStack={labelStack} onRender={onRender} />);
	expect(onRender).toHaveBeenLastCalledWith('mount', 0, 0, 30, 30);
	expect(startSpan).toHaveBeenCalledTimes(2);
	legacy.flushSsrRenderProfilerTraces();
	expect(spans[0].end).not.toHaveBeenCalled();
	expect(spans[1].end).toHaveBeenCalledTimes(1);
});

it('shares parent span context between legacy and direct components', () => {
	render(
		<legacy.SsrRenderProfilerInner labelStack={labelStack} onRender={jest.fn()}>
			<SsrRenderProfilerInner
				labelStack={[...labelStack, { name: 'child', segmentId: 'child' }]}
				onRender={jest.fn()}
			/>
		</legacy.SsrRenderProfilerInner>,
	);
	expect(startSpan).toHaveBeenNthCalledWith(2, 'child', { parentSpanId: 'span-0' });
});
