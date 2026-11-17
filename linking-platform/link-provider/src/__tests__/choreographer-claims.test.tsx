import React from 'react';

import { envType } from '@atlassiansox/analytics-web-client/analytics-web-types';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';

import { ProductIds } from '@atlassian/ipm-choreographer/constants';
import { choreographerFactory } from '@atlassian/ipm-choreographer/factory';

import { ChoreographedContent } from '../choreographed-content';
import { createChoreographedContent } from '../create-choreographed-content';
import { SmartCardProvider } from '../smart-card-provider';

jest.mock('@atlassiansox/analytics-web-client/client', () => ({
	__esModule: true,
	default: jest.fn(() => ({ sendOperationalEvent: jest.fn() })),
}));

let host: ReturnType<typeof choreographerFactory>;
let other: ReturnType<typeof choreographerFactory>;
const unavailable = jest.fn();

beforeEach(() => {
	host = choreographerFactory(ProductIds.JIRA, envType.LOCAL);
	other = choreographerFactory(ProductIds.POST_OFFICE, envType.LOCAL);
	other.plugin.on('other-message', { start: () => true, stop: () => true });
	unavailable.mockReset();
});
afterEach(async () => {
	cleanup();
	await act(async () => {});
	host.plugin.destroy();
	other.plugin.destroy();
});

const TestChoreographer = createChoreographedContent(function useHostChoreographer(...args) {
	return host.useChoreographer(...args);
});
function claimedContent(shouldClaim: () => boolean, isActive = true) {
	return (
		<SmartCardProvider choreographer={TestChoreographer}>
			<ChoreographedContent
				isActive={isActive}
				messageId="claim-test"
				onUnavailable={unavailable}
				shouldClaim={shouldClaim}
			>
				{({ hasPermission }) => (hasPermission ? <div role="dialog">Modal</div> : null)}
			</ChoreographedContent>
		</SmartCardProvider>
	);
}

it.each(['declined', 'canceled', 'host-stopped'] as const)(
	'does not advance another pending offer when cleaning up a %s attempt',
	async (reason) => {
		let resolveFirst!: (started: boolean) => void;
		let resolveNext!: (started: boolean) => void;
		other.plugin.on('other-message', {
			start: () =>
				new Promise<boolean>((resolve) => {
					resolveFirst = resolve;
				}),
		});
		other.plugin.on('next-message', {
			start: () =>
				new Promise<boolean>((resolve) => {
					resolveNext = resolve;
				}),
			stop: () => true,
		});
		const lastStart = jest.fn(() => true);
		other.plugin.on('last-message', { start: lastStart, stop: () => true });
		const start = jest.spyOn(host.plugin, 'startMessage');
		const first = other.plugin.startMessage('other-message');
		const view = render(claimedContent(() => reason !== 'declined'));
		await act(async () => {});

		if (reason === 'host-stopped') {
			await act(async () => {
				resolveFirst(false);
				await first;
			});
			await screen.findByRole('dialog');
			await act(async () => {
				await host.plugin.stopMessage(start.mock.calls[0][0]);
			});
		} else if (reason === 'canceled') {
			view.rerender(claimedContent(() => true, false));
		}

		const next = other.plugin.startMessage('next-message');
		const last = other.plugin.startMessage('last-message');
		try {
			if (reason !== 'host-stopped') {
				await act(async () => {
					resolveFirst(false);
					await first;
				});
			}
			view.unmount();
			await act(async () => {});
			expect(lastStart).not.toHaveBeenCalled();
			await act(async () => {
				resolveNext(true);
				expect(await next).toBe('started');
				expect(await last).toBe('blocked');
			});
		} finally {
			resolveNext(false);
			await Promise.all([next, last]);
			await other.plugin.stopMessage('next-message');
			await other.plugin.stopMessage('last-message');
			start.mockRestore();
		}
	},
);

it('does not evaluate the claim predicate when blocked', async () => {
	await other.plugin.startMessage('other-message');
	const shouldClaim = jest.fn(() => true);
	render(claimedContent(shouldClaim));
	await waitFor(() => expect(unavailable).toHaveBeenCalledTimes(1));
	expect(shouldClaim).not.toHaveBeenCalled();
});

it.each(['control', 'error'])('declines %s without holding the slot', async (reason) => {
	const shouldClaim = jest.fn(() => {
		if (reason === 'error') {
			throw new Error('evaluation failed');
		}
		return false;
	});
	render(claimedContent(shouldClaim));
	await waitFor(() => expect(unavailable).toHaveBeenCalledTimes(1));
	expect(shouldClaim).toHaveBeenCalledTimes(1);
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	expect(await other.plugin.startMessage('other-message')).toBe('started');
});

it('uses the latest predicate at a delayed offer without restarting the request', async () => {
	let resolveFirst!: (value: boolean) => void;
	other.plugin.on('other-message', {
		start: () =>
			new Promise<boolean>((resolve) => {
				resolveFirst = resolve;
			}),
	});
	const pending = other.plugin.startMessage('other-message');
	const start = jest.spyOn(host.plugin, 'startMessage');
	const original = jest.fn(() => true);
	const latest = jest.fn(() => false);
	const view = render(claimedContent(original));
	await act(async () => {});
	view.rerender(claimedContent(latest));
	await act(async () => {
		resolveFirst(false);
		await pending;
	});
	await waitFor(() => expect(unavailable).toHaveBeenCalledTimes(1));
	expect(start).toHaveBeenCalledTimes(1);
	expect(original).not.toHaveBeenCalled();
	expect(latest).toHaveBeenCalledTimes(1);
	start.mockRestore();
});

it('does not evaluate a canceled delayed claim', async () => {
	let resolveFirst!: (value: boolean) => void;
	other.plugin.on('other-message', {
		start: () =>
			new Promise<boolean>((resolve) => {
				resolveFirst = resolve;
			}),
	});
	const pending = other.plugin.startMessage('other-message');
	const shouldClaim = jest.fn(() => true);
	const view = render(claimedContent(shouldClaim));
	await act(async () => {});
	view.unmount();
	await act(async () => {
		resolveFirst(false);
		await pending;
	});
	expect(shouldClaim).not.toHaveBeenCalled();
	expect(unavailable).not.toHaveBeenCalled();
});

it('hides queued content when the existing host timeout revokes permission', async () => {
	jest.useFakeTimers();
	try {
		let resolveFirst!: (value: boolean) => void;
		other.plugin.on('other-message', {
			start: () =>
				new Promise<boolean>((resolve) => {
					resolveFirst = resolve;
				}),
		});
		const pending = other.plugin.startMessage('other-message');
		const shouldClaim = jest.fn(() => true);
		const view = render(claimedContent(shouldClaim));
		await act(async () => {});
		expect(shouldClaim).not.toHaveBeenCalled();
		await act(async () => {
			resolveFirst(false);
			await pending;
		});
		await screen.findByRole('dialog');
		await act(async () => {
			await jest.advanceTimersByTimeAsync(6 * 60 * 1000);
		});
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(unavailable).toHaveBeenCalledTimes(1);
		other.plugin.on('next-message', { start: () => true, stop: () => true });
		expect(await other.plugin.startMessage('next-message')).toBe('started');
		view.unmount();
		await act(async () => {});
	} finally {
		jest.useRealTimers();
	}
});
