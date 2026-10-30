import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { getIconForFileType } from '../get-icon-for-file-type';
import { getLazyIconComponent } from '../lazy-component';

jest.mock('../lazy-component', () => {
	const actual = jest.requireActual('../lazy-component');
	return { ...actual, getLazyIconComponent: jest.fn(actual.getLazyIconComponent) };
});

const mockGetLazyIconComponent = getLazyIconComponent as jest.Mock;

describe('getIconForFileType', () => {
	beforeEach(() => {
		mockGetLazyIconComponent.mockClear();
	});

	describe.each([
		['on', passGate],
		['off', failGate],
	])('when platform_sl_replace_react_loadable is %s', (_, setGate) => {
		beforeEach(() => {
			setGate('platform_sl_replace_react_loadable');
		});

		it('renders the lazily loaded file format icon with its label', async () => {
			render(<>{getIconForFileType('application/pdf')}</>);

			expect(await screen.findByTestId('document-file-format-icon')).toBeInTheDocument();
		});
	});

	it('uses the cached React.lazy icon and returns a stable component type when platform_sl_replace_react_loadable is on', () => {
		passGate('platform_sl_replace_react_loadable');

		const first = getIconForFileType('application/pdf') as React.ReactElement;
		const second = getIconForFileType('application/pdf') as React.ReactElement;

		expect(first.type).toBe(second.type);
		expect(mockGetLazyIconComponent).toHaveBeenCalledTimes(2);
	});

	it('does not use the React.lazy icon when platform_sl_replace_react_loadable is off', () => {
		failGate('platform_sl_replace_react_loadable');

		getIconForFileType('application/pdf');

		expect(mockGetLazyIconComponent).not.toHaveBeenCalled();
	});
});
