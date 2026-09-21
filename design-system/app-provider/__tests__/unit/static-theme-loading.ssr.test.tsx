/**
 * @jest-environment node
 */

import { ReadableStream } from 'node:stream/web';

import React from 'react';

import { renderToReadableStream, renderToString } from 'react-dom/server';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import StaticThemeLoadingSsrExample from '../../examples/static-theme-loading.ssr';

Object.assign(globalThis, { ReadableStream });

type ReactUse = <Value>(thenable: PromiseLike<Value>) => Value;

const reactUse = (React as { use?: ReactUse }).use;
const supportsReact19Streaming =
	typeof reactUse === 'function' && typeof renderToReadableStream === 'function';
const itWithReact19Streaming = supportsReact19Streaming ? it : it.skip;

async function readMarkup(
	stream: Awaited<ReturnType<typeof renderToReadableStream>>,
): Promise<string> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let markup = '';

	while (true) {
		const { done, value } = await reader.read();

		if (done) {
			return markup + decoder.decode();
		}

		markup += decoder.decode(value, { stream: true });
	}
}

function renderWithoutReactUse(): string {
	const useDescriptor = Object.getOwnPropertyDescriptor(React, 'use');

	if (useDescriptor) {
		Object.defineProperty(React, 'use', {
			...useDescriptor,
			value: undefined,
		});
	}

	try {
		return renderToString(<StaticThemeLoadingSsrExample />);
	} finally {
		if (useDescriptor) {
			Object.defineProperty(React, 'use', useDescriptor);
		}
	}
}

describe('platform-static-theme-loading', () => {
	itWithReact19Streaming('streams CSS for default and nested non-default themes', async () => {
		passGate('platform-static-theme-loading');
		passGate('platform-dst-tokens-finesse');

		const view = await renderToReadableStream(<StaticThemeLoadingSsrExample />);
		const markup = await readMarkup(view);

		expect(markup).toContain('data-theme="light"');
		expect(markup).toContain('data-theme="dark"');
		expect(markup).toContain('data-theme="UNSAFE-test-light"');
		expect(markup).toContain('data-theme="UNSAFE-test-dark"');
		expect(markup).toContain('data-theme="light-finesse"');
		expect(markup).toContain('data-theme="dark-finesse"');
		expect(markup).toContain('data-theme="typography-finesse"');
		expect(markup).toContain('Test theme — first region');
		expect(markup).toContain('Test theme — second independent region');

		// Each independently streamed nested region contains CSS before its content.
		const testThemeCssOccurrences = markup.match(/<style data-theme="UNSAFE-test-light">/g) ?? [];
		expect(testThemeCssOccurrences).toHaveLength(3);
	});

	it('keeps the existing SSR output when React use is unavailable', () => {
		passGate('platform-static-theme-loading');

		const view = renderWithoutReactUse();

		expect(view).not.toContain('<style data-theme=');
		expect(view).toContain('Test theme — first region');
	});

	it('keeps the existing SSR output when the gate is disabled', () => {
		failGate('platform-static-theme-loading');

		const view = renderToString(<StaticThemeLoadingSsrExample />);

		expect(view).not.toContain('<style data-theme=');
	});
});
