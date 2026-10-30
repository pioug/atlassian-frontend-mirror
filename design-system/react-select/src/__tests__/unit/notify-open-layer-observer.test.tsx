// @ts-nocheck
import React from 'react';

import { act, render, screen } from '@testing-library/react';

import { hasOpenDialogOrPopover } from '@atlaskit/top-layer/page-surface/has-open-dialog-or-popover';
import { requestClosePopovers } from '@atlaskit/top-layer/page-surface/request-close-popovers';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Select from '../../select';
import StateManagedSelect from '../../state-manager';

/**
 * Pins the open layer wiring across the flag flip: legacy
 * `NotifyOpenLayerObserver` runs when the flag is off. On the top-layer path
 * nothing registers with the observer; the menu `Popover` has an `onClose`, so
 * `hasOpenDialogOrPopover` finds it and `requestClosePopovers` closes it.
 *
 * Stubs `@atlaskit/layering` and asserts on the spy's call counts.
 */

const legacyObserverSpy = jest.fn();
jest.mock('@atlaskit/layering/use-notify-open-layer-observer', () => ({
	...jest.requireActual('@atlaskit/layering/use-notify-open-layer-observer'),
	__esModule: true,
	useNotifyOpenLayerObserver: ({
		type,
		isOpen,
		onClose,
	}: {
		type?: 'popup' | 'modal';
		isOpen: boolean;
		onClose: () => void;
	}) => {
		// Mirror the real hook: register only when `isOpen` is true, record
		// the `type` so tests can assert which calls are `closeLayers`-aware,
		// and fire open/close once per `isOpen` flip.
		const React = require('react');
		React.useEffect(() => {
			if (isOpen) {
				legacyObserverSpy('open', { type, onClose });
				return () => legacyObserverSpy('close');
			}
			return undefined;
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isOpen, type]);
	},
}));

const options = [
	{ label: 'one', value: '1' },
	{ label: 'two', value: '2' },
];

beforeEach(() => {
	legacyObserverSpy.mockClear();
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Legacy NotifyOpenLayerObserver - flag OFF (still fires)', () => {
	it('flag OFF, no portal target - observer fires "open" once when menuIsOpen', () => {
		failGate('platform-dst-top-layer');
		render(<Select menuIsOpen options={options} />);
		const opens = legacyObserverSpy.mock.calls.filter(([type]) => type === 'open');
		expect(opens).toHaveLength(1);
	});

	it('flag OFF, with portal target - observer fires "open" once when menuIsOpen', () => {
		failGate('platform-dst-top-layer');
		render(<Select menuIsOpen menuPortalTarget={document.body} options={options} />);
		const opens = legacyObserverSpy.mock.calls.filter(([type]) => type === 'open');
		expect(opens).toHaveLength(1);
	});
});

describe('Open layers - flag ON (found through the DOM, not the observer)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it.each([
		['no portal target', {}],
		['with portal target', { menuPortalTarget: document.body }],
	])('flag ON, %s - does not register with the observer', (_, extraProps) => {
		render(<Select menuIsOpen options={options} {...extraProps} />);
		expect(legacyObserverSpy).not.toHaveBeenCalled();
	});

	it.each([
		['no portal target', {}],
		['with portal target', { menuPortalTarget: document.body }],
	])('flag ON, %s - the open menu is an open layer', (_, extraProps) => {
		const { rerender } = render(<Select menuIsOpen options={options} {...extraProps} />);
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		expect(hasOpenDialogOrPopover()).toBe(true);

		rerender(<Select menuIsOpen={false} options={options} {...extraProps} />);
		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('flag ON - requestClosePopovers closes the menu', () => {
		const onMenuClose = jest.fn();
		render(
			<StateManagedSelect
				defaultMenuIsOpen
				options={options}
				onMenuClose={onMenuClose}
				aria-label="choose option"
			/>,
		);
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		act(() => {
			requestClosePopovers();
		});

		expect(onMenuClose).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('flag ON - requestClosePopovers outside the select leaves the menu open', () => {
		const onMenuClose = jest.fn();
		const outside = document.createElement('div');
		document.body.appendChild(outside);
		render(<Select menuIsOpen options={options} onMenuClose={onMenuClose} />);

		act(() => {
			requestClosePopovers({ within: outside });
		});

		expect(onMenuClose).not.toHaveBeenCalled();
		outside.remove();
	});
});
