/**
 * @jest-environment node
 */
import React from 'react';

import type { VirtualElement } from '@popperjs/core';
import { renderToString } from 'react-dom/server';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { Manager } from '../../manager';
import { Popper } from '../../popper';
import { Reference } from '../../reference';

/**
 * The `node` environment has no DOM globals (`HTMLElement`, `window`,
 * `document`), so a render-time DOM access throws here as it does in a real
 * server render.
 */
function renderOnServer(element: React.ReactElement): {
	html: string;
	consoleMessages: string[];
} {
	const consoleMessages: string[] = [];
	const record = (...args: unknown[]) => {
		consoleMessages.push(args.map(String).join(' '));
	};
	const errorSpy = jest.spyOn(console, 'error').mockImplementation(record);
	const warnSpy = jest.spyOn(console, 'warn').mockImplementation(record);
	try {
		return { html: renderToString(element), consoleMessages };
	} finally {
		errorSpy.mockRestore();
		warnSpy.mockRestore();
	}
}

const virtualReference: VirtualElement = {
	getBoundingClientRect: () => ({
		width: 0,
		height: 0,
		x: 10,
		y: 10,
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
		toJSON: () => ({}),
	}),
};

describe('Popper top-layer path on the server', () => {
	it('renders without a reference element', () => {
		passGate('platform-dst-top-layer');

		const { html, consoleMessages } = renderOnServer(
			<Popper>{() => <div>Popper content</div>}</Popper>,
		);

		// No reference means the popper is closed, so nothing renders.
		expect(html).toBe('');
		expect(consoleMessages).toEqual([]);
	});

	it('renders with a reference element', () => {
		passGate('platform-dst-top-layer');

		const { html, consoleMessages } = renderOnServer(
			<Popper referenceElement={virtualReference}>{() => <div>Popper content</div>}</Popper>,
		);

		expect(html).toContain('Popper content');
		expect(consoleMessages).toEqual([]);
	});

	it('renders inside a Manager with a Reference', () => {
		passGate('platform-dst-top-layer');

		const { html, consoleMessages } = renderOnServer(
			<Manager>
				<Reference>{({ ref }) => <button ref={ref}>Reference</button>}</Reference>
				<Popper>{() => <div>Popper content</div>}</Popper>
			</Manager>,
		);

		expect(html).toContain('Reference');
		expect(consoleMessages).toEqual([]);
	});
});
