import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { getLazyIconComponent, renderNothingOnLoadError, withSuspense } from '../lazy-component';

type Props = { testId?: string };

const Loaded = ({ testId }: Props) => <span data-testid={testId}>loaded</span>;

const deferred = <T,>() => {
	let resolve!: (value: T) => void;
	let reject!: (reason?: unknown) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
};

describe('withSuspense', () => {
	it('does not request the chunk until rendered', () => {
		const importFn = jest.fn(() => Promise.resolve({ default: Loaded }));
		withSuspense(React.lazy(importFn));

		expect(importFn).not.toHaveBeenCalled();
	});

	it('renders nothing while loading without suspending ancestors, then renders the component', async () => {
		const { promise, resolve } = deferred<{ default: typeof Loaded }>();
		const LazyComponent = withSuspense<Props>(React.lazy(() => promise));

		render(
			<React.Suspense fallback={<span data-testid="ancestor-fallback" />}>
				<span data-testid="sibling" />
				<LazyComponent testId="lazy" />
			</React.Suspense>,
		);

		expect(screen.getByTestId('sibling')).toBeInTheDocument();
		expect(screen.queryByTestId('ancestor-fallback')).not.toBeInTheDocument();
		expect(screen.queryByTestId('lazy')).not.toBeInTheDocument();

		resolve({ default: Loaded });

		expect(await screen.findByTestId('lazy')).toBeInTheDocument();
	});

	it('sets the display name', () => {
		const LazyComponent = withSuspense(
			React.lazy(() => Promise.resolve({ default: Loaded })),
			'lazy(Loaded)',
		);

		expect(LazyComponent.displayName).toBe('lazy(Loaded)');
	});
});

describe('renderNothingOnLoadError', () => {
	it('renders nothing and does not throw when the chunk fails to load', async () => {
		const LazyComponent = withSuspense<Props>(
			React.lazy(() =>
				Promise.reject<{ default: typeof Loaded }>(new Error('ChunkLoadError')).catch(
					renderNothingOnLoadError,
				),
			),
		);

		render(
			<>
				<span data-testid="sibling" />
				<LazyComponent testId="lazy" />
			</>,
		);

		await new Promise(process.nextTick);

		expect(screen.getByTestId('sibling')).toBeInTheDocument();
		expect(screen.queryByTestId('lazy')).not.toBeInTheDocument();
	});
});

describe('getLazyIconComponent', () => {
	it('returns the same component for the same cache key', () => {
		const importFn = () => Promise.resolve({ default: Loaded });

		expect(getLazyIconComponent('same-key', importFn)).toBe(
			getLazyIconComponent('same-key', () => Promise.resolve({ default: Loaded })),
		);
	});

	it('returns different components for different cache keys', () => {
		const importFn = () => Promise.resolve({ default: Loaded });

		expect(getLazyIconComponent('key-a', importFn)).not.toBe(
			getLazyIconComponent('key-b', importFn),
		);
	});

	it('does not remount the icon across re-renders', async () => {
		const importFn = jest.fn(() => Promise.resolve({ default: Loaded }));
		const Wrapper = () => {
			const Icon = getLazyIconComponent('rerender-key', importFn);
			return <Icon testId="icon" />;
		};

		const { rerender } = render(<Wrapper />);
		const icon = await screen.findByTestId('icon');

		rerender(<Wrapper />);

		expect(screen.getByTestId('icon')).toBe(icon);
		expect(importFn).toHaveBeenCalledTimes(1);
	});

	it('retries the import on the next render after a failed load', async () => {
		const importFn = jest
			.fn()
			.mockRejectedValueOnce(new Error('ChunkLoadError'))
			.mockResolvedValue({ default: Loaded });
		const Wrapper = () => {
			const Icon = getLazyIconComponent('retry-key', importFn);
			return <Icon testId="icon" />;
		};

		const { rerender } = render(<Wrapper />);
		await new Promise(process.nextTick);
		expect(screen.queryByTestId('icon')).not.toBeInTheDocument();

		rerender(<Wrapper />);

		expect(await screen.findByTestId('icon')).toBeInTheDocument();
		expect(importFn).toHaveBeenCalledTimes(2);
	});
});
