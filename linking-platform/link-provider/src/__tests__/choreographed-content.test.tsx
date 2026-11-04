import React, { StrictMode } from 'react';

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

function content(isActive = true, messageId = 'experiment-a') {
	return (
		<SmartCardProvider choreographer={TestChoreographer}>
			<ChoreographedContent isActive={isActive} messageId={messageId} onUnavailable={unavailable}>
				{({ hasPermission }) => (
					<>
						<button>Inline action</button>
						{hasPermission && <div role="dialog">Spotlight</div>}
					</>
				)}
			</ChoreographedContent>
		</SmartCardProvider>
	);
}

it('does not show while another product message owns the slot', async () => {
	await other.plugin.startMessage('other-message');
	render(content());
	await waitFor(() => expect(unavailable).toHaveBeenCalledTimes(1));
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	expect(screen.getByRole('button')).toBeInTheDocument();
});

it.each(['deactivate', 'unmount'] as const)(
	'claims exclusively and releases on %s',
	async (action) => {
		const view = render(content());
		await screen.findByRole('dialog');
		await act(async () => {
			expect(await other.plugin.startMessage('other-message')).toBe('blocked');
		});
		if (action === 'unmount') view.unmount();
		else view.rerender(content(false));
		await act(async () => {});
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(await other.plugin.startMessage('other-message')).toBe('started');
		expect(unavailable).not.toHaveBeenCalled();
	},
);

it('keeps callbacks and the active request stable while using the latest unavailable handler', async () => {
	const start = jest.spyOn(host.plugin, 'startMessage');
	const stop = jest.spyOn(host.plugin, 'stopMessage');
	const observeCallbacks = jest.fn();
	const StableChoreographer = createChoreographedContent(function useHostChoreographer(...args) {
		observeCallbacks(args[1]);
		return host.useChoreographer(...args);
	});
	const latestUnavailable = jest.fn();
	const renderContent = (onUnavailable: () => void) => (
		<StableChoreographer isActive messageId="stable-experiment" onUnavailable={onUnavailable}>
			{({ hasPermission }) => (hasPermission ? <div role="dialog">Spotlight</div> : null)}
		</StableChoreographer>
	);
	const view = render(renderContent(unavailable));
	await screen.findByRole('dialog');
	const callbacks = observeCallbacks.mock.calls[0][0];

	await act(async () => {
		view.rerender(renderContent(latestUnavailable));
	});
	for (const [received] of observeCallbacks.mock.calls) {
		expect(received).toBe(callbacks);
	}
	expect(start).toHaveBeenCalledTimes(1);
	expect(stop).not.toHaveBeenCalled();
	expect(screen.getByRole('dialog')).toBeInTheDocument();

	await act(async () => {
		await host.plugin.stopMessage(start.mock.calls[0][0]);
	});
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	expect(latestUnavailable).toHaveBeenCalledTimes(1);
	expect(unavailable).not.toHaveBeenCalled();
});

it('can reuse the mechanism for another experiment', async () => {
	const view = render(content());
	await screen.findByRole('dialog');
	view.rerender(content(false));
	await act(async () => {});
	view.rerender(content(true, 'experiment-b'));
	await screen.findByRole('dialog');
	expect(await other.plugin.startMessage('other-message')).toBe('blocked');
});

it.each(['deactivate', 'unmount'] as const)('declines a delayed offer after %s', async (action) => {
	let resolveFirst!: (started: boolean) => void;
	other.plugin.on('other-message', {
		start: () =>
			new Promise<boolean>((resolve) => {
				resolveFirst = resolve;
			}),
	});
	const pending = other.plugin.startMessage('other-message');
	const view = render(content());
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	if (action === 'unmount') view.unmount();
	else view.rerender(content(false));
	await act(async () => {
		resolveFirst(false);
		await pending;
	});
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	other.plugin.on('other-message', { start: () => true, stop: () => true });
	expect(await other.plugin.startMessage('other-message')).toBe('started');
});

it('does not collide when two instances use the same experiment ID', async () => {
	render(
		<>
			{content()}
			{content()}
		</>,
	);
	await screen.findByRole('dialog');
	await waitFor(() => expect(unavailable).toHaveBeenCalledTimes(1));
	expect(screen.getAllByRole('dialog')).toHaveLength(1);
});

it('does not leave a slot claimed during Strict Mode effect replay', async () => {
	const view = render(<StrictMode>{content()}</StrictMode>);
	await screen.findByRole('dialog');
	view.unmount();
	await act(async () => {});
	expect(await other.plugin.startMessage('other-message')).toBe('started');
});

it('keeps permission for the visible popup until closed, and responds to a host stop', async () => {
	jest.useFakeTimers();
	const start = jest.spyOn(host.plugin, 'startMessage');
	try {
		render(content());
		await screen.findByRole('dialog');
		await act(async () => {
			jest.advanceTimersByTime(5 * 60 * 1000);
		});
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(await other.plugin.startMessage('other-message')).toBe('blocked');
		await act(async () => {
			await host.plugin.stopMessage(start.mock.calls[0][0]);
		});
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(unavailable).toHaveBeenCalledTimes(1);
		expect(await other.plugin.startMessage('other-message')).toBe('started');
	} finally {
		jest.useRealTimers();
		start.mockRestore();
	}
});

it('fails closed without a host while keeping the inline action', () => {
	render(
		<SmartCardProvider>
			<ChoreographedContent isActive messageId="a" onUnavailable={unavailable}>
				{({ hasPermission }) => (
					<>
						<button>Inline action</button>
						{hasPermission && <div role="dialog" />}
					</>
				)}
			</ChoreographedContent>
		</SmartCardProvider>,
	);
	expect(unavailable).toHaveBeenCalledTimes(1);
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	expect(screen.getByRole('button')).toBeInTheDocument();
});

it('does not repeat missing-host notifications when the callback changes', () => {
	const latestUnavailable = jest.fn();
	const withoutHost = (isActive: boolean, onUnavailable: () => void) => (
		<SmartCardProvider>
			<ChoreographedContent isActive={isActive} messageId="a" onUnavailable={onUnavailable}>
				{() => null}
			</ChoreographedContent>
		</SmartCardProvider>
	);
	const view = render(withoutHost(true, unavailable));
	expect(unavailable).toHaveBeenCalledTimes(1);

	view.rerender(withoutHost(true, latestUnavailable));
	expect(latestUnavailable).not.toHaveBeenCalled();

	view.rerender(withoutHost(false, latestUnavailable));
	expect(latestUnavailable).not.toHaveBeenCalled();
	view.rerender(withoutHost(true, latestUnavailable));
	expect(latestUnavailable).toHaveBeenCalledTimes(1);
	expect(unavailable).toHaveBeenCalledTimes(1);
});

it('can cancel and immediately request again while the first offer is pending', async () => {
	let resolveFirst!: (started: boolean) => void;
	other.plugin.on('other-message', {
		start: () =>
			new Promise<boolean>((resolve) => {
				resolveFirst = resolve;
			}),
	});
	const pending = other.plugin.startMessage('other-message');
	const view = render(content());
	await act(async () => {});
	view.rerender(content(false));
	view.rerender(content(true));
	await act(async () => {
		resolveFirst(false);
		await pending;
	});
	await screen.findByRole('dialog');
	expect(unavailable).not.toHaveBeenCalled();
	other.plugin.on('other-message', { start: () => true, stop: () => true });
	expect(await other.plugin.startMessage('other-message')).toBe('blocked');
	view.unmount();
	await act(async () => {});
	expect(await other.plugin.startMessage('other-message')).toBe('started');
});

it('fails closed on a rejected request and attempts release', async () => {
	const stopMessage = jest.fn().mockResolvedValue('stopped');
	const controls = {
		startMessage: jest.fn().mockRejectedValue(new Error('unavailable')),
		stopMessage,
	};
	const FailedChoreographer = createChoreographedContent(function useFailedChoreographer() {
		return controls;
	});

	render(
		<SmartCardProvider choreographer={FailedChoreographer}>
			<ChoreographedContent isActive messageId="failed" onUnavailable={unavailable}>
				{({ hasPermission }) => (
					<>
						<button>Inline action</button>
						{hasPermission && <div role="dialog" />}
					</>
				)}
			</ChoreographedContent>
		</SmartCardProvider>,
	);
	await waitFor(() => expect(unavailable).toHaveBeenCalledTimes(1));
	expect(stopMessage).toHaveBeenCalled();
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	expect(screen.getByRole('button')).toBeInTheDocument();
});
