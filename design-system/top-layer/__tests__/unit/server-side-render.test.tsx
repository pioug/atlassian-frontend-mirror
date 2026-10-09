/**
 * @jest-environment node
 */
import React from 'react';

import { renderToString } from 'react-dom/server';

import { Dialog } from '../../src/dialog';
import { Popover } from '../../src/popover';

/**
 * The `node` environment has no DOM globals, as in a real server render.
 * React 18 logs "useLayoutEffect does nothing on the server" for every
 * layout effect, so this also guards against a bare `useLayoutEffect`.
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

describe('top-layer on the server', () => {
	it('renders an open Popover without console output', () => {
		const { html, consoleMessages } = renderOnServer(
			<Popover isOpen mode="manual" role="dialog" label="Popover">
				<div>Popover content</div>
			</Popover>,
		);

		expect(html).toContain('Popover content');
		expect(consoleMessages).toEqual([]);
	});

	it('renders a closed Popover without console output', () => {
		const { consoleMessages } = renderOnServer(
			<Popover isOpen={false} mode="manual" role="dialog" label="Popover">
				<div>Popover content</div>
			</Popover>,
		);

		expect(consoleMessages).toEqual([]);
	});

	it('renders Dialog without console output', () => {
		const { html, consoleMessages } = renderOnServer(
			<Dialog isOpen onClose={() => {}} label="Dialog">
				<div>Dialog content</div>
			</Dialog>,
		);

		expect(html).toContain('<dialog');
		expect(consoleMessages).toEqual([]);
	});
});
