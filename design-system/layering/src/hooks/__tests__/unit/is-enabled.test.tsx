import React from 'react';

import { fireEvent, render, renderHook } from '@testing-library/react';

import { Layering } from '../../../components/layering';
import { OpenLayerObserver } from '../../../components/open-layer-observer/open-layer-observer';
import { useNotifyOpenLayerObserver } from '../../../components/open-layer-observer/use-notify-open-layer-observer';
import { useOpenLayerObserver } from '../../../components/open-layer-observer/use-open-layer-observer';
import { useCloseOnEscapePress } from '../../use-close-on-escape-press';
import { useLayering } from '../../use-layering';

type LayeringResult = ReturnType<typeof useLayering>;

function LayeringProbe({
	isEnabled,
	onResult,
}: {
	isEnabled?: boolean;
	onResult: (result: LayeringResult) => void;
}) {
	const result = useLayering(isEnabled === undefined ? undefined : { isEnabled });
	onResult(result);
	return null;
}

/**
 * Renders the probe in the outer of two enabled layers, so a deeper layer is on top of it.
 */
function getLayeringOfCoveredLayer({ isEnabled }: { isEnabled?: boolean }): LayeringResult {
	let result: LayeringResult | null = null;
	render(
		<Layering isDisabled={false}>
			<LayeringProbe
				isEnabled={isEnabled}
				onResult={(value) => {
					result = value;
				}}
			/>
			<Layering isDisabled={false}>
				<div />
			</Layering>
		</Layering>,
	);
	if (!result) {
		throw new Error('The probe did not render');
	}
	return result;
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('isEnabled', () => {
	describe('useLayering', () => {
		it('should report the layering tree by default', () => {
			const layering = getLayeringOfCoveredLayer({});

			expect(layering.currentLevel).toBe(1);
			expect(layering.getTopLevel()).toBe(2);
			expect(layering.isLayerDisabled()).toBe(true);
		});

		it('should report the layering tree when isEnabled is true', () => {
			const layering = getLayeringOfCoveredLayer({ isEnabled: true });

			expect(layering.currentLevel).toBe(1);
			expect(layering.getTopLevel()).toBe(2);
			expect(layering.isLayerDisabled()).toBe(true);
		});

		it('should report no layering when isEnabled is false', () => {
			const layering = getLayeringOfCoveredLayer({ isEnabled: false });

			expect(layering.currentLevel).toBe(0);
			expect(layering.getTopLevel()).toBeNull();
			expect(layering.isLayerDisabled()).toBe(false);
		});
	});

	describe('useCloseOnEscapePress', () => {
		function CloseOnEscape({
			onClose,
			isEnabled,
		}: {
			onClose: (e: KeyboardEvent) => void;
			isEnabled?: boolean;
		}) {
			useCloseOnEscapePress({ onClose, isEnabled });
			return null;
		}

		function pressEscape() {
			fireEvent.keyDown(window, { key: 'Escape' });
			fireEvent.keyUp(window, { key: 'Escape' });
		}

		it('should call onClose on Escape by default', () => {
			const onClose = jest.fn();
			render(<CloseOnEscape onClose={onClose} />);

			pressEscape();

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('should not call onClose on Escape when isEnabled is false', () => {
			const onClose = jest.fn();
			render(<CloseOnEscape onClose={onClose} isEnabled={false} />);

			pressEscape();

			expect(onClose).not.toHaveBeenCalled();
		});

		it('should bind no window listeners when isEnabled is false', () => {
			const addEventListener = jest.spyOn(window, 'addEventListener');
			render(<CloseOnEscape onClose={jest.fn()} isEnabled={false} />);

			expect(addEventListener).not.toHaveBeenCalledWith(
				'keydown',
				expect.anything(),
				expect.anything(),
			);
			expect(addEventListener).not.toHaveBeenCalledWith(
				'keyup',
				expect.anything(),
				expect.anything(),
			);
			addEventListener.mockRestore();
		});

		it('should skip a covered layer by default', () => {
			const onClose = jest.fn();
			render(
				<Layering isDisabled={false}>
					<CloseOnEscape onClose={onClose} />
					<Layering isDisabled={false}>
						<div />
					</Layering>
				</Layering>,
			);

			pressEscape();

			expect(onClose).not.toHaveBeenCalled();
		});

		it('should start listening when isEnabled changes to true', () => {
			const onClose = jest.fn();
			const { rerender } = render(<CloseOnEscape onClose={onClose} isEnabled={false} />);

			pressEscape();
			expect(onClose).not.toHaveBeenCalled();

			rerender(<CloseOnEscape onClose={onClose} isEnabled />);
			pressEscape();
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('useNotifyOpenLayerObserver', () => {
		function Layer({ isEnabled }: { isEnabled?: boolean }) {
			useNotifyOpenLayerObserver({ isOpen: true, onClose: jest.fn(), isEnabled });
			return null;
		}

		function getOpenLayerCount({ isEnabled }: { isEnabled?: boolean }): number {
			const { result } = renderHook(() => useOpenLayerObserver(), {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<Layer isEnabled={isEnabled} />
					</OpenLayerObserver>
				),
			});
			if (!result.current) {
				throw new Error('The observer is missing');
			}
			return result.current.getCount();
		}

		it('should register an open layer by default', () => {
			expect(getOpenLayerCount({})).toBe(1);
		});

		it('should not register an open layer when isEnabled is false', () => {
			expect(getOpenLayerCount({ isEnabled: false })).toBe(0);
		});

		it('should not call onClose from closeLayers when isEnabled is false', () => {
			const onClose = jest.fn();
			function ClosableLayer() {
				useNotifyOpenLayerObserver({ isOpen: true, onClose, isEnabled: false });
				return null;
			}
			const { result } = renderHook(() => useOpenLayerObserver(), {
				wrapper: ({ children }) => (
					<OpenLayerObserver>
						{children}
						<ClosableLayer />
					</OpenLayerObserver>
				),
			});

			result.current?.closeLayers();

			expect(onClose).not.toHaveBeenCalled();
		});
	});

	describe('useOpenLayerObserver', () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<OpenLayerObserver>{children}</OpenLayerObserver>
		);

		it('should return the observer by default', () => {
			const { result } = renderHook(() => useOpenLayerObserver(), { wrapper });

			expect(result.current).not.toBeNull();
		});

		it('should return the observer when isEnabled is true', () => {
			const { result } = renderHook(() => useOpenLayerObserver({ isEnabled: true }), { wrapper });

			expect(result.current).not.toBeNull();
		});

		it('should return null when isEnabled is false', () => {
			const { result } = renderHook(() => useOpenLayerObserver({ isEnabled: false }), { wrapper });

			expect(result.current).toBeNull();
		});
	});
});
