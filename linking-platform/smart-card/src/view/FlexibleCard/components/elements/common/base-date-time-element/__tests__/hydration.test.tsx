import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';

import BaseDateTimeElement from '../index';

describe('date hydration', () => {
	const date = new Date('2025-08-18T00:30:00Z');

	it.each([
		{ timeZoneGate: false, timeZone: undefined, expected: 'Aug 17, 2025' },
		{ timeZoneGate: false, timeZone: 'UTC', expected: 'Aug 17, 2025' },
		{ timeZoneGate: true, timeZone: undefined, expected: 'Aug 17, 2025' },
		{ timeZoneGate: true, timeZone: 'invalid/timezone', expected: 'Aug 17, 2025' },
		{ timeZoneGate: true, timeZone: 'UTC', expected: 'Aug 18, 2025' },
		{ timeZoneGate: true, timeZone: 'Asia/Tokyo', expected: 'Aug 18, 2025' },
	])(
		'localizes after hydration: timezone=$timeZone, override enabled=$timeZoneGate',
		async ({ timeZoneGate, timeZone, expected }) => {
			mockExpEnabled('platform_sl_hydration_safe_content');
			if (timeZoneGate) {
				passGate('dfo_issue_view_remote_data_srr_group');
			} else {
				failGate('dfo_issue_view_remote_data_srr_group');
			}
			const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
			const onRecoverableError = jest.fn();
			const now = jest
				.spyOn(Date, 'now')
				.mockReturnValue(new Date('2026-10-30T12:00:00Z').getTime());
			const container = document.createElement('div');
			let root: ReturnType<typeof hydrateRoot> | undefined;
			// Created, modified, and sent dates share this formatting path.
			const content = (
				<>
					<BaseDateTimeElement date={date} type="created" timeZone={timeZone} />
					<BaseDateTimeElement
						date={date}
						type="modified"
						timeZone={timeZone}
						text="Last commit on"
					/>
					<BaseDateTimeElement date={date} type="sent" timeZone={timeZone} hideDatePrefix />
				</>
			);
			try {
				container.innerHTML = renderToString(
					<IntlProvider locale="en" timeZone="UTC">
						{content}
					</IntlProvider>,
				);
				expect(container.textContent).toContain('Aug 18, 2025');
				const serverElements = Array.from(
					container.querySelectorAll('[data-smart-element-date-time]'),
				);
				await act(async () => {
					root = hydrateRoot(
						container,
						<IntlProvider locale="en" timeZone="America/Los_Angeles">
							{content}
						</IntlProvider>,
						{ onRecoverableError },
					);
				});
				const elements = container.querySelectorAll('[data-smart-element-date-time]');
				serverElements.forEach((element, index) => {
					expect(elements[index]).toBe(element);
				});
				expect(elements[0]).toHaveTextContent(`Created on ${expected}`);
				expect(elements[1]).toHaveTextContent(`Last commit on ${expected}`);
				expect(elements[2]).toHaveTextContent(expected);
				expect(onRecoverableError).not.toHaveBeenCalled();
				expect(consoleError).not.toHaveBeenCalled();
			} finally {
				act(() => root?.unmount());
				consoleError.mockRestore();
				now.mockRestore();
			}
		},
	);

	it('does not depend on a shared server/browser clock for recent dates', async () => {
		mockExpEnabled('platform_sl_hydration_safe_content');
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		const onRecoverableError = jest.fn();
		const now = jest.spyOn(Date, 'now').mockReturnValue(date.getTime() + 30_000);
		const container = document.createElement('div');
		const content = (
			<IntlProvider locale="en">
				<BaseDateTimeElement date={date} type="modified" />
			</IntlProvider>
		);
		let root: ReturnType<typeof hydrateRoot> | undefined;
		try {
			container.innerHTML = renderToString(content);
			expect(container.textContent).toContain('Updated on Aug 18, 2025');
			// The browser starts hydration later; it would select a different relative-time unit.
			now.mockReturnValue(date.getTime() + 120_000);
			await act(async () => {
				root = hydrateRoot(container, content, { onRecoverableError });
			});
			expect(container.textContent).toContain('Updated 2 minutes ago');
			expect(onRecoverableError).not.toHaveBeenCalled();
			expect(consoleError).not.toHaveBeenCalled();
		} finally {
			act(() => root?.unmount());
			consoleError.mockRestore();
			now.mockRestore();
		}
	});
});
