/* eslint-disable testing-library/no-node-access */
// @ts-nocheck
import React from 'react';

import { render } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Select from '../../select';

/**
 * Pins the open-layer observer wiring across the flag flip: legacy
 * `NotifyOpenLayerObserver` runs when the flag is off; on the top-layer path
 * `MenuPortalTopLayer` registers the menu as `type='popup'` instead.
 *
 * Stubs `@atlaskit/layering` and asserts on the spy's call counts.
 */

const legacyObserverSpy = jest.fn();
jest.mock('@atlaskit/layering/experimental/open-layer-observer', () => ({
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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Legacy NotifyOpenLayerObserver - flag ON (top-layer registers as popup)', () => {
	// Flag-on: legacy observer suppressed; `MenuPortalTopLayer` registers as
	// `type='popup'` so `closeLayers({ target: 'popup' })` (Modal / Drawer)
	// can dismiss it. `Popover` also calls the hook untyped, but only typed
	// registrations are `closeLayers`-aware.
	it('flag ON, no portal target - registers a typed "popup" with the observer', () => {
		passGate('platform-dst-top-layer');
		render(<Select menuIsOpen options={options} />);
		const popupOpens = legacyObserverSpy.mock.calls.filter(
			([event, payload]) => event === 'open' && payload.type === 'popup',
		);
		expect(popupOpens).toHaveLength(1);
	});

	it('flag ON, with portal target - registers a typed "popup" with the observer', () => {
		passGate('platform-dst-top-layer');
		render(<Select menuIsOpen menuPortalTarget={document.body} options={options} />);
		const popupOpens = legacyObserverSpy.mock.calls.filter(
			([event, payload]) => event === 'open' && payload.type === 'popup',
		);
		expect(popupOpens).toHaveLength(1);
	});
});
