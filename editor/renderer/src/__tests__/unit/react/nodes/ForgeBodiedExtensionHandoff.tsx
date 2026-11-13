import React, { useContext, useEffect } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import ForgeBodiedExtensionHandoff from '../../../../react/nodes/ForgeBodiedExtensionHandoff';
import { ForgeBodiedExtensionHandoffReadyContext } from '../../../../react/nodes/forgeBodiedExtensionHandoffContext';

describe('Forge bodied extension handoff', () => {
	beforeEach(() => jest.useFakeTimers());
	afterEach(() => jest.useRealTimers());

	const fallback = <p>Native table</p>;
	const app = <button>Filter table</button>;
	const notifyReady = (localId = 'table', origin = window.location.origin) => {
		act(() => {
			window.dispatchEvent(
				new MessageEvent('message', {
					source: window,
					origin,
					data: { source: 'forge-extension', type: 'EXTENSION_READY', localId },
				}),
			);
		});
	};

	it('keeps the native body visible before the app mounts, then hides only the reservation', () => {
		const { rerender } = render(
			<ForgeBodiedExtensionHandoff localId="table" fallback={fallback} result={null} />,
		);
		expect(screen.getByText('Native table').parentElement).not.toHaveAttribute('aria-hidden');
		rerender(<ForgeBodiedExtensionHandoff localId="table" fallback={fallback} result={app} />);
		expect(screen.getByText('Native table').parentElement).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByRole('button', { name: 'Filter table' })).toBeVisible();
		notifyReady();
		expect(screen.queryByText('Native table')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Filter table' })).toBeVisible();
	});

	it('suppresses only the initial bridge fallback and restores later fallbacks', () => {
		const view = (result: React.ReactNode) => (
			<ForgeBodiedExtensionHandoff
				localId="table"
				fallback={fallback}
				result={result}
				suppressInitialFallback
			/>
		);
		const { rerender } = render(view(null));
		expect(screen.queryByText('Native table')).not.toBeInTheDocument();
		rerender(view(app));
		const button = screen.getByRole('button', { name: 'Filter table' });
		expect(screen.queryByText('Native table')).not.toBeInTheDocument();
		notifyReady();
		expect(screen.getByRole('button', { name: 'Filter table' })).toBe(button);
		rerender(view(null));
		expect(screen.getByText('Native table')).toBeVisible();
	});

	it('ignores other app instances and foreign origins', () => {
		render(<ForgeBodiedExtensionHandoff localId="table" fallback={fallback} result={app} />);
		notifyReady('other');
		notifyReady('table', 'https://other.example');
		expect(screen.getByText('Native table')).toBeInTheDocument();
	});

	it('bounds the reservation when the app never reports ready', () => {
		render(<ForgeBodiedExtensionHandoff localId="table" fallback={fallback} result={app} />);
		act(() => jest.advanceTimersByTime(30000));
		expect(screen.queryByText('Native table')).not.toBeInTheDocument();
		expect(screen.getByRole('button')).toBeVisible();
	});

	it('does not expire native content while waiting for a renderer', () => {
		render(<ForgeBodiedExtensionHandoff localId="table" fallback={fallback} result={null} />);
		act(() => jest.advanceTimersByTime(60000));
		expect(screen.getByText('Native table')).toBeInTheDocument();
	});

	it('exposes only the interactive app to assistive technology after handoff', async () => {
		const { container } = render(
			<ForgeBodiedExtensionHandoff localId="table" fallback={fallback} result={app} />,
		);
		await expect(container).toBeAccessible();
	});

	it('cleans up its timeout when unmounted', () => {
		const { unmount } = render(
			<ForgeBodiedExtensionHandoff localId="table" fallback={fallback} result={app} />,
		);
		unmount();
		expect(jest.getTimerCount()).toBe(0);
	});
});

describe('UI Kit SSR handoff', () => {
	beforeEach(() => jest.useFakeTimers());
	afterEach(() => jest.useRealTimers());
	const Client = ({ ready = false, localId = 'macro' }: { localId?: string; ready?: boolean }) => {
		const notify = useContext(ForgeBodiedExtensionHandoffReadyContext);
		useEffect(() => {
			if (ready && notify?.localId === localId) {
				notify.onReady();
			}
		}, [notify, ready, localId]);
		return ready ? <button>Client body</button> : null;
	};
	const view = (result: React.ReactNode) => (
		<ForgeBodiedExtensionHandoff
			localId="macro"
			preserveContentUntilReady
			fallback={<p>Server body</p>}
			result={result}
		/>
	);

	it('keeps native content visible through a null renderer and loader until the matching client commits', async () => {
		const { rerender, container } = render(view(null));
		const body = screen.getByText('Server body');
		rerender(view(<Client />));
		expect(body).toBeVisible();
		rerender(view(<div>Loading</div>));
		expect(body).toBeVisible();
		expect(screen.getByText('Loading')).not.toBeVisible();
		rerender(view(<Client ready localId="another-instance" />));
		expect(body).toBeVisible();
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		rerender(view(<Client ready />));
		expect(body).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Client body' })).toBeVisible();
		await expect(container).toBeAccessible();
	});

	it('suppresses the raw body through UI Kit readiness and restores later fallbacks', () => {
		const view = (result: React.ReactNode) => (
			<ForgeBodiedExtensionHandoff
				localId="macro"
				preserveContentUntilReady
				suppressInitialFallback
				fallback={<p>Server body</p>}
				result={result}
			/>
		);
		const { rerender } = render(view(null));
		expect(screen.queryByText('Server body')).not.toBeInTheDocument();
		rerender(view(<Client />));
		expect(screen.queryByText('Server body')).not.toBeInTheDocument();
		rerender(view(<Client ready />));
		expect(screen.getByRole('button', { name: 'Client body' })).toBeVisible();
		expect(screen.queryByText('Server body')).not.toBeInTheDocument();
		rerender(view(null));
		expect(screen.getByText('Server body')).toBeVisible();
	});

	it('does not bind a bridge listener or release on its message when waiting for a commit', () => {
		const addEventListener = jest.spyOn(window, 'addEventListener');
		render(view(<Client />));
		expect(addEventListener.mock.calls.some(([type]) => type === 'message')).toBe(false);
		addEventListener.mockRestore();
		act(() =>
			window.dispatchEvent(
				new MessageEvent('message', {
					source: window,
					origin: window.location.origin,
					data: { source: 'forge-extension', type: 'EXTENSION_READY', localId: 'macro' },
				}),
			),
		);
		expect(screen.getByText('Server body')).toBeVisible();
	});

	it('releases the client on timeout if rendering fails or the app intentionally stays empty', () => {
		render(view(<div>App failed</div>));
		act(() => jest.advanceTimersByTime(30000));
		expect(screen.queryByText('Server body')).not.toBeInTheDocument();
		expect(screen.getByText('App failed')).toBeVisible();
	});
});
