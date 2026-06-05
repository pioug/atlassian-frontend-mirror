import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { isSSRStreaming } from '../is-ssr-streaming';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

const mockExpValEquals = expValEquals as jest.Mock;

const setSSRReactStreaming = (value: boolean) => {
	window.__SSR_REACT_STREAMING__ = value;
};

const setSSRRendered = (value: boolean) => {
	window.__SSR_RENDERED__ = value;
};

describe('isSSRStreaming', () => {
	const reactSSR = process.env.REACT_SSR;

	afterEach(() => {
		jest.clearAllMocks();
		delete window.__SSR_REACT_STREAMING__;
		delete window.__SSR_RENDERED__;
		process.env.REACT_SSR = reactSSR;
	});

	it('returns false without exposing the experiment when the page is not SSR rendered', () => {
		delete process.env.REACT_SSR;
		setSSRRendered(false);
		mockExpValEquals.mockReturnValue(true);
		setSSRReactStreaming(true);

		expect(isSSRStreaming()).toBe(false);
		expect(mockExpValEquals).not.toHaveBeenCalled();
	});

	it('returns false when SSR streaming experiment is disabled', () => {
		process.env.REACT_SSR = 'true';
		mockExpValEquals.mockReturnValue(false);
		setSSRReactStreaming(true);

		expect(isSSRStreaming()).toBe(false);
		expect(mockExpValEquals).toHaveBeenCalledWith(
			'platform_editor_editor_ssr_streaming',
			'isEnabled',
			true,
		);
	});

	it('returns false when SSR streaming is not active at runtime', () => {
		process.env.REACT_SSR = 'true';
		mockExpValEquals.mockReturnValue(true);
		setSSRReactStreaming(false);

		expect(isSSRStreaming()).toBe(false);
		expect(mockExpValEquals).toHaveBeenCalledWith(
			'platform_editor_editor_ssr_streaming',
			'isEnabled',
			true,
		);
	});

	it('returns true during server rendering when the experiment is enabled and SSR streaming is active at runtime', () => {
		process.env.REACT_SSR = 'true';
		mockExpValEquals.mockReturnValue(true);
		setSSRReactStreaming(true);

		expect(isSSRStreaming()).toBe(true);
		expect(mockExpValEquals).toHaveBeenCalledWith(
			'platform_editor_editor_ssr_streaming',
			'isEnabled',
			true,
		);
	});

	it('returns true during client hydration when the page was SSR rendered, the experiment is enabled, and SSR streaming is active at runtime', () => {
		delete process.env.REACT_SSR;
		setSSRRendered(true);
		mockExpValEquals.mockReturnValue(true);
		setSSRReactStreaming(true);

		expect(isSSRStreaming()).toBe(true);
		expect(mockExpValEquals).toHaveBeenCalledWith(
			'platform_editor_editor_ssr_streaming',
			'isEnabled',
			true,
		);
	});
});
