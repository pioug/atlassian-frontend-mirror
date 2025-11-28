import React, { useEffect, useRef } from 'react';

import type { EntryPoint } from 'react-relay';

import { render, waitFor } from '@atlassian/testing-library';

import { usePanelManager, usePanelState } from '../../panel-manager';
import { PanelProvider } from '../../panel-provider';
import type { PanelSystemState } from '../../types';

// Helper to create mock EntryPoint for testing
function createMockEntryPoint(id: string): EntryPoint<any, any> {
	return {
		root: {
			getModuleId: () => id,
			getModuleName: () => id,
		} as any,
		getPreloadProps: () => ({}),
	} as EntryPoint<any, any>;
}

describe('PanelManager', () => {
	const mockEntryPoint1 = createMockEntryPoint('test-panel-1');
	const mockEntryPoint2 = createMockEntryPoint('test-panel-2');
	const mockEntryPoint3 = createMockEntryPoint('test-panel-3');
	const mockEntryPoint = createMockEntryPoint('test-panel');

	describe('initialization', () => {
		it('should initialize with empty state', () => {
			let capturedState: PanelSystemState | null = null;

			function TestComponent() {
				capturedState = usePanelState();
				return null;
			}

			render(
				<PanelProvider>
					<TestComponent />
				</PanelProvider>,
			);

			expect(capturedState!.activePanels).toEqual([]);
		});

		it('should initialize with custom initial state', () => {
			let capturedState: PanelSystemState | null = null;

			const initialState: Partial<PanelSystemState> = {
				activePanels: [
					{
						instanceId: 'panel-1',
						entryPoint: mockEntryPoint,
						params: {},
					},
				],
			};

			function TestComponent() {
				capturedState = usePanelState();
				return null;
			}

			render(
				<PanelProvider initialState={initialState}>
					<TestComponent />
				</PanelProvider>,
			);

			expect(capturedState!.activePanels).toHaveLength(1);
			expect(capturedState!.activePanels[0].instanceId).toBe('panel-1');
		});
	});

	describe('openPanel', () => {
		it('should open a new panel', async () => {
			let capturedState: PanelSystemState | null = null;

			function TestComponent() {
				const { state, manager } = usePanelManager();
				capturedState = state;
				const hasOpened = useRef(false);

				useEffect(() => {
					if (!hasOpened.current && state.activePanels.length === 0) {
						hasOpened.current = true;
						manager.openPanel('panel-1', mockEntryPoint, { key: 'value' });
					}
				}, [state.activePanels.length, manager]);

				return null;
			}

			render(
				<PanelProvider>
					<TestComponent />
				</PanelProvider>,
			);

			await waitFor(() => {
				expect(capturedState!.activePanels).toHaveLength(1);
			});

			expect(capturedState!.activePanels[0]).toEqual({
				instanceId: 'panel-1',
				entryPoint: mockEntryPoint,
				params: { key: 'value' },
			});
		});

		it('should open multiple panels', async () => {
			let capturedState: PanelSystemState | null = null;

			function TestComponent() {
				const { state, manager } = usePanelManager();
				capturedState = state;
				const hasOpened = useRef(false);

				useEffect(() => {
					if (!hasOpened.current && state.activePanels.length === 0) {
						hasOpened.current = true;
						manager.openPanel('panel-1', mockEntryPoint1);
						manager.openPanel('panel-2', mockEntryPoint2, { id: 123 });
					}
				}, [state.activePanels.length, manager]);

				return null;
			}

			render(
				<PanelProvider>
					<TestComponent />
				</PanelProvider>,
			);

			await waitFor(() => {
				expect(capturedState!.activePanels).toHaveLength(2);
			});

			expect(capturedState!.activePanels[0].instanceId).toBe('panel-1');
			expect(capturedState!.activePanels[1].instanceId).toBe('panel-2');
		});

		it('should handle empty params', async () => {
			let capturedState: PanelSystemState | null = null;

			function TestComponent() {
				const { state, manager } = usePanelManager();
				capturedState = state;
				const hasOpened = useRef(false);

				useEffect(() => {
					if (!hasOpened.current && state.activePanels.length === 0) {
						hasOpened.current = true;
						manager.openPanel('panel-1', mockEntryPoint);
					}
				}, [state.activePanels.length, manager]);

				return null;
			}

			render(
				<PanelProvider>
					<TestComponent />
				</PanelProvider>,
			);

			await waitFor(() => {
				expect(capturedState!.activePanels).toHaveLength(1);
			});

			expect(capturedState!.activePanels[0].params).toEqual({});
		});
	});

	describe('closePanel', () => {
		it('should close a panel by instanceId', async () => {
			let capturedState: PanelSystemState | null = null;

			function TestComponent() {
				const { state, manager } = usePanelManager();
				capturedState = state;
				const hasOpened = useRef(false);
				const hasClosed = useRef(false);

				useEffect(() => {
					if (!hasOpened.current && state.activePanels.length < 3) {
						hasOpened.current = true;
						manager.openPanel('panel-1', mockEntryPoint1);
						manager.openPanel('panel-2', mockEntryPoint2);
						manager.openPanel('panel-3', mockEntryPoint3);
					}
				}, [state.activePanels.length, manager]);

				useEffect(() => {
					if (!hasClosed.current && state.activePanels.length === 3) {
						hasClosed.current = true;
						manager.closePanel('panel-2');
					}
				}, [state.activePanels.length, manager]);

				return null;
			}

			render(
				<PanelProvider>
					<TestComponent />
				</PanelProvider>,
			);

			await waitFor(() => {
				expect(capturedState!.activePanels).toHaveLength(2);
			});

			expect(capturedState!.activePanels.map((p: any) => p.instanceId)).toEqual([
				'panel-1',
				'panel-3',
			]);
		});

		it('should handle closing non-existent panel gracefully', async () => {
			let capturedState: PanelSystemState | null = null;

			function TestComponent() {
				const { state, manager } = usePanelManager();
				capturedState = state;
				const hasActed = useRef(false);

				useEffect(() => {
					if (!hasActed.current && state.activePanels.length === 0) {
						hasActed.current = true;
						manager.openPanel('panel-1', mockEntryPoint1);
						manager.closePanel('non-existent');
					}
				}, [state.activePanels.length, manager]);

				return null;
			}

			render(
				<PanelProvider>
					<TestComponent />
				</PanelProvider>,
			);

			await waitFor(() => {
				expect(capturedState!.activePanels).toHaveLength(1);
			});
		});
	});

	describe('integration', () => {
		it('should handle complex workflow', async () => {
			let capturedState: PanelSystemState | null = null;

			function TestComponent() {
				const { state, manager } = usePanelManager();
				capturedState = state;
				const hasOpened = useRef(false);
				const hasClosedFirst = useRef(false);
				const hasClosedSecond = useRef(false);

				useEffect(() => {
					if (!hasOpened.current && state.activePanels.length < 3) {
						hasOpened.current = true;
						manager.openPanel('panel-1', mockEntryPoint1, { id: 1 });
						manager.openPanel('panel-2', mockEntryPoint2, { id: 2 });
						manager.openPanel('panel-3', mockEntryPoint3, { id: 3 });
					}
				}, [state.activePanels.length, manager]);

				useEffect(() => {
					if (!hasClosedFirst.current && state.activePanels.length === 3) {
						hasClosedFirst.current = true;
						manager.closePanel('panel-2');
					}
				}, [state.activePanels.length, manager]);

				useEffect(() => {
					if (!hasClosedSecond.current && state.activePanels.length === 2) {
						hasClosedSecond.current = true;
						manager.closePanel('panel-3');
					}
				}, [state.activePanels.length, manager]);

				return null;
			}

			render(
				<PanelProvider>
					<TestComponent />
				</PanelProvider>,
			);

			await waitFor(() => {
				expect(capturedState!.activePanels).toHaveLength(1);
			});

			expect(capturedState!.activePanels[0].instanceId).toBe('panel-1');
		});
	});
});
