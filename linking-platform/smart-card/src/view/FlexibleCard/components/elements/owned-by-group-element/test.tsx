import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import OwnedByGroupElement from './index';

const testId = 'smart-element-avatar-group';

jest.mock('../../../../../state/flexible-ui-context/useFlexibleUiContext', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		ownedByGroup: [{ name: 'John Doe' }],
	})),
}));

const renderOwnedByElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<IntlProvider locale="en">
			<OwnedByGroupElement onRender={onRender} />
		</IntlProvider>,
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('OwnedByGroupElement', () => {
	it('should render trigger onRender callback when feature flag is enabled', async () => {
		const onRender = jest.fn();

		renderOwnedByElement(onRender);

		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
	});
});
