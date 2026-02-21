import React from 'react';

import { render, renderHook } from '@testing-library/react';
import invariant from 'tiny-invariant';

import noop from '@atlaskit/ds-lib/noop';

import { OpenLayerObserver } from '../../open-layer-observer/open-layer-observer';
import { OpenLayerObserverNamespaceProvider } from '../../open-layer-observer/open-layer-observer-namespace-provider';
import type { LayerType } from '../../open-layer-observer/types';
import { useNotifyOpenLayerObserver } from '../../open-layer-observer/use-notify-open-layer-observer';
import { useOpenLayerObserver } from '../../open-layer-observer/use-open-layer-observer';

const MockLayerComponent = ({ type }: { type?: LayerType }) => {
	useNotifyOpenLayerObserver({
		isOpen: true,
		onClose: noop,
		type,
	});

	return <div>Test layer component</div>;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('OpenLayerObserver', () => {
	it('useOpenLayerObserver should not throw an error if used when there is no layer observer', () => {
		expect(() => renderHook(useOpenLayerObserver)).not.toThrow();
	});

	it('should throw an error if there are nested layer namespace providers', () => {
		jest.spyOn(console, 'error').mockImplementation(noop);

		const nestedProviders = (
			<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
				<OpenLayerObserverNamespaceProvider namespace="test-namespace-2">
					Test
				</OpenLayerObserverNamespaceProvider>
			</OpenLayerObserverNamespaceProvider>
		);

		expect(() => render(nestedProviders)).toThrow(
			new Error(
				'Invariant failed: An OpenLayerObserver namespace already exists in this component tree: test-namespace-1. Nesting OpenLayerObserverNamespaceProvider is not supported.',
			),
		);

		jest.restoreAllMocks();
	});

	it('should throw an error when there are nested layer observers', () => {
		expect(() =>
			renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserver>
							<MockLayerComponent />
						</OpenLayerObserver>
					</OpenLayerObserver>
				),
			}),
		).toThrow(
			new Error(
				'Invariant failed: `OpenLayerObserver` cannot be nested within another `OpenLayerObserver`.',
			),
		);
	});
});

describe('OpenLayerObserver', () => {
	describe('getting layer count', () => {
		it('should have a layer count of 0 when there are no open layers', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => <OpenLayerObserver>{children}</OpenLayerObserver>,
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(0);
		});

		it('should have a layer count of 1 when there is a single open layer', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<MockLayerComponent />
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(1);
		});

		it('should have the correct layer count when there are multiple open layers', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<MockLayerComponent />
						<MockLayerComponent />
						<MockLayerComponent />
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(3);
		});

		it('should return the correct layer count when requesting for a specific namespace', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<MockLayerComponent />
						<MockLayerComponent />

						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(1);
		});

		it('should return the correct layer count when requesting for a specific namespace and there are multiple layers in that namespace', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<MockLayerComponent />
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(2);
		});

		it('should return the correct layer count when requesting for a specific namespace and there are no layers in that namespace', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount({ namespace: 'test-namespace-2' })).toBe(0);
		});

		it('should return the correct layer count when requesting for a specific namespace and there are multiple namespaces', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>

						<OpenLayerObserverNamespaceProvider namespace="test-namespace-2">
							<MockLayerComponent />
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(1);
			expect(api.getCount({ namespace: 'test-namespace-2' })).toBe(2);
		});

		it('should return the number of open layers across all namespaces when requesting without specifying a specific namespace', () => {
			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{/* This layer is not in any namespace */}
						<MockLayerComponent />

						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>

						<OpenLayerObserverNamespaceProvider namespace="test-namespace-2">
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(3);
		});
	});

	describe('updating layer count', () => {
		it('should increment the layer count when a layer has set isOpen to true', () => {
			const LayerComponent = () => {
				useNotifyOpenLayerObserver({ isOpen: true, onClose: noop });

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
			invariant(api);

			expect(api.getCount()).toBe(1);
		});

		it('should not increment the layer count when a layer has set isOpen to false', () => {
			const LayerComponent = () => {
				useNotifyOpenLayerObserver({ isOpen: false, onClose: noop });

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
			invariant(api);

			expect(api.getCount()).toBe(0);
		});

		it('should decrement the layer count when a layer is closed using the `isOpen` hook parameter', () => {
			let isOpen = true;
			const LayerComponent = ({ isOpen }: { isOpen: boolean }) => {
				useNotifyOpenLayerObserver({ isOpen, onClose: noop });

				return <div>Test layer component</div>;
			};

			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<LayerComponent isOpen={isOpen} />
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(1);

			isOpen = false;
			rerender();

			expect(api.getCount()).toBe(0);
		});

		it('should decrement the layer count when a layer is closed using the `isOpen` hook parameter and is inside a namespace', () => {
			let isOpen = true;
			const LayerComponent = ({ isOpen }: { isOpen: boolean }) => {
				useNotifyOpenLayerObserver({ isOpen, onClose: noop });

				return <div>Test layer component</div>;
			};

			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<LayerComponent isOpen={isOpen} />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(1);
			expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(1);

			isOpen = false;
			rerender();

			expect(api.getCount()).toBe(0);
			expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(0);
		});

		it('should decrement the layer count when a layer is unmounted', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }: { children: React.ReactNode }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(1);

			isOpen = false;
			rerender();

			expect(api.getCount()).toBe(0);
		});

		it('should decrement the layer count when a layer is unmounted and is inside a namespace', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }: { children: React.ReactNode }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(api.getCount()).toBe(1);
			expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(1);
			isOpen = false;
			rerender();

			expect(api.getCount()).toBe(0);
			expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(0);
		});
	});

	describe('on change', () => {
		it('should run onChange callback when the layer count is increased [no namespaces]', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			// Register a change listener (jest mock function)
			const listener = jest.fn();
			// Not specifying a namespace, so the listener will be called when any layer count changes
			const unsubscribe = api.onChange(listener);

			expect(listener).not.toHaveBeenCalled();

			// Rerender with a layer change to increase the layer count
			isOpen = true;
			rerender();

			// The listener should now be called once
			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith({ count: 1 });

			unsubscribe();
		});

		it('should run onChange callback when the layer count is decreased [no namespaces]', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			const listener = jest.fn();
			const unsubscribe = api.onChange(listener);

			expect(listener).toHaveBeenCalledTimes(0);

			isOpen = false;
			rerender();

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith({ count: 0 });

			unsubscribe();
		});

		it('should run namespaced onChange callback when a layer belonging to the same namespace is opened and when closed', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			// Register a change listener (jest mock function)
			const listener = jest.fn();
			const unsubscribe = api.onChange(listener, { namespace: 'test-namespace-1' });

			expect(listener).not.toHaveBeenCalled();

			// Rerender with the layer opened to increase the layer count
			isOpen = true;
			rerender();

			// The listener should now be called once
			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith({ count: 1 });

			// Rerender with the layer closed to decrease the layer count
			isOpen = false;
			rerender();

			// The listener should now be called twice
			expect(listener).toHaveBeenCalledTimes(2);
			expect(listener).toHaveBeenCalledWith({ count: 0 });

			unsubscribe();
		});

		it('should not run namespaced onChange callback when a layer belonging to a different namespace is opened or closed', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			// Register a change listener (jest mock function) for a different namespace
			const listener = jest.fn();
			const unsubscribe = api.onChange(listener, { namespace: 'test-namespace-2' });

			expect(listener).not.toHaveBeenCalled();

			// Rerender with the layer opened to increase the layer count
			isOpen = true;
			rerender();

			// The listener should not be called
			expect(listener).not.toHaveBeenCalled();

			// Rerender with the layer closed to decrease the layer count
			isOpen = false;
			rerender();

			// The listener should not be called
			expect(listener).not.toHaveBeenCalled();

			unsubscribe();
		});

		it('should not run a namespaced onChange callback when a layer without a namespace is opened or closed', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			// Register a change listener (jest mock function) for a different namespace
			const listener = jest.fn();
			const unsubscribe = api.onChange(listener, { namespace: 'test-namespace-2' });

			expect(listener).not.toHaveBeenCalled();

			// Rerender with the layer opened to increase the layer count
			isOpen = true;
			rerender();

			// The listener should not be called
			expect(listener).not.toHaveBeenCalled();

			// Rerender with the layer closed to decrease the layer count
			isOpen = false;
			rerender();

			// The listener should not be called
			expect(listener).not.toHaveBeenCalled();

			unsubscribe();
		});

		it('should run a non-namespaced onChange callback when a layer in a namespace is opened or closed', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			// Register a change listener (jest mock function)
			const listener = jest.fn();
			// Not specifying a namespace, so the listener will be called when any layer count changes
			const unsubscribe = api.onChange(listener);

			expect(listener).not.toHaveBeenCalled();

			// Rerender with the layer open to increase the layer count
			isOpen = true;
			rerender();

			// The listener should now be called once
			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith({ count: 1 });

			// Rerender with the layer closed to decrease the layer count
			isOpen = false;
			rerender();

			// The listener should now be called twice
			expect(listener).toHaveBeenCalledTimes(2);
			expect(listener).toHaveBeenCalledWith({ count: 0 });

			unsubscribe();
		});

		it('should run a non-namespaced onChange callback with correct args when there is a mix of namespaced and non-namespaced layers', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<MockLayerComponent />
						</OpenLayerObserverNamespaceProvider>
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			// Register a change listener (jest mock function)
			const listener = jest.fn();
			// Not specifying a namespace, so the listener will be called when any layer count changes
			const unsubscribe = api.onChange(listener);

			expect(listener).not.toHaveBeenCalled();

			// Rerender with the layer open to increase the layer count
			isOpen = true;
			rerender();

			// The listener should now be called once
			expect(listener).toHaveBeenCalledTimes(1);
			// The count should include the namespaced and non-namespaced layers that are open
			expect(listener).toHaveBeenCalledWith({ count: 2 });

			// Rerender with the layer closed to decrease the layer count
			isOpen = false;
			rerender();

			// The listener should now be called twice
			expect(listener).toHaveBeenCalledTimes(2);
			expect(listener).toHaveBeenCalledWith({ count: 1 });

			unsubscribe();
		});

		it('should run both the non-namespaced onChange callback and namespaced onChange callback when a namespaced layer is opened or closed', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
						<MockLayerComponent />
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			// Register a change listener (jest mock function) without specifying a namespace,
			// It should be called when any layer opens/closes
			const listenerForAllLayers = jest.fn();
			const unsubscribe1 = api.onChange(listenerForAllLayers);

			// Register a change listener (jest mock function) for a specific namespace
			const listenerForSpecificNamespace = jest.fn();
			const unsubscribe2 = api.onChange(listenerForSpecificNamespace, {
				namespace: 'test-namespace-1',
			});

			expect(listenerForAllLayers).not.toHaveBeenCalled();
			expect(listenerForSpecificNamespace).not.toHaveBeenCalled();

			// Rerender with the layer open to increase the layer count
			isOpen = true;
			rerender();

			// Both listeners should now have been called
			expect(listenerForAllLayers).toHaveBeenCalledTimes(1);
			expect(listenerForSpecificNamespace).toHaveBeenCalledTimes(1);
			// The non-namespaced listener should receive the count across all layers
			expect(listenerForAllLayers).toHaveBeenCalledWith({ count: 2 });
			// The namespaced listener should receive the count for the specific namespace
			expect(listenerForSpecificNamespace).toHaveBeenCalledWith({ count: 1 });

			// Rerender with the layer closed to decrease the layer count
			isOpen = false;
			rerender();

			// Both listeners should now have been called twice
			expect(listenerForAllLayers).toHaveBeenCalledTimes(2);
			expect(listenerForSpecificNamespace).toHaveBeenCalledTimes(2);
			// The non-namespaced listener should receive the count across all layers
			expect(listenerForAllLayers).toHaveBeenCalledWith({ count: 1 });
			// The namespaced listener should only receive the count for that namespace
			expect(listenerForSpecificNamespace).toHaveBeenCalledWith({ count: 0 });

			unsubscribe1();
			unsubscribe2();
		});

		it('should first call the namespaced onChange listeners before calling the non-namespaced onChange listeners', () => {
			let isOpen = false;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
						<MockLayerComponent />
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			const orderedCalls: string[] = [];

			// Register a change listener without specifying a namespace,
			// It should be called when any layer opens/closes
			const listenerForAllLayers = () => {
				orderedCalls.push('all-layers');
			};
			const unsubscribe1 = api.onChange(listenerForAllLayers);

			// Register a change listener for a specific namespace
			const listenerForSpecificNamespace = () => {
				orderedCalls.push('specific-namespace');
			};
			const unsubscribe2 = api.onChange(listenerForSpecificNamespace, {
				namespace: 'test-namespace-1',
			});

			expect(orderedCalls).toEqual([]);

			// Rerender with the layer open to increase the layer count
			isOpen = true;
			rerender();

			// Both listeners should now have been called,
			// but the specific namespace listener should be called first
			expect(orderedCalls).toEqual(['specific-namespace', 'all-layers']);

			unsubscribe1();
			unsubscribe2();
		});

		it('should no longer call the onChange callback when the unsubscribe cleanup function has been called', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			const listener = jest.fn();
			const unsubscribe = api.onChange(listener);

			isOpen = false;
			rerender();
			expect(listener).toHaveBeenCalledTimes(1);

			listener.mockClear();

			unsubscribe();
			isOpen = true;
			rerender();
			expect(listener).toHaveBeenCalledTimes(0);
		});

		it('should no longer call the namespaced onChange callback when the unsubscribe function has been called', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			const listener = jest.fn();
			const unsubscribe = api.onChange(listener, { namespace: 'test-namespace-1' });

			isOpen = false;
			rerender();
			expect(listener).toHaveBeenCalledTimes(1);

			listener.mockClear();

			unsubscribe();
			isOpen = true;
			rerender();
			expect(listener).toHaveBeenCalledTimes(0);
		});

		it('should be able to register an onChange callback to the same namespace after unsubscribing', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							{isOpen && <MockLayerComponent />}
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			const listener = jest.fn();
			const unsubscribe = api.onChange(listener, { namespace: 'test-namespace-1' });

			isOpen = false;
			rerender();
			expect(listener).toHaveBeenCalledTimes(1);

			listener.mockClear();

			unsubscribe();
			isOpen = true;
			rerender();
			expect(listener).toHaveBeenCalledTimes(0);

			const unsubscribe2 = api.onChange(listener, { namespace: 'test-namespace-1' });

			isOpen = false;
			rerender();
			expect(listener).toHaveBeenCalledTimes(1);

			listener.mockClear();

			unsubscribe2();
			isOpen = true;
			rerender();
			expect(listener).toHaveBeenCalledTimes(0);
		});

		it('should call each registration of a listener callback function when several listeners refer to the same function', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			const listener = jest.fn();
			const unsubscribe1 = api.onChange(listener);
			const unsubscribe2 = api.onChange(listener);

			isOpen = false;
			rerender();
			expect(listener).toHaveBeenCalledTimes(2);

			unsubscribe1();
			unsubscribe2();
		});

		it('should only unsubscribe a single instance of a listener function when several listeners refer to the same function', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			const listener = jest.fn();
			const unsubscribe1 = api.onChange(listener);
			const unsubscribe2 = api.onChange(listener);

			isOpen = false;
			rerender();
			expect(listener).toHaveBeenCalledTimes(2);

			listener.mockClear();

			unsubscribe1();
			isOpen = true;
			rerender();
			expect(listener).toHaveBeenCalledTimes(1);

			listener.mockClear();

			unsubscribe2();
			isOpen = false;
			rerender();
			expect(listener).toHaveBeenCalledTimes(0);
		});

		it('should not create an infinite loop when a listener adds another listener', () => {
			let isOpen = true;
			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isOpen && <MockLayerComponent />}
					</OpenLayerObserver>
				),
			});

			const api = result.current;

			function addListener() {
				api?.onChange(() => {
					addListener();
				});
			}

			addListener();

			isOpen = false;
			expect(() => rerender()).not.toThrow();
		});
	});

	describe('close layers', () => {
		it('should close all registered layers when closeLayers is called', () => {
			const LayerComponent = ({ onClose }: { onClose: () => void }) => {
				useNotifyOpenLayerObserver({ isOpen: true, onClose });

				return <div>Test layer component</div>;
			};

			// Creating separate close listeners for each layer component
			const onClose1 = jest.fn();
			const onClose2 = jest.fn();

			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<LayerComponent onClose={onClose1} />

						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<LayerComponent onClose={onClose2} />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(onClose1).not.toHaveBeenCalled();
			expect(onClose2).not.toHaveBeenCalled();

			api.closeLayers();

			expect(onClose1).toHaveBeenCalledTimes(1);
			expect(onClose2).toHaveBeenCalledTimes(1);
		});

		it('should not attempt to close a layer when it is already closed', () => {
			const LayerComponent = ({ onClose }: { onClose: () => void }) => {
				useNotifyOpenLayerObserver({ isOpen: false, onClose });

				return <div>Test layer component</div>;
			};

			const onClose = jest.fn();

			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<LayerComponent onClose={onClose} />
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(onClose).not.toHaveBeenCalled();

			api.closeLayers();

			expect(onClose).not.toHaveBeenCalled();
		});

		it('should call each registration of onClose function when several listeners refer to the same function', () => {
			const LayerComponent = ({ onClose }: { onClose: () => void }) => {
				useNotifyOpenLayerObserver({ isOpen: true, onClose });

				return <div>Test layer component</div>;
			};

			// Using the same close listener for both layers
			const onClose = jest.fn();

			const { result } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<LayerComponent onClose={onClose} />

						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<LayerComponent onClose={onClose} />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(onClose).not.toHaveBeenCalled();

			api.closeLayers();

			expect(onClose).toHaveBeenCalledTimes(2);
		});

		it('should only unsubscribe a single instance of an onClose function when several listeners refer to the same function', () => {
			let isLayerOneOpen = true;
			const LayerComponent = ({ onClose }: { onClose: () => void }) => {
				useNotifyOpenLayerObserver({ isOpen: true, onClose });

				return <div>Test layer component</div>;
			};

			// Using the same close listener for both layers
			const onClose = jest.fn();

			const { result, rerender } = renderHook(useOpenLayerObserver, {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						{isLayerOneOpen && <LayerComponent onClose={onClose} />}

						<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
							<LayerComponent onClose={onClose} />
						</OpenLayerObserverNamespaceProvider>
					</OpenLayerObserver>
				),
			});

			const api = result.current;
			invariant(api);

			expect(onClose).not.toHaveBeenCalled();

			api.closeLayers();

			// Should be called twice as two layers are rendered
			expect(onClose).toHaveBeenCalledTimes(2);

			onClose.mockClear();

			// Rerender with the first layer unmounted, which will unsubscribe its onClose listener
			isLayerOneOpen = false;
			rerender();

			// Should be called once as only one layer is rendered
			expect(onClose).toHaveBeenCalledTimes(0);
		});
	});

	it('should return the correct layer count when requesting for a specific type', () => {
		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<MockLayerComponent />
					<MockLayerComponent />
					<MockLayerComponent type="modal" />
				</OpenLayerObserver>
			),
		});

		const api = result.current;
		invariant(api);

		expect(api.getCount({ type: 'modal' })).toBe(1);
	});

	it('should return the correct layer count when requesting for a specific type and there are multiple layers of that type', () => {
		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<MockLayerComponent />
					<MockLayerComponent />
					<MockLayerComponent type="modal" />
					<MockLayerComponent type="modal" />
					<MockLayerComponent type="modal" />
				</OpenLayerObserver>
			),
		});

		const api = result.current;
		invariant(api);

		expect(api.getCount({ type: 'modal' })).toBe(3);
	});

	it('should return the correct layer count when requesting for a specific type and there are no layers of that type', () => {
		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<MockLayerComponent />
				</OpenLayerObserver>
			),
		});

		const api = result.current;
		invariant(api);

		expect(api.getCount({ type: 'modal' })).toBe(0);
	});

	it('should return the correct layer count when not requesting for a specific type and there is a mix of layers with types and without', () => {
		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<MockLayerComponent />
					<MockLayerComponent type="modal" />
					<MockLayerComponent />
					<MockLayerComponent type="modal" />
				</OpenLayerObserver>
			),
		});

		const api = result.current;
		invariant(api);

		expect(api.getCount()).toBe(4);
	});

	it('should return the correct layer count when requesting both a namespace and layer type', () => {
		const { result } = renderHook(useOpenLayerObserver, {
			wrapper: ({ children }) => (
				<OpenLayerObserver>
					{children}
					<MockLayerComponent />
					<MockLayerComponent type="modal" />
					<MockLayerComponent />
					<MockLayerComponent type="modal" />

					<OpenLayerObserverNamespaceProvider namespace="test-namespace-1">
						<MockLayerComponent />
						<MockLayerComponent />
						<MockLayerComponent />
						<MockLayerComponent type="modal" />
						<MockLayerComponent type="modal" />
					</OpenLayerObserverNamespaceProvider>
				</OpenLayerObserver>
			),
		});

		const api = result.current;
		invariant(api);

		expect(api.getCount()).toBe(9);
		expect(api.getCount({ namespace: 'test-namespace-1' })).toBe(5);
		expect(api.getCount({ type: 'modal' })).toBe(4);
		expect(api.getCount({ namespace: 'test-namespace-1', type: 'modal' })).toBe(2);
	});
});
