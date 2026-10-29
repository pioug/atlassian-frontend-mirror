import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import ForgeBodiedExtensionHandoff from '../../../../react/nodes/ForgeBodiedExtensionHandoff';

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
