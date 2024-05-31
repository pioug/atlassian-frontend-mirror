import React from 'react';
import { render as renderToDOM } from 'react-dom';
import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { nextTick as flushLazyModuleFetching } from '@atlaskit/editor-test-helpers/next-tick';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockIntersectionObserver } from '@atlaskit/editor-test-helpers/mock-intersection-observer';

import { act } from 'react-dom/test-utils';
import WindowedCodeBlock from '../../../../react/nodes/codeBlock/windowedCodeBlock';
import { selectors } from '../../../__helpers/page-objects/_codeblock';

const textSample = 'const fn = () => {}';

const getLightWeightCodeBlock = () => document.querySelector(selectors.lightWeightCodeBlock);

const getAkCodeBlock = () => document.querySelector(selectors.designSystemCodeBlock);

const render = async (overrides = {}) => {
	const container = document.createElement('div');
	document.body.appendChild(container);
	if (process.env.IS_REACT_18 === 'true') {
		// @ts-ignore react-dom/client only available in react 18
		// eslint-disable-next-line import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
		const { createRoot } = await import('react-dom/client');
		const root = createRoot(container!);
		act(() => {
			root.render(
				<IntlProvider locale="en">
					<WindowedCodeBlock
						language="javascript"
						allowCopyToClipboard={false}
						text={textSample}
						codeBidiWarningTooltipEnabled={true}
						{...overrides}
					/>
				</IntlProvider>,
			);
		});
	} else {
		act(() => {
			renderToDOM(
				<IntlProvider locale="en">
					<WindowedCodeBlock
						language="javascript"
						allowCopyToClipboard={false}
						text={textSample}
						codeBidiWarningTooltipEnabled={true}
						{...overrides}
					/>
				</IntlProvider>,
				container,
			);
		});
	}

	return {
		cleanup: () => container.remove(),
	};
};

describe('Renderer - React/Nodes/WindowedCodeBlock', () => {
	// IntersectionObserver is an implementation detail of how WindowedCodeBlock
	// observes whether it is in the viewport or not. We mock it out here in jsdom
	// to control whether WindowedCodeBlock believes it's in the viewport for tests.
	const mockObserver = new MockIntersectionObserver();

	beforeAll(() => {
		mockObserver.setup();
	});
	afterAll(() => {
		mockObserver.cleanup();
	});

	describe('when not in viewport', () => {
		it('should render LightWeightCodeBlock and not render AkCodeBlock', async () => {
			const { cleanup } = await render();

			act(() => {
				mockObserver.triggerIntersect({ isIntersecting: false });
			});

			let lightWeightCodeBlock = getLightWeightCodeBlock();
			let akCodeBlock = getAkCodeBlock();

			expect(lightWeightCodeBlock).toBeTruthy();
			expect(lightWeightCodeBlock?.textContent).toBe(textSample);
			expect(akCodeBlock).toBeFalsy();

			flushLazyModuleFetching();

			// we expect the same set of render assertions to hold even after flushing any async work
			expect(lightWeightCodeBlock).toBeTruthy();
			expect(lightWeightCodeBlock?.textContent).toBe(textSample);
			expect(akCodeBlock).toBeFalsy();

			cleanup();
		});
	});

	describe('when in viewport', () => {
		it.skip('should initially render LightWeightCodeBlock and eventually render AkCodeBlock', async () => {
			const { cleanup } = await render();
			act(() => {
				mockObserver.triggerIntersect({ isIntersecting: true });
			});

			let lightWeightCodeBlock = getLightWeightCodeBlock();
			let akCodeBlock = getAkCodeBlock();
			expect(lightWeightCodeBlock).toBeTruthy();
			expect(lightWeightCodeBlock?.textContent).toBe(textSample);
			expect(akCodeBlock).toBeFalsy();

			await flushLazyModuleFetching();

			lightWeightCodeBlock = getLightWeightCodeBlock();
			akCodeBlock = getAkCodeBlock();
			expect(lightWeightCodeBlock).toBeFalsy();
			expect(akCodeBlock).toBeTruthy();
			const akGutterLineNumber = 1;
			expect(akCodeBlock?.textContent).toBe(`${akGutterLineNumber}${textSample}`);

			cleanup();
		});
	});

	describe("when transitioning from 'not in viewport' to 'in viewport'", () => {
		it.skip('should initially render LightWeightCodeBlock and eventually render AkCodeBlock', async () => {
			const { cleanup } = await render();

			act(() => {
				mockObserver.triggerIntersect({ isIntersecting: false });
			});

			let lightWeightCodeBlock = getLightWeightCodeBlock();
			let akCodeBlock = getAkCodeBlock();
			expect(lightWeightCodeBlock).toBeTruthy();
			expect(lightWeightCodeBlock?.textContent).toBe(textSample);
			expect(akCodeBlock).toBeFalsy();

			act(() => {
				mockObserver.triggerIntersect({ isIntersecting: true });
			});

			await flushLazyModuleFetching();

			lightWeightCodeBlock = getLightWeightCodeBlock();
			akCodeBlock = getAkCodeBlock();
			expect(lightWeightCodeBlock).toBeFalsy();
			expect(akCodeBlock).toBeTruthy();
			const akGutterLineNumber = 1;
			expect(akCodeBlock?.textContent).toBe(`${akGutterLineNumber}${textSample}`);

			cleanup();
		});
	});
});
