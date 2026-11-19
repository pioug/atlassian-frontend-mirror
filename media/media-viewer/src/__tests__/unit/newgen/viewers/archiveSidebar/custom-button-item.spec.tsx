import React from 'react';

import { render } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { CustomButtonItem } from '../../../../../viewers/archiveSidebar/custom-button-item';

jest.mock('@atlaskit/menu/button-item', () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

jest.mock('@atlaskit/side-navigation/button-item', () => ({
	...jest.requireActual('@atlaskit/side-navigation/button-item'),
	ButtonItem: jest.fn(() => null),
}));

describe('CustomButtonItem', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe.each([
		{
			gateState: 'off',
			setGate: failGate,
			getButtonItem: () =>
				jest.requireMock('@atlaskit/side-navigation/button-item').ButtonItem as jest.Mock,
		},
		{
			gateState: 'on',
			setGate: passGate,
			getButtonItem: () => jest.requireMock('@atlaskit/menu/button-item').default as jest.Mock,
		},
	])('when platform_media_viewer_remove_nav3 is $gateState', ({ setGate, getButtonItem }) => {
		it.each([
			{ isInsetViewer: true, isSelected: true, ariaCurrent: 'true' },
			{ isInsetViewer: true, isSelected: false, ariaCurrent: undefined },
			{ isInsetViewer: false, isSelected: true, ariaCurrent: undefined },
		])(
			'should set aria-current to $ariaCurrent and not pass isSelected on (inset: $isInsetViewer, selected: $isSelected)',
			({ isInsetViewer, isSelected, ariaCurrent }) => {
				setGate('platform_media_viewer_remove_nav3');
				render(
					<InsetViewerProvider isInsetViewer={isInsetViewer}>
						<CustomButtonItem isSelected={isSelected}>entry1.jpg</CustomButtonItem>
					</InsetViewerProvider>,
				);

				const buttonItemProps = getButtonItem().mock.lastCall?.[0];
				expect(buttonItemProps).toEqual(
					expect.objectContaining({ children: 'entry1.jpg', 'aria-current': ariaCurrent }),
				);
				expect(buttonItemProps).not.toHaveProperty('isSelected');
			},
		);
	});
});
