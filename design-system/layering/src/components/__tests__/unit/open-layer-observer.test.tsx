import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import __noop from '@atlaskit/ds-lib/noop';

import { OpenLayerObserver } from '../../open-layer-observer/open-layer-observer';
import { useNotifyOpenLayerObserver } from '../../open-layer-observer/use-notify-open-layer-observer';
import { useOpenLayerObserver } from '../../open-layer-observer/use-open-layer-observer';

describe('OpenLayerObserver', () => {
	it('useOpenLayerObserver should throw an error if used when there is no layer observer', () => {
		const { result } = renderHook(useOpenLayerObserver);

		expect(result.error?.message).toEqual(
			expect.stringMatching('useOpenLayerObserver must be used within an OpenLayerObserver'),
		);
	});

	it('should have a layer count of 0 when there are no open layers', () => {
		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => <OpenLayerObserver>{children}</OpenLayerObserver>,
		});

		const api = result.current;

		expect(api.getCount()).toBe(0);
	});

	it('should have a layer count of 1 when there is a single open layer', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<LayerComponent />
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		expect(api.getCount()).toBe(1);
	});

	it('should have the correct layer count when there are multiple open layers', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<LayerComponent />
					<LayerComponent />
					<LayerComponent />
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		expect(api.getCount()).toBe(3);
	});

	it('should have the correct layer count when there are nested layer observers', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<LayerComponent />
					<OpenLayerObserver>
						<LayerComponent />
						<LayerComponent />
					</OpenLayerObserver>
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		expect(api.getCount()).toBe(3);
	});

	it('should have the correct layer count when there are nested layer observers in different branches', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					<LayerComponent />
					<OpenLayerObserver>
						{children}
						<LayerComponent />
						<LayerComponent />
					</OpenLayerObserver>
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		// We don't expect the count to include the `LayerComponent` in the root observer - only the ones within the
		// closest parent `LayerObserver`
		expect(api.getCount()).toBe(2);
	});

	it('should increment the layer count when a layer has set isOpen to true', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver({ isOpen: true });

			return <div>Test layer component</div>;
		};

		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<LayerComponent />
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		expect(api.getCount()).toBe(1);
	});

	it('should not increment the layer count when a layer has set isOpen to false', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver({ isOpen: false });

			return <div>Test layer component</div>;
		};

		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<LayerComponent />
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		expect(api.getCount()).toBe(0);
	});

	it('should decrement the layer count when a layer is closed using the `isOpen` hook parameter', () => {
		const LayerComponent = ({ isOpen }: { isOpen: boolean }) => {
			useNotifyOpenLayerObserver({ isOpen });

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: true },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					<LayerComponent isOpen={isOpen} />
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		expect(api.getCount()).toBe(1);

		rerender({ isOpen: false });

		expect(api.getCount()).toBe(0);
	});

	it('should decrement the layer count when a layer is unmounted', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: true },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					{isOpen && <LayerComponent />}
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		expect(api.getCount()).toBe(1);

		rerender({ isOpen: false });

		expect(api.getCount()).toBe(0);
	});

	it('should run change callback when the layer count is increased', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: false },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					{isOpen && <LayerComponent />}
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		const listener = jest.fn();
		const unsubscribe = api.onChange(listener);

		expect(listener).toHaveBeenCalledTimes(0);

		rerender({ isOpen: true });

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith({ count: 1 });

		unsubscribe();
	});

	it('should run change callback when the layer count is decreased', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: true },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					{isOpen && <LayerComponent />}
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		const listener = jest.fn();
		const unsubscribe = api.onChange(listener);

		expect(listener).toHaveBeenCalledTimes(0);

		rerender({ isOpen: false });

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith({ count: 0 });

		unsubscribe();
	});

	it('should no longer call the listener function when calling the unsubscribe cleanup function', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: true },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					{isOpen && <LayerComponent />}
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		const listener = jest.fn();
		const unsubscribe = api.onChange(listener);

		rerender({ isOpen: false });
		expect(listener).toHaveBeenCalledTimes(1);

		listener.mockClear();

		unsubscribe();
		rerender({ isOpen: true });
		expect(listener).toHaveBeenCalledTimes(0);
	});

	it('should call each registration of a listener callback function when several listeners refer to the same function', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: true },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					{isOpen && <LayerComponent />}
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		const listener = jest.fn();
		const unsubscribe1 = api.onChange(listener);
		const unsubscribe2 = api.onChange(listener);

		rerender({ isOpen: false });
		expect(listener).toHaveBeenCalledTimes(2);

		unsubscribe1();
		unsubscribe2();
	});

	it('should only unsubscribe a single instance of a listener function when several listeners refer to the same function', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: true },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					{isOpen && <LayerComponent />}
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		const listener = jest.fn();
		const unsubscribe1 = api.onChange(listener);
		const unsubscribe2 = api.onChange(listener);

		rerender({ isOpen: false });
		expect(listener).toHaveBeenCalledTimes(2);

		listener.mockClear();

		unsubscribe1();
		rerender({ isOpen: true });
		expect(listener).toHaveBeenCalledTimes(1);

		listener.mockClear();

		unsubscribe2();
		rerender({ isOpen: false });
		expect(listener).toHaveBeenCalledTimes(0);
	});

	it('should not create an infinite loop when a listener adds another listener', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver();

			return <div>Test layer component</div>;
		};

		const { result, rerender } = renderHook(useOpenLayerObserver, {
			initialProps: { isOpen: true },
			wrapper: ({ children, isOpen }) => (
				<OpenLayerObserver>
					{children}
					{isOpen && <LayerComponent />}
				</OpenLayerObserver>
			),
		});

		const api = result.current;

		function addListener() {
			api.onChange(() => {
				addListener();
			});
		}

		addListener();

		rerender({ isOpen: false });

		expect(result.error).toBeUndefined();
	});
});
