/**
 * @jest-environment node
 */
import React, { useRef } from 'react';

import { renderToString } from 'react-dom/server';

import { Dialog } from '../../src/dialog';
import { useCloseOnUnclaimedEscape } from '../../src/page-surface/use-close-on-unclaimed-escape';
import { Popover } from '../../src/popover';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

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

	it('renders an open manual popover and page surface with the Escape hooks', () => {
		function ManualPopoverAndSurface() {
			const popoverRef = useRef<HTMLDivElement>(null);
			const surfaceRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose: () => {} });
			useManualLightDismiss({
				popoverRef: surfaceRef,
				mode: 'page-surface',
				isOpen: true,
				onClose: () => {},
			});
			useCloseOnUnclaimedEscape({ isEnabled: true, onClose: () => {}, surfaceRef });
			return (
				<>
					<Popover ref={popoverRef} isOpen mode="manual" role="dialog" label="Popover">
						<div>Popover content</div>
					</Popover>
					<div ref={surfaceRef}>Surface content</div>
				</>
			);
		}

		const { html, consoleMessages } = renderOnServer(<ManualPopoverAndSurface />);

		expect(html).toContain('Popover content');
		expect(html).toContain('Surface content');
		expect(consoleMessages).toEqual([]);
	});
});
