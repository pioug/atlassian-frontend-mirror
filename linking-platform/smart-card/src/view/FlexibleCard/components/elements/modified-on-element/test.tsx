import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ModifiedOnElement from './index';

jest.mock('../../../../../state/flexible-ui-context', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		modifiedOn: '2023-10-01T12:00:00Z',
	})),
}));

const renderModifiedOnElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<IntlProvider locale="en">
			<ModifiedOnElement onRender={onRender} />
		</IntlProvider>,
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ModifiedOnElement', () => {
	it('should render trigger onRender callback when feature flag is enabled', async () => {
		const onRender = jest.fn();

		renderModifiedOnElement(onRender);

		const element = await screen.findByTestId('smart-element-date-time');
		expect(element).toBeTruthy();
		expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
	});
});
