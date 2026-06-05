import React from 'react';

import { fireEvent, render } from '@atlassian/testing-library';

import { getAnchorAttributesFromEvent } from '../click-helpers';

const RESOLVED_HREF = 'https://example.com/';

describe('getAnchorAttributesFromEvent', () => {

	it('should capture and report a11y violations', async () => {
		const { container } = render(<a
			href="https://example.com"
			target="_blank"
		>
			link
		</a>);
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
