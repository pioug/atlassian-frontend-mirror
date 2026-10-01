import React, { type ComponentType, type ReactNode } from 'react';

import { act, render, screen } from '@testing-library/react';

const mockStart = jest.fn();
const mockGetObserver = jest.fn();

jest.mock('../../src/internals/global', () => ({
	getGlobalEditorMetricsObserver: (...args: unknown[]) => mockGetObserver(...args),
}));

let wbWithEditorMetrics: typeof import('../../examples/testing/wb-with-editor-metrics').wbWithEditorMetrics;

beforeEach(() => {
	mockStart.mockReset();
	mockGetObserver.mockReset().mockReturnValue({ start: mockStart });
	// Reset the adapter's once-per-document state without resetting React/RTL.
	jest.isolateModules(() => {
		({ wbWithEditorMetrics } = require('../../examples/testing/wb-with-editor-metrics'));
	});
});

// eslint-disable-next-line @repo/internal/react/no-class-components -- React requires a class to catch render/lazy errors.
class ErrorBoundary extends React.Component<{ children: ReactNode }, { error: Error | null }> {
	state = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		const error = this.state.error as Error | null;
		return error ? <div role="alert">{error.message}</div> : this.props.children;
	}
}

it('does not initialize metrics or load the example when declaring an entry', () => {
	const loadExample = jest.fn();
	wbWithEditorMetrics(loadExample);

	expect(mockGetObserver).not.toHaveBeenCalled();
	expect(loadExample).not.toHaveBeenCalled();
});

it('starts metrics with legacy settings before invoking the example loader', async () => {
	let resolveExample!: (example: { default: ComponentType }) => void;
	const loaded = new Promise<{ default: ComponentType }>((resolve) => {
		resolveExample = resolve;
	});
	const loadExample = jest.fn(() => {
		expect(mockStart).toHaveBeenCalledWith({ startTime: 0 });
		return loaded;
	});
	const { component: Example } = wbWithEditorMetrics(loadExample);
	const { container } = render(<Example />);

	expect(mockGetObserver).toHaveBeenCalledWith({
		timers: { setTimeout: { maxTimeoutAllowedToTrack: 5000 } },
	});
	expect(loadExample).toHaveBeenCalledTimes(1);
	expect(container).toBeEmptyDOMElement();

	await act(async () => {
		resolveExample({ default: () => <div>Loaded example</div> });
		await loaded;
	});
	expect(screen.getByText('Loaded example')).toBeInTheDocument();
});

it('starts once across multiple entries and remounts', async () => {
	const loadFirst = jest.fn(async () => ({ default: () => <div>First example</div> }));
	const { component: First } = wbWithEditorMetrics(loadFirst);
	const { component: Second } = wbWithEditorMetrics(async () => ({
		default: () => <div>Second example</div>,
	}));
	const view = render(<First />);
	await screen.findByText('First example');
	view.unmount();

	render(
		<>
			<First />
			<Second />
		</>,
	);
	await screen.findByText('Second example');
	expect(screen.getByText('First example')).toBeInTheDocument();
	expect(mockGetObserver).toHaveBeenCalledTimes(1);
	expect(mockStart).toHaveBeenCalledTimes(1);
	expect(loadFirst).toHaveBeenCalledTimes(1);
});

it.each(['startup', 'load'] as const)(
	'propagates %s failures to the host error boundary',
	async (phase) => {
		const error = new Error(`${phase} failed`);
		const loadExample = jest.fn(async () => {
			throw error;
		});
		if (phase === 'startup') {
			mockStart.mockImplementation(() => {
				throw error;
			});
		}
		const { component: Example } = wbWithEditorMetrics(loadExample);
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		try {
			render(
				<ErrorBoundary>
					<Example />
				</ErrorBoundary>,
			);
			expect(await screen.findByRole('alert')).toHaveTextContent(error.message);
			if (phase === 'startup') {
				expect(loadExample).not.toHaveBeenCalled();
			}
		} finally {
			consoleError.mockRestore();
		}
	},
);
