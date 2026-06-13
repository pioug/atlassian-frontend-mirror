import React from 'react';

import { fireEvent, render } from '@atlassian/testing-library';

import { getAnchorAttributesFromEvent, updateAnchorHref } from '../click-helpers';

const RESOLVED_HREF = 'https://example.com/';

describe('getAnchorAttributesFromEvent', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<a href="https://example.com" target="_blank">
				link
			</a>,
		);
		await expect(container).toBeAccessible();
	});

	describe('when currentTarget is an anchor element', () => {
		it('returns href and target from the anchor', () => {
			let result: ReturnType<typeof getAnchorAttributesFromEvent> | undefined;

			const { getByRole } = render(
				<a
					href="https://example.com"
					target="_blank"
					onClick={(event) => {
						result = getAnchorAttributesFromEvent(event);
					}}
				>
					link
				</a>,
			);

			fireEvent.click(getByRole('link'));

			expect(result).toEqual({
				href: RESOLVED_HREF,
				target: '_blank',
			});
		});

		it('falls back to _self when anchor has no explicit target', () => {
			let result: ReturnType<typeof getAnchorAttributesFromEvent> | undefined;

			const { getByRole } = render(
				<a
					href="https://example.com"
					onClick={(event) => {
						result = getAnchorAttributesFromEvent(event);
					}}
				>
					link
				</a>,
			);

			fireEvent.click(getByRole('link'));

			expect(result).toEqual({
				href: RESOLVED_HREF,
				target: '_self',
			});
		});

		it('falls back to _self when anchor target is an empty string', () => {
			let result: ReturnType<typeof getAnchorAttributesFromEvent> | undefined;

			const { getByRole } = render(
				<a
					href="https://example.com"
					target=""
					onClick={(event) => {
						result = getAnchorAttributesFromEvent(event);
					}}
				>
					link
				</a>,
			);

			fireEvent.click(getByRole('link'));

			expect(result).toEqual({
				href: RESOLVED_HREF,
				target: '_self',
			});
		});
	});

	describe('when currentTarget is not an anchor element', () => {
		it('returns undefined href and _self target for a button', () => {
			let result: ReturnType<typeof getAnchorAttributesFromEvent> | undefined;

			const { getByRole } = render(
				<button
					onClick={(event) => {
						result = getAnchorAttributesFromEvent(event);
					}}
				>
					click me
				</button>,
			);

			fireEvent.click(getByRole('button'));

			expect(result).toEqual({
				href: undefined,
				target: '_self',
			});
		});

		it('returns undefined href and _self target for a div', () => {
			let result: ReturnType<typeof getAnchorAttributesFromEvent> | undefined;

			const { getByRole } = render(
				<div
					role="presentation"
					onClick={(event) => {
						result = getAnchorAttributesFromEvent(event);
					}}
				>
					click me
				</div>,
			);

			fireEvent.click(getByRole('presentation'));

			expect(result).toEqual({
				href: undefined,
				target: '_self',
			});
		});
	});

	describe('when triggered by a keyboard event', () => {
		it('returns href and target from anchor on keyboard event', () => {
			let result: ReturnType<typeof getAnchorAttributesFromEvent> | undefined;

			const { getByRole } = render(
				<a
					href="https://example.com"
					target="_blank"
					onKeyDown={(event) => {
						result = getAnchorAttributesFromEvent(event);
					}}
				>
					link
				</a>,
			);

			fireEvent.keyDown(getByRole('link'), { key: 'Enter' });

			expect(result).toEqual({
				href: RESOLVED_HREF,
				target: '_blank',
			});
		});

		it('returns undefined href and _self for a non-anchor on keyboard event', () => {
			let result: ReturnType<typeof getAnchorAttributesFromEvent> | undefined;

			const { getByRole } = render(
				<button
					onKeyDown={(event) => {
						result = getAnchorAttributesFromEvent(event);
					}}
				>
					click me
				</button>,
			);

			fireEvent.keyDown(getByRole('button'), { key: 'Enter' });

			expect(result).toEqual({
				href: undefined,
				target: '_self',
			});
		});
	});
});

describe('updateAnchorHref', () => {
	const DECORATED_HREF = 'https://example.com/?xpis=wrapped';

	describe('when currentTarget is an anchor element', () => {
		it('updates the anchor href to the provided decorated URL on click', () => {
			const { getByRole } = render(
				<a
					href="https://example.com"
					onClick={(event) => {
						updateAnchorHref(event, DECORATED_HREF);
					}}
				>
					link
				</a>,
			);

			const anchor = getByRole('link') as HTMLAnchorElement;
			expect(anchor.href).toBe(RESOLVED_HREF);

			fireEvent.click(anchor);

			expect(anchor.href).toBe(DECORATED_HREF);
		});

		it('updates the anchor href to the provided decorated URL on middle-click (auxclick)', () => {
			const { getByRole } = render(
				<a
					href="https://example.com"
					onAuxClick={(event) => {
						updateAnchorHref(event, DECORATED_HREF);
					}}
				>
					link
				</a>,
			);

			const anchor = getByRole('link') as HTMLAnchorElement;
			expect(anchor.href).toBe(RESOLVED_HREF);

			fireEvent(anchor, new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }));

			expect(anchor.href).toBe(DECORATED_HREF);
		});

		it('updates the anchor href to the provided decorated URL on right-click (contextmenu)', () => {
			const { getByRole } = render(
				<a
					href="https://example.com"
					onContextMenu={(event) => {
						updateAnchorHref(event, DECORATED_HREF);
					}}
				>
					link
				</a>,
			);

			const anchor = getByRole('link') as HTMLAnchorElement;
			expect(anchor.href).toBe(RESOLVED_HREF);

			fireEvent.contextMenu(anchor);

			expect(anchor.href).toBe(DECORATED_HREF);
		});

		it('updates the anchor href on keyboard event (Enter key)', () => {
			const { getByRole } = render(
				<a
					href="https://example.com"
					onKeyDown={(event) => {
						updateAnchorHref(event, DECORATED_HREF);
					}}
				>
					link
				</a>,
			);

			const anchor = getByRole('link') as HTMLAnchorElement;
			expect(anchor.href).toBe(RESOLVED_HREF);

			fireEvent.keyDown(anchor, { key: 'Enter' });

			expect(anchor.href).toBe(DECORATED_HREF);
		});
	});

	describe('when currentTarget is not an anchor element', () => {
		it('does nothing when currentTarget is a button', () => {
			const mockHandler = jest.fn((event: React.MouseEvent<HTMLButtonElement>) => {
				updateAnchorHref(event as unknown as React.MouseEvent, DECORATED_HREF);
			});

			const { getByRole } = render(<button onClick={mockHandler}>click me</button>);

			// Should not throw
			fireEvent.click(getByRole('button'));

			expect(mockHandler).toHaveBeenCalledTimes(1);
		});

		it('does nothing when currentTarget is a div', () => {
			const mockHandler = jest.fn((event: React.MouseEvent<HTMLDivElement>) => {
				updateAnchorHref(event as unknown as React.MouseEvent, DECORATED_HREF);
			});

			const { getByRole } = render(
				<div role="presentation" onClick={mockHandler}>
					click me
				</div>,
			);

			// Should not throw
			fireEvent.click(getByRole('presentation'));

			expect(mockHandler).toHaveBeenCalledTimes(1);
		});
	});

	describe('when called multiple times', () => {
		it('overwrites the href with the latest decorated URL on repeated clicks', () => {
			let callCount = 0;
			const { getByRole } = render(
				<a
					href="https://example.com"
					onClick={(event) => {
						callCount++;
						updateAnchorHref(event, `${DECORATED_HREF}&count=${callCount}`);
					}}
				>
					link
				</a>,
			);

			const anchor = getByRole('link') as HTMLAnchorElement;

			fireEvent.click(anchor);
			expect(anchor.href).toBe(`${DECORATED_HREF}&count=1`);

			fireEvent.click(anchor);
			expect(anchor.href).toBe(`${DECORATED_HREF}&count=2`);
		});
	});
});
