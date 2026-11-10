import React from 'react';

import { render } from '@testing-library/react';

import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { CustomButtonItem } from '../../../../../viewers/archiveSidebar/custom-button-item';

jest.mock('@atlaskit/side-navigation/button-item', () => ({
	...jest.requireActual('@atlaskit/side-navigation/button-item'),
	ButtonItem: jest.fn(() => null),
}));

describe('CustomButtonItem', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it.each([
		{ isInsetViewer: true, isSelected: true, ariaCurrent: 'true' },
		{ isInsetViewer: true, isSelected: false, ariaCurrent: undefined },
		{ isInsetViewer: false, isSelected: true, ariaCurrent: undefined },
	])(
		'should set aria-current to $ariaCurrent and not pass isSelected on (inset: $isInsetViewer, selected: $isSelected)',
		({ isInsetViewer, isSelected, ariaCurrent }) => {
			render(
				<InsetViewerProvider isInsetViewer={isInsetViewer}>
					<CustomButtonItem isSelected={isSelected}>entry1.jpg</CustomButtonItem>
				</InsetViewerProvider>,
			);

			const { ButtonItem } = jest.requireMock('@atlaskit/side-navigation/button-item');
			const buttonItemProps = (ButtonItem as jest.Mock).mock.lastCall?.[0];
			expect(buttonItemProps).toEqual(
				expect.objectContaining({ children: 'entry1.jpg', 'aria-current': ariaCurrent }),
			);
			expect(buttonItemProps).not.toHaveProperty('isSelected');
		},
	);
});
