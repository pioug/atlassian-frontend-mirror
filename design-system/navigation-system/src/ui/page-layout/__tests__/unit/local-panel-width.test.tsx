import React from 'react';

import { renderToString } from 'react-dom/server';

import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { localPanelWidthVar } from '../../constants';
import { DangerouslyHoistSlotSizes } from '../../hoist-slot-sizes-context';
import type { LayoutAreaState } from '../../layout-area-sizing-context';
import { LocalPanelSurface } from '../../local-panel-surface';

const noop = () => {};

function Surface({
	hoist = true,
	managedSizing,
}: {
	hoist?: boolean;
	managedSizing?: LayoutAreaState;
}): JSX.Element {
	return (
		<DangerouslyHoistSlotSizes.Provider value={hoist}>
			<LocalPanelSurface
				label="Preview"
				resizeLabel="Resize preview"
				defaultWidth={600}
				minWidth={320}
				layoutRef={{ current: null }}
				managedSizing={managedSizing}
				getManagedResizeBounds={() => undefined}
				onManagedResizeStart={noop}
				onManagedResize={noop}
				onManagedResizeEnd={noop}
				onWidthChange={noop}
				onResizeEnd={noop}
			>
				Preview content
			</LocalPanelSurface>
		</DangerouslyHoistSlotSizes.Provider>
	);
}

beforeEach(() => failGate('platform-dst-motion-uplift-panel'));
afterEach(() => jest.restoreAllMocks());

it('publishes constrained CSS geometry before allocation and keeps the observer across mode changes', () => {
	let notifyResize: ResizeObserverCallback = noop;
	const observe = jest.fn();
	const disconnect = jest.fn();
	jest.spyOn(window, 'ResizeObserver').mockImplementation((callback) => {
		notifyResize = callback;
		return { observe, disconnect, unobserve: noop };
	});
	jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockReturnValue({ width: 380 } as DOMRect);
	const { rerender, unmount } = render(<Surface />);
	const panel = screen.getByRole('region', { name: 'Preview' });
	expect(panel).toBeVisible();
	expect(observe).toHaveBeenCalledWith(panel, { box: 'border-box' });
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('380px');

	const publish = (width: number) => {
		act(() =>
			notifyResize(
				[
					{
						target: panel,
						borderBoxSize: [{ inlineSize: width }],
					} as unknown as ResizeObserverEntry,
				],
				{} as ResizeObserver,
			),
		);
	};
	// Neither allocated nor requested widths are used as a substitute for rendered geometry.
	rerender(<Surface managedSizing={{ mode: 'inline', width: 500, minWidth: 320 }} />);
	publish(500);
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('500px');
	rerender(<Surface managedSizing={{ mode: 'overlay', width: 270, minWidth: 270 }} />);
	publish(270);
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('270px');
	expect(observe).toHaveBeenCalledTimes(1);
	unmount();
	expect(disconnect).toHaveBeenCalledTimes(1);
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('');
});

it('does not let a non-hoisting layout overwrite or clear the primary layout width', () => {
	const observer = jest.spyOn(window, 'ResizeObserver').mockImplementation(() => ({
		observe: noop,
		disconnect: noop,
		unobserve: noop,
	}));
	jest
		.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
		.mockReturnValue({ width: 480 } as DOMRect);
	const { rerender, unmount } = render(<Surface />);
	const { unmount: unmountSecondary } = render(<Surface hoist={false} />);
	expect(observer).toHaveBeenCalledTimes(1);
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('480px');
	unmountSecondary();
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('480px');
	rerender(<Surface hoist={false} />);
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('');
	rerender(<Surface />);
	expect(observer).toHaveBeenCalledTimes(2);
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('480px');
	unmount();
});

it('does not measure or publish during SSR', () => {
	const errorsMock = jest.spyOn(console, 'error').mockImplementation(() => {});
	const observer = jest.spyOn(window, 'ResizeObserver');
	const measure = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
	expect(renderToString(<Surface />)).toContain('Preview content');
	expect(observer).not.toHaveBeenCalled();
	expect(measure).not.toHaveBeenCalled();
	expect(document.documentElement.style.getPropertyValue(localPanelWidthVar)).toBe('');
	expect(
		errorsMock.mock.calls.filter(
			([message]) => !String(message).includes('useLayoutEffect does nothing on the server'),
		),
	).toEqual([]);
});
