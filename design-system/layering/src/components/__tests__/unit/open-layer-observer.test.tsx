import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { OpenLayerObserver } from '../../open-layer-observer/open-layer-observer';
import { useNotifyOpenLayerObserver } from '../../open-layer-observer/use-notify-open-layer-observer';
import { useOpenLayerCount } from '../../open-layer-observer/use-open-layer-count';

describe('OpenLayerObserver', () => {
	// These tests are outside of the ffTest.on block as they do not evaluate the feature flag, so placing them in the block
	// would fail the tests.
	it('should have a layer count of 0 when there is no layer observer', () => {
		const { result } = renderHook(useOpenLayerCount);

		const layerCountRef = result.current;

		expect(layerCountRef.current).toBe(0);
	});

	it('should have a layer count of 0 when there are no open layers', () => {
		const { result } = renderHook(useOpenLayerCount, {
			wrapper: ({ children }) => <OpenLayerObserver>{children}</OpenLayerObserver>,
		});

		const layerCountRef = result.current;

		expect(layerCountRef.current).toBe(0);
	});

	ffTest.on(
		'platform_design_system_team_layering_observer',
		'when the layer observer feature flag is on',
		() => {
			it('should have a layer count of 1 when there is a single open layer', () => {
				const LayerComponent = () => {
					useNotifyOpenLayerObserver();

					return <div>Test layer component</div>;
				};

				const { result } = renderHook(useOpenLayerCount, {
					wrapper: ({ children }) => (
						<OpenLayerObserver>
							{children}
							<LayerComponent />
						</OpenLayerObserver>
					),
				});

				const layerCountRef = result.current;

				expect(layerCountRef.current).toBe(1);
			});

			it('should have the correct layer count when there are multiple open layers', () => {
				const LayerComponent = () => {
					useNotifyOpenLayerObserver();

					return <div>Test layer component</div>;
				};

				const { result } = renderHook(useOpenLayerCount, {
					wrapper: ({ children }) => (
						<OpenLayerObserver>
							{children}
							<LayerComponent />
							<LayerComponent />
							<LayerComponent />
						</OpenLayerObserver>
					),
				});

				const layerCountRef = result.current;

				expect(layerCountRef.current).toBe(3);
			});

			it('should have the correct layer count when there are nested layer observers', () => {
				const LayerComponent = () => {
					useNotifyOpenLayerObserver();

					return <div>Test layer component</div>;
				};

				const { result } = renderHook(useOpenLayerCount, {
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

				const layerCountRef = result.current;

				expect(layerCountRef.current).toBe(3);
			});

			it('should have the correct layer count when there are nested layer observers in different branches', () => {
				const LayerComponent = () => {
					useNotifyOpenLayerObserver();

					return <div>Test layer component</div>;
				};

				const { result } = renderHook(useOpenLayerCount, {
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

				const layerCountRef = result.current;

				// We don't expect the count to include the `LayerComponent` in the root observer - only the ones within the
				// closest parent `LayerObserver`
				expect(layerCountRef.current).toBe(2);
			});

			it('should increment the layer count when a layer has set isOpen to true', () => {
				const LayerComponent = () => {
					useNotifyOpenLayerObserver({ isOpen: true });

					return <div>Test layer component</div>;
				};

				const { result } = renderHook(useOpenLayerCount, {
					wrapper: ({ children }) => (
						<OpenLayerObserver>
							{children}
							<LayerComponent />
						</OpenLayerObserver>
					),
				});

				const layerCountRef = result.current;

				expect(layerCountRef.current).toBe(1);
			});

			it('should not increment the layer count when a layer has set isOpen to false', () => {
				const LayerComponent = () => {
					useNotifyOpenLayerObserver({ isOpen: false });

					return <div>Test layer component</div>;
				};

				const { result } = renderHook(useOpenLayerCount, {
					wrapper: ({ children }) => (
						<OpenLayerObserver>
							{children}
							<LayerComponent />
						</OpenLayerObserver>
					),
				});

				const layerCountRef = result.current;

				expect(layerCountRef.current).toBe(0);
			});

			it('should decrement the layer count when a layer is closed using the `isOpen` hook parameter', () => {
				const LayerComponent = ({ isOpen }: { isOpen: boolean }) => {
					useNotifyOpenLayerObserver({ isOpen });

					return <div>Test layer component</div>;
				};

				const { result, rerender } = renderHook(useOpenLayerCount, {
					initialProps: { isOpen: true },
					wrapper: ({ children, isOpen }) => (
						<OpenLayerObserver>
							{children}
							<LayerComponent isOpen={isOpen} />
						</OpenLayerObserver>
					),
				});

				const layerCountRef = result.current;

				expect(layerCountRef.current).toBe(1);

				rerender({ isOpen: false });

				expect(layerCountRef.current).toBe(0);
			});

			it('should decrement the layer count when a layer is unmounted', () => {
				const LayerComponent = () => {
					useNotifyOpenLayerObserver();

					return <div>Test layer component</div>;
				};

				const { result, rerender } = renderHook(useOpenLayerCount, {
					initialProps: { isOpen: true },
					wrapper: ({ children, isOpen }) => (
						<OpenLayerObserver>
							{children}
							{isOpen && <LayerComponent />}
						</OpenLayerObserver>
					),
				});

				const layerCountRef = result.current;

				expect(layerCountRef.current).toBe(1);

				rerender({ isOpen: false });

				expect(layerCountRef.current).toBe(0);
			});
		},
	);
});
