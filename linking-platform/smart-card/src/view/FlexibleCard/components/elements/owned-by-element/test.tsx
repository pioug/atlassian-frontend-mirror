import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import OwnedByElement from './index';

const testId = 'smart-element-text';

jest.mock('../../../../../state/flexible-ui-context', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		ownedBy: 'John Doe',
	})),
}));

const renderOwnedByElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<IntlProvider locale="en">
			<OwnedByElement onRender={onRender} />
		</IntlProvider>,
	);
};

describe('OwnedByElement', () => {
	it('should render trigger onRender callback when feature flag is enabled', async () => {
		const onRender = jest.fn();

		renderOwnedByElement(onRender);

		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
	});
});
