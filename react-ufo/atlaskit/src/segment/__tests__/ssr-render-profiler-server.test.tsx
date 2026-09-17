/** @jest-environment node */

jest.mock('../../config', () => ({
	getConfig: () => ({ ssr: { enableNativeTracing: true } }),
}));
jest.mock('../../interaction-metrics', () => ({ getActiveInteraction: () => undefined }));

import type { GlobalThis, Span } from '../ssr-render-profiler/types';

it.each([false, true])('preserves the wrapper behavior with SSR=%s', (ssr) => {
	const previous = process.env.REACT_SSR;
	const vm = globalThis as GlobalThis;
	const previousInternals = vm.__vm_internals__;
	const span: Span = {
		end: jest.fn(),
		setAttribute: jest.fn(),
		addEvent: jest.fn(),
		getSpanContext: () => null,
	};
	const startSpan = jest.fn(() => span);
	process.env.REACT_SSR = ssr ? 'true' : '';
	vm.__vm_internals__ = { telemetry: { startSpan, forceFlush: jest.fn() } };
	try {
		// SSR detection is intentionally captured at module load, as in the original.
		// Load React and its renderer in the same registry to avoid duplicate React.
		jest.isolateModules(() => {
			const React = require('react');
			const { renderToString } = require('react-dom/server');
			// Legacy binding identity is covered by ssr-render-profiler-compatibility.test.tsx.
			const { default: SsrRenderProfiler } = require('../ssr-render-profiler/ssr-render-profiler');
			const { clearState } = require('../ssr-render-profiler/clear-state');
			const {
				flushSsrRenderProfilerTraces: flushDirect,
			} = require('../ssr-render-profiler/flush-traces');
			const {
				flushSsrRenderProfilerTraces,
			} = require('@atlaskit/react-ufo/flush-ssr-render-profiler-traces');
			const onRender = jest.fn();
			const html = renderToString(
				React.createElement(
					SsrRenderProfiler,
					{
						labelStack: [{ name: 'server', segmentId: 'server' }],
						onRender,
					},
					React.createElement('span', null, 'child'),
				),
			);
			expect(html).toBe('<span>child</span>');
			expect(onRender).toHaveBeenCalledTimes(ssr ? 1 : 0);
			expect(startSpan).toHaveBeenCalledTimes(ssr ? 1 : 0);
			flushSsrRenderProfilerTraces();
			expect(span.end).toHaveBeenCalledTimes(ssr ? 1 : 0);
			flushDirect();
			expect(span.end).toHaveBeenCalledTimes(ssr ? 1 : 0);
			if (ssr) {
				const unfinished = { ...span, end: jest.fn() };
				startSpan.mockReturnValueOnce(unfinished);
				const InterruptedChild = () => {
					throw new Error('interrupted render');
				};
				expect(() =>
					renderToString(
						React.createElement(
							SsrRenderProfiler,
							{
								labelStack: [{ name: 'interrupted', segmentId: 'interrupted' }],
								onRender,
							},
							React.createElement(InterruptedChild),
						),
					),
				).toThrow('interrupted render');
				flushSsrRenderProfilerTraces();
				flushDirect();
				expect(unfinished.end).not.toHaveBeenCalled();
			}
			clearState();
		});
	} finally {
		if (previous === undefined) {
			delete process.env.REACT_SSR;
		} else {
			process.env.REACT_SSR = previous;
		}
		vm.__vm_internals__ = previousInternals;
	}
});
